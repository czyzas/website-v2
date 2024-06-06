<?php

namespace FH_Migration;

class LibraryBasicClass extends MigrationClass implements MigrationInterface
{
	public string $query_code = <<<'QUERY'
						query($limit: Int, $skip: Int) {
						  allGraphCmsArticle(
						    filter: {category: {usage: {eq: Library}, stage: {eq: PUBLISHED}}}
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
							group(field: remoteId) {
							  fieldValue
							  nodes {
							    locale
							    title
							    publishedAt
							    slug
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
			foreach ( $data['allGraphCmsArticle']['group'] as $articles ) {

				$remote_id = $articles['fieldValue'];
				$main_article_key = array_search( 'en', array_column( $articles['nodes'], 'locale' ) );
				$main_raw_article = $articles['nodes'][$main_article_key];

				$article_args = [
					'post_type' => 'library',
					'post_title' => $main_raw_article['title'],
					'post_name' => $main_raw_article['slug'],
					'post_date' => $main_raw_article['publishedAt'],
					'post_status' => 'publish'
				];

				$main_article = post_exists($main_raw_article['title'], '', $main_raw_article['publishedAt'], 'library', 'publish') ?: wp_insert_post( $article_args, true );
				add_post_meta($main_article, 'remote_id', $remote_id);
				$sitepress->set_element_language_details( $main_article, 'post_library', false, 'en', $sitepress->get_default_language() );
				$trid = $sitepress->get_element_trid( $main_article, 'post_library' );
				unset( $articles['nodes'][$main_article_key] );

				foreach ( $articles['nodes'] as $article ) {
					$article_args['post_title'] = $article['title'];
					$article_args['post_name'] = $article['slug'];
					$article_args['post_date'] = $article['publishedAt'];
					$article_id = post_exists($article['title'], '', $article['publishedAt'], 'library', 'publish') ?: wp_insert_post( $article_args, true );
					if ( !is_wp_error( $article_id ) ) {
						add_post_meta($article_id, 'remote_id', $remote_id);
						$sitepress->set_element_language_details( $article_id, 'post_library', $trid, $article['locale'], $sitepress->get_default_language() );
					}
				}
			}
			$this->query_variables['skip'] = $data['allGraphCmsArticle']['pageInfo']['currentPage'] * $data['allGraphCmsArticle']['pageInfo']['itemCount'];
		} while (0);
//		} while ($data['allGraphCmsArticle']['pageInfo']['pageCount'] > $data['allGraphCmsArticle']['pageInfo']['currentPage']);

		return $data;
	}
}
