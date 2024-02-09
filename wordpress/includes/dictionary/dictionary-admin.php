<?php
// SHORTCODES
function dictionary_shortcode_function($atts): string {
	$term = get_term_by('name', $atts['term'], 'dictionary');

	$lang = FH_LANGUAGE;
	$id = uniqid('dictionary-');

	return "<abbr class='dictionary-word default-tooltipster' title='$term->description' id='$id' lang='$lang'>{$atts['word']}</abbr>";
}
function register_shortcodes(){
	add_shortcode('dictionary', 'dictionary_shortcode_function');
}
add_action('init', 'register_shortcodes');


function add_dictionary_button() {
	echo '<a href="#" class="insert-dictionary button">Słownik</a>';
}
add_action('media_buttons', 'add_dictionary_button', 15);

function include_dictionary_button_js_file() {
	wp_enqueue_script('media_button', get_template_directory_uri().'/includes/dictionary/dictionary-admin.js', array('jquery'), '1.0', true);
	wp_enqueue_script('suggest', get_template_directory_uri().'/includes/dictionary/suggest.js', array('jquery'), '1.0', true);
}
add_action('admin_enqueue_scripts', 'include_dictionary_button_js_file');

function my_custom_fonts() {
	echo '<link rel="stylesheet" href="'.get_template_directory_uri().'/includes/dictionary/dictionary-admin.css" type="text/css" media="all" />';
}
add_action('admin_head', 'my_custom_fonts');

function tag_id_search() {
	if ( ! isset( $_GET['tax'] ) ) {
		wp_die( 0 );
	}

	$taxonomy = sanitize_key( $_GET['tax'] );
	$tax = get_taxonomy( $taxonomy );
	if ( ! $tax ) {
		wp_die( 0 );
	}

	if ( ! current_user_can( $tax->cap->assign_terms ) ) {
		wp_die( -1 );
	}

	$s = wp_unslash( $_GET['q'] );

	$comma = _x( ',', 'tag delimiter' );
	if ( ',' !== $comma )
		$s = str_replace( $comma, ',', $s );
	if ( false !== strpos( $s, ',' ) ) {
		$s = explode( ',', $s );
		$s = $s[count( $s ) - 1];
	}
	$s = trim( $s );


	/**
	 * Filters the minimum number of characters required to fire a tag search via Ajax.
	 *
	 * @since 4.0.0
	 *
	 * @param int         $characters The minimum number of characters required. Default 2.
	 * @param WP_Taxonomy $tax        The taxonomy object.
	 * @param string      $s          The search term.
	 */
	$term_search_min_chars = (int) apply_filters( 'term_search_min_chars', 2, $tax, $s );

	/*
	* Require $term_search_min_chars chars for matching (default: 2)
	* ensure it's a non-negative, non-zero integer.
	*/
	if ( ( $term_search_min_chars == 0 ) || ( strlen( $s ) < $term_search_min_chars ) ){
		wp_die();
	}

	$results = get_terms( $taxonomy, array( 'name__like' => $s, 'fields' => 'names', 'hide_empty' => false ) );

	echo implode( "\n", $results );
	wp_die();
}

add_action( 'wp_ajax_tag_id_search', 'tag_id_search' );
