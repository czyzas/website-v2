<?php

use GraphQL\Error\UserError;
use WPGraphQL\AppContext;
use WPGraphQL\Data\Connection\AbstractConnectionResolver;

$wpgraphqlwpml_url_filter_off = false;

add_action( 'graphql_register_types', function () {
	try {
		register_graphql_fields( 'MenuToMenuItemConnectionWhereArgs', [
			'language' => [
				'type'        => 'String',
				'description' => 'filters the menu items by language',
			],
		] );
		register_graphql_fields( 'RootQueryToMenuConnectionWhereArgs', [
			'language' => [
				'type'        => 'String',
				'description' => 'filters the menus by language',
			],
		] );
//		register_graphql_field( 'RootQuery', 'menuByLang', [
//			'type'    => 'Menu',
//			'args'    => [
//				'lang'     => [
//					'type'        => [ 'non_null' => 'String', ],
//					'description' => 'Filter by WPML language code',
//				],
//				'location' => [
//					'type'        => [ 'non_null' => 'String', ],
//					'description' => 'Menu location',
//				],
//			],
//			'resolve' => function ( $source, array $args, AppContext $context ) {
//				if ( isset( $args['lang'] ) ) {
//					$lang = $args['lang'];
//					do_action( 'wpml_switch_language', $lang );
//					acf_update_setting( 'current_language', $lang );
//				}
//
//				$locations = get_nav_menu_locations();
//				if ( !isset( $locations[$args['location']] ) || !absint( $locations[$args['location']] ) ) {
//					throw new UserError( esc_html__( 'No menu set for the provided location', 'wp-graphql' ) );
//				}
//
//				$id = absint( $locations[$args['location']] );
//
//				return !empty( $id ) ? $context->get_loader( 'term' )->load_deferred( absint( $id ) ) : null;
//			}
//		] );
	} catch ( Exception $exception ) {
		trigger_error( $exception->getMessage(), E_USER_WARNING );
	}
} );

add_filter(
	'graphql_connection_query_args',
	function (
		$query_args,
//		AbstractConnectionResolver $resolver
	) {
//		global $sitepress;

		if ( !$query_args ) {
			return $query_args;
		}
//		var_dump( $query_args );

		$where_args = $query_args['graphql_args']['where'];
		if ( isset( $where_args['language'] ) ) {
			$lang = $where_args['language'];
			do_action( 'wpml_switch_language', $lang );
			acf_update_setting( 'current_language', $lang );
		}

//		if ( array_key_exists( "post_type", $query_args ) && $query_args['post_type'] === [ 'nav_menu_item' ] && $query_args['fields'] === 'ids' && isset( $query_args['tax_query'] ) ) {
//			// this is a query for menu items which currently is limited only to the locations
//			// in the current language, in order to show all language menu items we need to
//			// clear the 'tax_query' portion within args
//			$tax_query = $query_args['tax_query'];
//			$need_unset = true;
//			$query_lang = null;
//			if ( isset( $query_args['language'] ) ) {
//				$query_lang = $query_args['language'];
//			}
//			if ( count( $tax_query ) === 1 ) {
//				$first_tax_query = $tax_query[0];
//				if ( $first_tax_query['taxonomy'] === 'nav_menu' && $first_tax_query['field'] === 'term_id' ) {
//					$old_terms = $first_tax_query['terms'];
//					$resolved_terms = resolve_menu_location_filter( $old_terms, $query_lang );
//					$first_tax_query['terms'] = $resolved_terms;
//					$need_unset = false;
//
//					global $icl_adjust_id_url_filter_off;
//					// turn the terms filtering off for now
//					global $wpgraphqlwpml_url_filter_off;
//					$wpgraphqlwpml_url_filter_off = $icl_adjust_id_url_filter_off;
//					$icl_adjust_id_url_filter_off = true;
//				}
//				$query_args['tax_query'] = [ $first_tax_query ];
//			}
//			if ( $need_unset ) {
//				unset( $query_args['tax_query'] );
//			}
//		}
//		if ( !isset( $query_args['taxonomy'] ) ) {
//			return $query_args;
//		}
//		if ( $query_args['taxonomy'] !== 'nav_menu' ) {
//			return $query_args;
//		}
//
//		$graphql_args = $query_args['graphql_args'];
//
//		$cur_lang = $sitepress->get_current_language();
//
//		$have_id_query = isset( $graphql_args ) && isset( $graphql_args['where'] ) && isset( $graphql_args['where']['id'] );
//		$have_location_query = isset( $graphql_args ) && isset( $graphql_args['where'] ) && isset( $graphql_args['where']['location'] );
//
//		if ( $have_location_query && $query_args['include'] ) {
//			$location_ids = resolve_menu_location_filter( $query_args['include'], $query_args['language'] ?? null );
//			$query_args['include'] = $location_ids;
//		} else if ( $query_args['include'] && !$have_id_query ) {
//			// we have a taxonomy query, remove the includes filter to avoid restricting to localized
//			// menu locations (however, only in case the user did not query for a specific id)
//			unset( $query_args['include'] );
//		}
//
//		if ( !isset( $query_args['language'] ) ) {
//			return $query_args;
//		}
//		$target_lang = $query_args['language'];


//		// Required only when using other than the default language because the
//		// menu location for the default language is the original location
//		if ( $cur_lang !== $target_lang ) {
//			$sitepress->switch_lang( $target_lang );
//
//			if ( !has_filter( 'theme_mod_nav_menu_locations', 'wpgraphqlwpml__theme_mod_nav_menu_locations' ) ) {
//				add_filter( 'theme_mod_nav_menu_locations', 'wpgraphqlwpml__theme_mod_nav_menu_locations' );
//			}
//			//        $args['where']['location'] = wpgraphqlwpml__translate_menu_location(
//			//            $args['where']['location'],
//			//            $target_lang
//			//        );
//		}

//		unset( $target_lang );

		return $query_args;
	},
	10,
	2
);
