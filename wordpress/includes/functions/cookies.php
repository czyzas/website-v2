<?php
add_action( 'acf/init', function () {
	// Add subpage cookies options when polylang is enabled
	if ( function_exists( 'acf_add_options_page' ) && function_exists( 'pll_languages_list' ) ) {
		$langs = pll_languages_list();
		foreach ( $langs as $lang ) {
			acf_add_options_sub_page( [
				'page_title'  => "Cookies: $lang",
				'menu_title'  => "Cookies: $lang",
				'menu_slug'   => "cookies-options-$lang",
				'post_id'     => "cookies-options-$lang",
				'parent_slug' => 'cookies-options'
			] );
		}
	}

	$cookies = get_options_field('cookies', 'cookies-options');
	$module_enabled = $cookies['module_enabled'] ?? false;

	if ( !$module_enabled ) {
		return;
	}

	function get_iframe_category(): string {
		return implode( ' ', get_options_field('cookies', 'cookies-options')['iframe_category'] ?: [ 'marketing' ] );
	}


	add_filter( 'acf/format_value/type=wysiwyg', 'iframes_filter', 10, 3 );
	add_filter( 'the_content', 'iframes_filter', 10, 3 );
	function iframes_filter( $content ) {
		if ( strpos( $content, "iframe" ) > -1 ) {
			$content = str_replace( ' src=', ' data-fhpc="' . get_iframe_category() . '" data-src=', $content );
		}

		return $content;
	}

	add_filter( 'embed_oembed_html', 'iframe_catcher' );
	function iframe_catcher( $iframe ) {
		return str_replace( ' src=', ' data-fhpc="' . get_iframe_category() . '" data-src=', $iframe );
	}
} );
