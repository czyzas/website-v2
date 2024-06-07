<?php

use WPGraphQL\Utils\Utils;

/**
 * Registers a new "wpmlLanguage" input field on ACF options pages queries, and
 * uses translated options page content based on the language code supplied
 * @copyright  [SOURCE](https://github.com/Ririshi/wp-graphql-wpml/blob/feat/acf-options-pages-language-filter/acf-compatibility.php)
 */
add_action( 'graphql_register_types', function () {
	try {
		$options_pages = acf_get_options_pages();
		foreach ( $options_pages as $options_page ) {
			// Check if the option page should be shown in GraphQL schema
			if ( !isset( $options_page['show_in_graphql'] ) || false === (bool)$options_page['show_in_graphql'] ) {
				continue;
			}
			$type_name = $options_page['graphql_type_name'];
			$field_name = graphql_format_field_name( $type_name . 'ByLang' );

			register_graphql_field( 'RootQuery', $field_name, [
				'type'    => $type_name,
				'args'    => [
					'lang' => [
						'type'        => 'String',
						'description' => 'Filter by WPML language code',
					],
				],
				'resolve' => function ( $unused, $args ) use ( $options_page ) {
					if ( isset( $args['lang'] ) ) {
						$lang = $args['lang'];
						do_action( 'wpml_switch_language', $lang );
						acf_update_setting( 'current_language', $lang );
					}

					return !empty( $options_page ) ? $options_page : null;
				}
			] );
		}
	} catch ( Exception $exception ) {
		trigger_error( $exception->getMessage(), E_USER_WARNING );
	}
} );

//		$options_pages = acf_get_options_pages();
//		foreach ( $options_pages as $options_page ) {
//			// Check if the option page should be shown in GraphQL schema
//			if ( !isset( $options_page['show_in_graphql'] ) || false === (bool)$options_page['show_in_graphql'] ) {
//				continue;
//			}
//			$type_name = $options_page['graphql_type_name'];
//			$field_name = graphql_format_field_name( $type_name );
//			register_graphql_field( 'RootQuery', $field_name, [
//				[
//					'type'        => $type_name,
//					'args'        => [
//						'wpmlLanguage' => [
//							'type'        => 'String',
//							'description' => 'Filter by WPML language code',
//						],
//					],
//					'description' => sprintf( __( '%s options.', 'wp-graphql-acf' ), $options_page['page_title'] ),
//					'resolve'     => function ( $unused, $args ) use ( $options_page ) {
//						// If the wpmlLanguage argument exists in the arguments
//						if ( isset( $args['lang'] ) ) {
//							$lang = $args['lang'];
//							global $sitepress;
//							// If WPML is installed
//							if ( $sitepress ) {
//								// Switch the current locale WPML
//								$sitepress->switch_lang( $lang );
//								// Override ACF language explicitly, otherwise the output language doesn't change
//								acf_update_setting( 'current_language', $lang );
//							}
//						}
//
//						return !empty( $options_page ) ? $options_page : null;
//					}
//				]
//			] );
//		}

