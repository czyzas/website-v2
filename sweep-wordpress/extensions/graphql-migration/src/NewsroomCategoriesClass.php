<?php

namespace FH_Migration;

class NewsroomCategoriesClass extends MigrationClass implements MigrationInterface {
	public string $query_code = <<<'QUERY'
						query {
						  allGraphCmsCategory(filter: {usage: {eq: Newsroom}, stage: {eq: PUBLISHED}, locale: {ne: de}}) {
						    group(field: remoteId) {
						      fieldValue
						      nodes {
						        label
						        locale
						        id
						      }
						    }
						  }
						}
						QUERY;

	public function migrate() {
		global $sitepress;
		$data = $this->getData();
		foreach ($data['allGraphCmsCategory']['group'] as $categories) {

			$main_category_key = array_search('en', array_column($categories['nodes'], 'locale'));
			$main_raw_category = $categories['nodes'][$main_category_key];
			$main_category = wp_insert_term( $main_raw_category['label'], 'newsroom-category' );
			if (is_wp_error($main_category)) {
				$main_category = get_term_by('slug', sanitize_title( $main_raw_category['label'] ), 'newsroom-category', 'ARRAY_A');
			}
			add_term_meta($main_category['term_id'], 'hygraph_id', $main_raw_category['id']);
			$sitepress->set_element_language_details($main_category['term_taxonomy_id'],'tax_newsroom-category', false, 'en', $sitepress->get_default_language());
			$trid = $sitepress->get_element_trid($main_category['term_taxonomy_id'], 'tax_newsroom-category');
			unset($categories['nodes'][$main_category_key]);

			foreach ($categories['nodes'] as $category) {
				if (!term_exists($category['label'], 'newsroom-category')) {
					$inserted_category = wp_insert_term( $category['label'], 'newsroom-category' );
				}
				else {
					$inserted_category = wp_insert_term( $category['label'], 'newsroom-category', ['slug' => sanitize_title( $category['label'] ) . '-' . $category['locale']] );
				}
				if (!is_wp_error($inserted_category)) {
					add_term_meta($inserted_category['term_id'], 'hygraph_id', $category['id']);
					$sitepress->set_element_language_details($inserted_category['term_taxonomy_id'],'tax_newsroom-category', $trid, $category['locale'], $sitepress->get_default_language());
				}
			}
		}
		return $data;
	}
}
