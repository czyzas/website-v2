<?php

namespace FH_Migration;

use DOMDocument;
use WP_Query;

class NewsroomBasicClass extends MigrationClass implements MigrationInterface
{
	public string $query_code = <<<'QUERY'
						query ($limit: Int, $skip: Int, $locale: GraphCMS_Locale) {
						  allGraphCmsArticle(
						    filter: {category: {usage: {eq: Newsroom}, stage: {eq: PUBLISHED}}, locale: {eq: $locale, ne: de}}
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
						      publishedAt
						      category {
						        id
						      }
						      coverImage {
						        url
						        id
						        alt
						        fileName
						        mimeType
						      }
						      content {
						        remoteChildren {
						          ... on GraphCMS_ContentCard {
						            id
						            remoteTypeName
						            content {
						              html
						              json
						            }
						          }
						          ... on GraphCMS_CallOut {
						            id
						            remoteTypeName
						            theme
						            title
						            details {
						              html
						            }
						          }
						          ... on GraphCMS_TitleCard {
						            id
						            remoteTypeName
						            title
						            headingLevel
						          }
						          ... on GraphCMS_FullWidthImage {
						            id
						            remoteTypeName
						            asset {
						              id
						              url
						              fileName
						              mimeType
						              alt
						            }
						          }
						        }
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
			foreach ( $data['allGraphCmsArticle']['nodes'] as $article ) {

				$hygraph_id = $article['id'];
				$sitepress->switch_lang($this->locale);
				$check_post_args = array(
					'posts_per_page'   => 1,
					'post_type'        => 'newsroom',
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
						'post_type' => 'newsroom',
						'post_title' => $article['title'],
						'post_name' => $article['slug'],
						'post_date' => $article['publishedAt'],
						'post_status' => 'publish'
					];

					$article_id = wp_insert_post( $article_args, true );
					if ( !is_wp_error( $article_id ) ) {
						add_post_meta($article_id, 'hygraph_id', $hygraph_id);
						if ($article['locale'] != 'en') {
							$trid = $this->getTrid($hygraph_id, 'newsroom');
						}
						$sitepress->set_element_language_details( $article_id,
							'post_newsroom',
							$trid ?? false,
							$article['locale'],
							$sitepress->get_default_language() );

						$this->addThumbnail($article['coverImage'], $article_id);

						$this->addTermToPost($article['category']['id'] ?? '', $article_id);

						foreach ($article['content']['remoteChildren'] as $child) {
							switch ($child['remoteTypeName']) {
								case 'CallOut':
									$this->addRichTextField( $article_id, $child, true );
									break;
								case 'TitleCard':
									$this->addArticleTitleField( $article_id, $child );
									break;
								case 'ContentCard':
									$this->addRichTextField($article_id, $child);
									break;
								case 'FullWidthImage':
									$this->addFullWidthImageField( $article_id, $child['asset'] );
									break;
							}
						}
					}
				}
			}
			$this->query_variables['skip'] = $data['allGraphCmsArticle']['pageInfo']['currentPage'] * $data['allGraphCmsArticle']['pageInfo']['itemCount'];
		} while (0);
//		} while ($data['allGraphCmsArticle']['pageInfo']['pageCount'] > $data['allGraphCmsArticle']['pageInfo']['currentPage']);

		return $data;
	}

	private function addRichTextField( int $article_id, mixed $child, bool $add_title = false ) {
		$fields = [
			'acf_fc_layout' => 'rich-text-content'
		];

		if ($add_title) {
			$replaced_html = $html = $child['details']['html'];
			$images = $this->parseHTMLForIMG($html);
			if ($images) {
				$replaced_html = $this->replaceImagesInHTML($html, $child['details']['json'], $images, $article_id);
			}
			$fields['field_664729befd0bb'] = 1;
			$fields['field_66472a1cfd0bc'] = match($child['theme']) {
				"LIGHT" => "gray",
				"BLUE" => "blue",
				"GREEN" => "green",
				"DARK" => "purple",
				"YELLOW" => "yellow",
				"PINK" => "red"
			};
			$fields['field_664729b1fd0ba'] = '<h2>' . $child['title'] . '</h2>' . $replaced_html;
		}
		else {
			$replaced_html = $html = $child['content']['html'];
			$images = $this->parseHTMLForIMG($html);
			if ($images) {
				$replaced_html = $this->replaceImagesInHTML($html, $child['content']['json'], $images, $article_id);
			}
			$fields['field_664729b1fd0ba'] = $replaced_html;
		}
		add_row('field_5d380cd69121e', $fields, $article_id);
	}

	private function addArticleTitleField( int $article_id, mixed $child ) {
		add_row('field_5d380cd69121e', [
			'acf_fc_layout' => 'article-title',
			'field_665073570ecac' => in_array($child['headingLevel'],['h2', 'h3']) ? $child['headingLevel'] : 'h3',
			'field_665073370ecab' => $child['title']
		], $article_id);
	}

	private function addFullWidthImageField( int $article_id, mixed $asset ) {
		$attachment = new PhotoClass($asset, $article_id);
		$attachment_id = $attachment->getId();

		add_row('field_5d380cd69121e', [
			'acf_fc_layout' => 'rich-text-content',
			'field_664729b1fd0ba' => wp_get_attachment_image($attachment_id, 'bootstrap-container')
		], $article_id);
	}

	private function addTermToPost( mixed $category_hygraph_id, int $article_id ): void {
		global $sitepress;
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
			'taxonomy'  => 'newsroom-category',
		);
		$sitepress->switch_lang($this->locale);
		$terms = get_terms( $args );

		if (!empty($terms)) {
			wp_set_post_terms($article_id, $terms, 'newsroom-category', true);
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
}
