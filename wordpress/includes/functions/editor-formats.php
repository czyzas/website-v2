<?php
/**
 * TINYMCE SETTINGS
 *
 * @param $settings
 * @return mixed
 */

add_filter( 'tiny_mce_before_init', function ( $settings ) {
	include "editor-formats/table-formats.php";

	$style_formats = [
		$table_formats ?? [],
	];

	$style_formats = array_filter( $style_formats );

	if ( $style_formats ) $settings['style_formats'] = json_encode( $style_formats );

	return $settings;
} );


add_action( 'init', function () {
	add_editor_style( 'editor-styles.css' );
} );
