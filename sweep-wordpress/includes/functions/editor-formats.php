<?php
/**
 * TINYMCE SETTINGS
 *
 * @param $settings
 * @return mixed
 */

add_filter( 'tiny_mce_before_init', function ( $settings ) {

	$style_formats = [
		[
			'title' => 'Headings',
			'items' => [
				[
					'title'    => 'Heading H2 (40px)',
					'selector' => 'h1,h2,h3,h4,h5,h6',
					'classes'  => 'as-h2'
				],
				[
					'title'    => 'Heading H3 (32px)',
					'selector' => 'h1,h2,h3,h4,h5,h6',
					'classes'  => 'as-h3'
				],
				[
					'title'    => 'Heading H4 (24px)',
					'selector' => 'h1,h2,h3,h4,h5,h6',
					'classes'  => 'as-h4'
				],
			],
		]
	];

	$style_formats = array_filter( $style_formats );

	if ( $style_formats ) $settings['style_formats'] = json_encode( $style_formats );

	return $settings;
} );


add_action( 'init', function () {
	add_editor_style( 'editor-styles.css' );
} );
