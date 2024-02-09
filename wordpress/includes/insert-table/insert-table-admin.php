<?php
/**
 * Create insert table shortcode
 *
 * @param $atts
 * @return false|string
 */
function insert_table_shortcode_function( $args ) {
	ob_start();
	get_template_part( 'partials/table', null, $args );

	return ob_get_clean();
}

add_action( 'init', function () {
	add_shortcode( 'insert-table', 'insert_table_shortcode_function' );
} );

/**
 * Add insert table button to the editor
 *
 * @return void
 */
function add_insert_table_button() {
	echo '<a href="#" class="insert-table button">Wstaw tabelę</a>';
}
add_action('media_buttons', 'add_insert_table_button', 15);

/**
 * Enqueue insert table js files
 *
 * @return void
 */
function include_insert_table_button_js_file() {
	wp_enqueue_script('insert-table-button', get_template_directory_uri().'/includes/insert-table/insert-table-admin.js', array('jquery'), '1.0', true);
	wp_enqueue_script('insert-table-suggest', get_template_directory_uri().'/includes/insert-table/suggest.js', array('jquery'), '1.0', true);
}
add_action('admin_enqueue_scripts', 'include_insert_table_button_js_file');

/**
 * Enqueue insert table css file
 *
 * @return void
 */
function include_insert_table_button_css_file() {
	echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/includes/insert-table/insert-table-admin.css" type="text/css" media="all" />';
}
add_action('admin_head', 'include_insert_table_button_css_file');

/**
 * Insert table function for the editor requests
 *
 * @return void
 */
function table_id_search() {

	$s = wp_unslash( $_GET['q'] );

	$table_args = array(
		'post_type' => 'table',
		'posts_per_page' => -1,
		's' => $s
	);
	$table_query = new WP_Query( $table_args );
	while ( $table_query->have_posts() ) {
        $table_query->the_post();

		$results .= get_the_title() . " ID:" . get_the_ID() ."\n";
	}

	echo $results;
	wp_die();
}

add_action( 'wp_ajax_table_id_search', 'table_id_search' );
