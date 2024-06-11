<?php

namespace FH_Migration;

use DOMDocument;
use WP_Query;

class EventBasicClass extends MigrationClass implements MigrationInterface
{
	public string $query_code = <<<'QUERY'
						query ($limit: Int, $skip: Int, $locale: GraphCMS_Locale, $remoteId: ID) {
						  allGraphCmsEvent(
						    filter: {category: {stage: {eq: PUBLISHED}}, locale: {eq: $locale, ne: de}, remoteId: {eq: $remoteId}}
						    sort: {fields: remoteId}
						    limit: $limit
						    skip: $skip
						  ) {
						    totalCount
						    pageInfo {
						      perPage
						      totalCount
						      pageCount
						      itemCount
						      currentPage
						    }
						    nodes {
						      id
						      remoteId
						      title
						      locale
						      slug
						      endDate
						      language
						      startDate
						      abstract
						      formName
						      publishedAt
						      category {
						        id
						        label
						      }
						      tags {
						        id
						        label
						      }
						      coverImage {
						        url
						        id
						        alt
						        fileName
						        mimeType
						      }
						      content {
						        html
						        json
						      }
						      hosts {
						        person {
						          firstName
						          lastName
						          role
						          photo {
						            alt
						            fileName
						            mimeType
						            url
						            id
						          }
						          company {
						            logo {
						              alt
						              id
						              fileName
						              mimeType
						              url
						            }
						          }
						        }
						      }
						      location {
						        city
						        addressLine1
						        addressLine2
						        country
						        postcode
						      }
						    }
						  }
						}
						QUERY;

	public function migrate() {
		global $sitepress;
		if ( ! is_admin() ) {
			require_once( ABSPATH . 'wp-admin/includes/post.php' );
		}
		do {
			$data = $this->getData();
			foreach ( $data['allGraphCmsEvent']['nodes'] as $article ) {

				$hygraph_id = $article['id'];
				$sitepress->switch_lang($this->locale);
				$check_post_args = array(
					'posts_per_page'   => 1,
					'post_type'        => 'event',
					'meta_query' => array(
						array(
							'key'       => 'hygraph_id',
							'value'     => $hygraph_id,
							'compare'   => '='
						)
					)
				);
				$check_post = new WP_Query( $check_post_args );

				if (!$check_post->have_posts() ) {
					$article_args = [
						'post_type' => 'event',
						'post_title' => $article['title'],
						'post_name' => $article['slug'],
						'post_date' => $article['publishedAt'],
						'post_status' => 'publish'
					];

					$article_id = wp_insert_post( $article_args, true );
					if ( !is_wp_error( $article_id ) ) {
						add_post_meta($article_id, 'hygraph_id', $hygraph_id);
						if ($article['locale'] != 'en') {
							$trid = $this->getTrid($hygraph_id, 'event');
						}
						$sitepress->set_element_language_details( $article_id,
							'post_event',
							$trid ?? false,
							$article['locale'],
							$sitepress->get_default_language() );

						update_field('event_location', $article['location']['city'] ?? '', $article_id);
						update_field('event_date', $article['startDate'], $article_id);
						update_field('event_language', $article['language'], $article_id);
						update_field('form_name', $article['formName'], $article_id);
						update_field('introduction', $article['abstract'], $article_id);

						$this->addThumbnail($article['coverImage'], $article_id);
						$this->addRichTextField($article_id, $article);
						$this->addTeamField($article_id, $article['hosts']);
						$this->addLocation($article['location'], $article_id, $article['locale']);

						foreach ($article['tags'] as $tag) {
							$this->addTermToPost($tag['id'] ?? '', $article_id, '_tag');
						}
						$this->addTermToPost($article['category']['id'] ?? '', $article_id);

					}
				}
			}
			$this->query_variables['skip'] = $data['allGraphCmsEvent']['pageInfo']['currentPage'] * $data['allGraphCmsEvent']['pageInfo']['itemCount'];
		} while (0);
//		} while ($data['allGraphCmsEvent']['pageInfo']['pageCount'] > $data['allGraphCmsEvent']['pageInfo']['currentPage']);

		return $data;
	}

	private function addRichTextField( int $article_id, mixed $child ) {
		$fields = [
			'acf_fc_layout' => 'rich-text-content'
		];

		$replaced_html = $html = $child['content']['html'];
		$images = $this->parseHTMLForIMG($html);
		if ($images) {
			$replaced_html = $this->replaceImagesInHTML($html, $child['content']['json'], $images, $article_id);
		}
		$fields['field_664729b1fd0ba'] = $replaced_html;

		add_row('field_5d380cd69121e', $fields, $article_id);
	}
	private function addTeamField( int $article_id, array $hosts ) {
		$team = [];

		foreach ($hosts as $host) {
			$person = $host['person'];
			$image = new PhotoClass($person['photo'], $article_id);
			$logo = new PhotoClass($person['company']['logo'] ?? [], $article_id);
			$team[] = [
				'image' => $image->getId(),
				'name' => $person['firstName'] . ' ' . $person['lastName'],
				'position' => $person['role'],
				'logo' => $logo->getId(),
			];
		}

		$fields = [
			'acf_fc_layout' => 'team',
			'field_66505675d6543' => '3',
			'field_6626305a57ea0' => $team
		];

		add_row('field_5d380cd69121e', $fields, $article_id);
	}

	private function addTermToPost( mixed $category_hygraph_id, int $article_id, string $taxonomy = '-category' ): void {
		global $sitepress;
		$taxonomy = 'event' . $taxonomy;
		$args = array(
			'hide_empty' => false,
			'fields'      => 'ids',
			'meta_query' => array(
				array(
					'key'       => 'hygraph_id',
					'value'     => $category_hygraph_id,
					'compare'   => '='
				)
			),
			'taxonomy'  => $taxonomy,
		);
		$sitepress->switch_lang($this->locale);
		$terms = get_terms( $args );

		if (!empty($terms)) {
			wp_set_post_terms($article_id, $terms, $taxonomy, true);
		}
	}

	private function addThumbnail( array $asset, int $article_id ):void {
		$attachment = new PhotoClass($asset, $article_id);
		$attachment_id = $attachment->getId();

		update_field('image', $attachment_id, $article_id);
	}

	private function parseHTMLForIMG($html): array {
		$doc = new DOMDocument();
		@$doc->loadHTML($html);

		$tags = $doc->getElementsByTagName('img');
		$image_hygraph_ids = [];
		foreach ($tags as $tag) {
			$src = $tag->getAttribute('src');
			$parsed_url = explode( '/', $src );
			$image_hygraph_ids[] = ['src' => $src, 'id' => end( $parsed_url )];
		}
		return $image_hygraph_ids;
	}

	private function replaceImagesInHTML( string $html, array $json, array $images, int $article_id ) {
		$assets = array_filter($json['children'], function ($element) {
			return $element['type'] === 'image';
		});
		foreach ($images as $url => $image) {
			foreach ($assets as $key => $asset) {
				if ($image['id'] === $asset['handle']) {
					$image_asset = [
						'id' => $asset['handle'],
						'fileName' => $asset['title'],
						'url' => 'https://media.graphassets.com/' . $asset['handle'],
						'alt' => $asset['altText'] ?? '',
						'mimeType' => $asset['mimeType']
					];
					$attachment = new PhotoClass($image_asset, $article_id);
					$attachment_id = $attachment->getId();
					$attachment_tag = wp_get_attachment_url($attachment_id);

					$html = str_replace($image['src'], $attachment_tag, $html);
					unset($assets[$key]);
					break;
				}
			}
		}

		return $html;
	}

	private function addLocation( mixed $location, int $article_id, string $lang ) {
		if ($location) {
			add_row('field_5d380cd69121e', [
				'acf_fc_layout' => 'article-title',
				'field_665073570ecac' => 'h2',
				'field_665073370ecab' => $lang == 'en' ? 'Location' : 'Emplacement'
			], $article_id);

			add_row('field_5d380cd69121e', [
				'acf_fc_layout' => 'sourced-info',
				'field_66506decd3192' => 'vertical',
				'field_66506dc9d3191' => 0,
				'field_66389fd78c126' => implode(', ', array_filter([$location['addressLine1'], $location['addressLine2'] , $location['postcode'], $location['city'], $location['country']]))
			], $article_id);
		}
	}
}
