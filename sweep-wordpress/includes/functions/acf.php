<?php

//add_action( 'acf/init', function () {
//	acf_update_setting( 'google_api_key', 'AIzaSyCRPjv9FXcWodJmJ1YU4Nq87F0VMjFl_NE' );
//
//	// Add options page programatically for Polylang
//	if ( function_exists( 'acf_add_options_page' ) && function_exists( 'pll_languages_list' ) ) {
//		$langs = pll_languages_list();
//		foreach ( $langs as $lang ) {
//			#TODO: Ogarnąć lepiej menu_slug/post_id tak aby ACF łapał od razu
//			acf_add_options_sub_page( [
//				'page_title'  => "Options: $lang",
//				'menu_title'  => "Options: $lang",
//				'menu_slug'   => "options-$lang",
//				'post_id'     => "options-$lang",
//				'parent_slug' => 'options'
//			] );
//		}
//	}
//} );


/**
 * Local JSON Functionality to save
 *
 * @return string
 */
add_filter( 'acf/settings/save_json', function () {
	return get_stylesheet_directory() . '/includes/acf-json';
} );

/**
 * Local JSON Functionality to load
 *
 * @param $paths
 * @return mixed
 */
add_filter( 'acf/settings/load_json', function ( $paths ) {
	// remove original path (optional)
	unset( $paths[0] );

	// append path
	$paths[] = get_stylesheet_directory() . '/includes/acf-json';

	// return
	return $paths;
} );
