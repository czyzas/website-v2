<?php

use Roots\WPConfig\Config;
use function Env\env;

// REGISTER SIDEBAR
if ( function_exists( 'register_sidebar' ) )
	register_sidebar( array(
		'before_widget' => '',
		'after_widget'  => '',
		'before_title'  => '<h3>',
		'after_title'   => '</h3>',
		'id'            => 'unique_id'
	) );

// REMOVE WP EMOJI
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );


// REMOVE WP EMBED
add_action( 'wp_footer', function () {
	wp_deregister_script( 'wp-embed' );
} );

// REMOVE RECENT COMMENTS
add_action( 'widgets_init', function () {
	global $wp_widget_factory;
	remove_action( 'wp_head', array( $wp_widget_factory->widgets['WP_Widget_Recent_Comments'],
		'recent_comments_style' ) );
} );

// REMOVE GUTENBERG BLOCK LIBRARY CSS FROM LOADING ON FRONTEND
add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'wc-block-style' ); // REMOVE WOOCOMMERCE BLOCK CSS
	wp_dequeue_style( 'global-styles' ); // REMOVE THEME.JSON
}, 100 );


/**
 * Filter current filename to replace or remove problematic characters.
 *
 * @param string $filename Current filename.
 */
add_filter( 'sanitize_file_name', function ( $filename ) {

	$data = $filename;
	if ( extension_loaded( 'intl' ) ) {
		// normalize data (remove accent marks) using PHPs intl extension
		$data = normalizer_normalize( $filename );
	}


	// replace everything NOT in the sets you specified with an underscore
	return preg_replace( "#[^A-Za-z0-9_\.]#", "", $data );
}, 10, 1 );

/**
 * Rouding width/height attributes values of <img> tags for SVG
 *
 * Without this filter, the width and height could be "192.68" and
 * W3 validator return this as error 'Expected a digit but saw "." instead'.
 *
 * For SVG:s, fixes width/height attributes and rounds them naturally to remove "."
 *
 * @wp-hook wp_get_attachment_image_attributes
 * @param string[] $attr Array of attribute values for the image markup, keyed by attribute name.
 * @param WP_Post $ittachment Image attachment post.
 * @return string[] $attr
 */

add_filter( 'wp_get_attachment_image_attributes', function ( $attr, $attachment ) {
	if ( !$attachment instanceof WP_Post ) {
		return $attr;
	}

	$mime = get_post_mime_type( $attachment->ID );
	if ( $mime === 'image/svg+xml' ) {
		if ( isset( $attr['height'] ) && $attr['height'] ) $attr['height'] = round( intval( $attr['height'] ) );
		if ( isset( $attr['width'] ) && $attr['width'] ) $attr['width'] = round( intval( $attr['width'] ) );
	}

	return $attr;
}, 10, 3 );


// Add template column to page list
function set_template_edit_page_columns( $columns ): array {
	// Set new order for page list columns
	$new_column_order = [
		'cb'       => $columns['cb'],
		'title'    => __( 'Title' ),
		'template' => __( 'Template' ),
	];
	unset( $columns['cb'] );
	unset( $columns['Title'] );

	return array_merge( $new_column_order, $columns );
}

// Add value to template column
function template_page_column( $column, $post_id ): void {
	// Get all templates names
	$templates = wp_get_theme()->get_page_templates();

	if ( $column == 'template' ) {
		echo $templates[get_page_template_slug( $post_id )] ?? __( 'Default template' );
	}
}

// Add filter by templates
function page_template_filter(): void {
	$screen = get_current_screen();
	if ( $screen->id == 'edit-page' ) {
		// Get all templates names
		$templates_list = wp_get_theme()->get_page_templates();
		asort( $templates_list );
		$templates = array_merge( [ 'default' => __( 'Default template' ) ], $templates_list );
		$current_template = $_GET['admin_filter_template'] ?? '';
		?>
		<label for="filter-by-template"
		       class="screen-reader-text"
		><?php _e( 'Filter templates list' ); ?>
		</label>

		<select name="admin_filter_template" id="filter-by-template">
			<option value=""><?php echo __( 'All', 'acf' ) . ' ' . strtolower( __( 'Templates' ) ); ?></option>

			<?php
			foreach ( $templates as $value => $label ) {
				printf(
					'<option value="%s" %s>%s</option>',
					$value,
					$value == $current_template ? ' selected="selected"' : '',
					$label
				);
			}
			?>
		</select>
		<?php
	}
}

add_action( 'restrict_manage_posts', 'page_template_filter' );

// Add meta value to query when it's admin list of pages
add_filter( 'parse_query', function ( $query ) {
	global $pagenow;
	$meta_key = '_wp_page_template';
	$admin_filter_template = $_GET['admin_filter_template'] ?? '';

	if ( is_admin() && 'edit.php' === $pagenow && 'page' === ( $_GET['post_type'] ?? '' ) && $admin_filter_template ) {
		$query->set( 'meta_key', $meta_key );
		$query->set( 'meta_value', $admin_filter_template );
	}
} );

//Uncomment if you want to enable svg safe plugin optimization
//add_filter( 'safe_svg_optimizer_enabled', '__return_true' );

//Add "View SSR" button to admin menu bar
add_action( 'admin_bar_menu', 'add_item', 100 );
function add_item( $admin_bar ) {
	global $pagenow;

	if ( $pagenow == "post.php" ) {
		$url = get_the_permalink();
	} else {
		$url = home_url();
	}

	$ssr_url = get_ssr_url( $url );

	$admin_bar->add_menu( [
		'id'    => 'wp-admin-bar-view-ssr',
		'title' => 'View SSR page',
		'href'  => $ssr_url,
		'meta'  => [ 'target' => '_blank' ]
	] );
}

function get_ssr_url( $url ) {
	$ssr_domain = env( "SSR_HOME_DOMAIN" );
	$wp_domain = env( "WP_HOME" );

	if ( !$ssr_domain || !$wp_domain ) return false;

	return str_replace( $wp_domain, $ssr_domain, $url );
}

//Add "View SSR page" to page list items
add_filter( 'page_row_actions', 'add_ssr_action_link', 10, 2 );
add_filter( 'post_row_actions', 'add_ssr_action_link', 10, 2 );
function add_ssr_action_link( $actions, $page_object ) {
	$ssr_url = get_ssr_url( get_permalink( $page_object->ID ) );
	$actions['view'] = '<a href="' . $ssr_url . '" class="google_link" target="_blank">View SSR page</a>';

	return $actions;
}

//Remove "View page" button from admin menu bar
add_action( 'admin_bar_menu', function ( $wp_admin_bar ) {
	$wp_admin_bar->remove_node( 'view' );
}, 999 );

function hide_all_modules_except( array $allowed_modules ): void {
	$not_selector = array_map( fn( $m ) => "[data-layout=\"$m\"]", $allowed_modules );
	$not_selector = implode( ',', $not_selector );
	?>
	<style>
		.acf-tooltip.acf-fc-popup a:not(<?= $not_selector ?>) {
			display: none;
		}
	</style>
	<?php
}

function hide_selected_modules( array $hidden_modules ): void {
	$is_selector = array_map( fn( $m ) => "[data-layout=\"$m\"]", $hidden_modules );
	$is_selector = implode( ',', $is_selector );
	?>
	<style>
		.acf-tooltip.acf-fc-popup a:is(<?= $is_selector ?>) {
			display: none;
		}
	</style>
	<?php
}

// Hide modules
add_action( 'admin_footer', function () {
	global $post;
	if ( !$post || !$post->post_type ) return;

	$article_post_types = [ 'newsroom', 'insights', 'event', 'case-study' ];
	$is_article = in_array( $post->post_type, $article_post_types );
	$is_customers_page = $post->post_type === 'page' && $post->post_name === 'customers';

	if ( $is_article ) { // show only on article
		hide_all_modules_except( [
			'rich-text-content',
			'article-title',
			'gated',
			'quotation',
			'quotation-with-image',
			'demo',
			'team',
			'sourced-info',
		] );
	} else { // hide article modules on other pages
		hide_selected_modules(
			array_filter( [
//				'rich-text-content',
				'article-title',
				'gated',
				// hide case studies list on non-customers pages
				!$is_customers_page ? 'case-studies-list' : '',
			] )
		);
	}
} );
