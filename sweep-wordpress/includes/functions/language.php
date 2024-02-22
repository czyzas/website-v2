<?php
add_action( 'acf/init', function () {
	$options = "options";

	if ( function_exists( 'pll_current_language' ) ) {
		$language = pll_current_language();
		$options = "options-$language";
	} else {
		$language = get_field( 'language', 'options' );
	}
	define( "FH_LANGUAGE", $language );
	/**
	 * Deprecate it in favor of get_options_field() function
	 * @deprecated Use {@see get_options_field()} instead
	 */
	define( "FH_OPTIONS_PAGE", $options );
	unset( $language );
	unset( $options );
} );