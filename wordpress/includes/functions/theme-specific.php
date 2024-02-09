<?php
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

/**
 * UPDATE ACF COLOR PALETTE
 *
 * @return array|null
 */
function get_color_palette(): ?array {
	if ( !function_exists( 'get_field' ) ) {
		return null;
	}

	$acf_palette = get_field( 'color_palette', FH_OPTIONS_PAGE );

	if ( !$acf_palette || !is_array( $acf_palette ) ) {
		return null;
	}

	$color_palette = [];
	foreach ( $acf_palette as $color ) {
		$color_hex = $color['color_hex'] ?? '';
		$color_hex = str_replace( '#', '', $color_hex );
		$color_name = $color['color_name'];

		$color_palette[$color_hex] = $color_name;
	}

	return $color_palette;
}

// Set ACF color picker palette
add_action( 'acf/input/admin_footer', function () {
	$color_palette = get_color_palette();
	if ( $color_palette ):
		?>
		<script type="text/javascript">
			(function () {
				acf.add_filter('color_picker_args', function (args) {
					args.palettes = <?php echo json_encode( array_map( function ( $key ) {
						return "#$key";
					}, array_keys( $color_palette ) ) );?>;

					return args;
				});
			})(jQuery);
		</script>
	<?php endif; ?>
	<?php
} );

// Set WYSIWYG color picker palette
add_filter( 'tiny_mce_before_init', function ( $init ) {
	$color_palette = get_color_palette();

	if ( $color_palette ) {
		$parse_palette = array_map( function ( $key, $value ) {
			return "\"$key\", \"$value\",";
		}, array_keys( $color_palette ), array_values( $color_palette ) );
		$parse_palette = implode( PHP_EOL, $parse_palette );

		$init['textcolor_map'] = "[$parse_palette]";
	}

	return $init;
} );

add_filter( 'manage_page_posts_columns', 'set_template_edit_page_columns' );
add_action( 'manage_page_posts_custom_column', 'template_page_column', 10, 2 );

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


