<?php

namespace FH_Migration;

class EventsTagsClass extends MigrationClass implements MigrationInterface {
	public string $query_code = <<<'QUERY'
						query {
						  allGraphCmsTag(filter: {stage: {eq: PUBLISHED}, locale: {ne: de}}) {
						    group(field: remoteId) {
						      fieldValue
						      nodes {
						        label
						        locale
						        color
						        id
						      }
						    }
						  }
						}
						QUERY;

	public function migrate() {
		global $sitepress;
		$data = $this->getData();
		foreach ($data['allGraphCmsTag']['group'] as $categories) {

			$main_category_key = array_search('en', array_column($categories['nodes'], 'locale'));
			$main_raw_category = $categories['nodes'][$main_category_key];
			$main_category = wp_insert_term( $main_raw_category['label'], 'event_tag' );
			if (is_wp_error($main_category)) {
				$main_category = get_term_by('slug', sanitize_title( $main_raw_category['label'] ), 'event_tag', 'ARRAY_A');
			}
			add_term_meta($main_category['term_id'], 'hygraph_id', $main_raw_category['id']);
			update_field('tag_color', $this->matchColors($main_raw_category['color']), 'event_tag_' . $main_category['term_id']);
			$sitepress->set_element_language_details($main_category['term_taxonomy_id'],'tax_event_tag', false, 'en', $sitepress->get_default_language());
			$trid = $sitepress->get_element_trid($main_category['term_taxonomy_id'], 'tax_event_tag');
			unset($categories['nodes'][$main_category_key]);

			foreach ($categories['nodes'] as $category) {
				if (!term_exists($category['label'], 'event_tag')) {
					$inserted_category = wp_insert_term( $category['label'], 'event_tag' );
				}
				else {
					$inserted_category = wp_insert_term( $category['label'], 'event_tag', ['slug' => sanitize_title( $category['label'] ) . '-' . $category['locale']] );
				}
				if (!is_wp_error($inserted_category)) {
					add_term_meta($inserted_category['term_id'], 'hygraph_id', $category['id']);
					update_field('tag_color', $this->matchColors($category['color']), 'event_tag_' . $inserted_category['term_id']);
					$sitepress->set_element_language_details($inserted_category['term_taxonomy_id'],'tax_event_tag', $trid, $category['locale'], $sitepress->get_default_language());
				}
			}
		}
		return $data;
	}

	private function matchColors( $value ): string {
		return match ($value) {
			"algea" => "algea",
			"coral" => "coral",
			"crop"  => "yellow",
			"fire"  => "red",
			"flower"    => "flower",
			"glacier"   => "glacier",
			"grass" => "green",
			"grey"  => "gray",
			"sea"   => "sea",
			"sky"   => "blue",
			default => 'gray'
		};
	}
}
