<?php

namespace FH_Migration;

class TagsClass extends MigrationClass implements MigrationInterface {
	public string $query_code = <<<'QUERY'
						query {
						  allGraphCmsTag(filter: {stage: {eq: PUBLISHED}}) {
						    group(field: remoteId) {
						      fieldValue
						      nodes {
						        label
						        locale
						      }
						    }
						  }
						}
						QUERY;

	public function migrate() {
		global $sitepress;
		$data = $this->getData();
		foreach ($data['allGraphCmsTag']['group'] as $tags) {

			$remote_id = $tags['fieldValue'];
			$main_tag_key = array_search('en', array_column($tags['nodes'], 'locale'));
			$main_raw_tag = $tags['nodes'][$main_tag_key];
			$main_tag = wp_insert_term( $main_raw_tag['label'], 'post_tag' );
			if (is_wp_error($main_tag)) {
				$main_tag = get_term_by('slug', sanitize_title( $main_raw_tag['label'] ), 'post_tag', 'ARRAY_A');
			}
			add_term_meta($main_tag, 'remote_id', $remote_id);
			$sitepress->set_element_language_details($main_tag['term_taxonomy_id'],'tax_post_tag', false, 'en', $sitepress->get_default_language());
			$trid = $sitepress->get_element_trid($main_tag['term_taxonomy_id'], 'tax_post_tag');
			unset($tags['nodes'][$main_tag_key]);

			foreach ($tags['nodes'] as $tag) {
				if (!term_exists($tag['label'], 'post_tag')) {
					$inserted_tag = wp_insert_term( $tag['label'], 'post_tag' );
				}
				else {
					$inserted_tag = wp_insert_term( $tag['label'], 'post_tag', ['slug' => sanitize_title( $tag['label'] ) . '-' . $tag['locale']] );
				}
				if (!is_wp_error($inserted_tag)) {
					add_term_meta($inserted_tag['term_taxonomy_id'], 'remote_id', $remote_id);
					$sitepress->set_element_language_details($inserted_tag['term_taxonomy_id'],'tax_post_tag', $trid, $tag['locale'], $sitepress->get_default_language());
				}
			}
		}
		return $data;
	}
}
