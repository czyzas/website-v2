<?php
/**
 * Create GRI shortcode
 *
 * @param $atts
 * @return string
 */
function gri_shortcode_function( $atts ) {
	$gri_index = get_field( 'gri_index', $atts['griid'] );
	$gri_description = get_field( 'gri_description', $atts['griid'] );

	return '<strong class="gri_text default-tooltipster" id="griinlineindex_' . $gri_index . '_' . uniqid() . '" title="' . $gri_description . '">[' . $gri_index . ']</strong>';
}

add_action( 'init', function () {
	add_shortcode( 'gri', 'gri_shortcode_function' );
} );

/**
 * Add GRI button to the editor
 *
 * @return void
 */
function add_gri_button() {
	echo '<a href="#" class="insert-gri button">GRI</a>';
}

add_action( 'media_buttons', 'add_gri_button', 15 );

/**
 * Enqueue gri js file
 *
 * @return void
 */
function include_gri_button_js_file() {
	wp_enqueue_script( 'media_button2', get_template_directory_uri() . '/includes/gri-admin/gri-admin.js', array( 'jquery' ), '1.0', true );
}

add_action( 'admin_enqueue_scripts', 'include_gri_button_js_file' );

/**
 * Enqueue GRI css file
 *
 * @return void
 */
function my_custom_gricss() {
	echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/includes/gri-admin/gri-admin.css" type="text/css" media="all" />';
}

add_action( 'admin_head', 'my_custom_gricss' );

/**
 * GRI search function for the editor requests
 *
 * @return void
 */
function gri_id_search() {
	if ( !isset( $_GET['post_type'] ) ) {
		wp_die( 0 );
	}

	$post_type = sanitize_key( $_GET['post_type'] );
	$s = wp_unslash( $_GET['q'] );

	$comma = ",";
	if ( ',' !== $comma )
		$s = str_replace( $comma, ',', $s );
	if ( false !== strpos( $s, ',' ) ) {
		$s = explode( ',', $s );
		$s = $s[count( $s ) - 1];
	}
	$s = trim( $s );

	$results = get_posts( array( "post_type" => $post_type, "s" => $s ) );

	$resultsArr = array();
	foreach ( $results as $result ) {
		$gri_index = get_field( 'gri_index', $result->ID );
		array_push( $resultsArr, $result->ID . ' | ' . "[$gri_index] $result->post_title" );
	}

	echo implode( "\n", $resultsArr );
	wp_die();
}

add_action( 'wp_ajax_gri_id_search', 'gri_id_search' );
