<?php

/**
 * Get file last modified date as md5 from url
 *
 * @param $url
 * @return string
 */
function getFileLastModifiedDateFromUrl( $url ): string {
	$filename = str_replace( get_template_directory_uri(), get_template_directory(), $url );

	return file_exists( $filename ) ? md5( date( "dmYHis", filemtime( $filename ) ) ) : '';
}


/**
 * Get homepage url depending on whether polylang is installed
 *
 * @param string $path
 * @param string $lang
 * @return string
 */
function fh_homepage_url( string $path = '', string $lang = FH_LANGUAGE ): string {
	if ( function_exists( 'pll_home_url' ) ) {
		return rtrim( pll_home_url( $lang ), '/' ) . '/' . ltrim( $path, '/' );
	}

	return home_url( $path );
}

/**
 * Convert attributes to string
 *
 * @param $attrs
 * @return string
 */
function convert_attributes_to_string( $attrs = [] ): string {
	$attrs_string = [];

	foreach ( $attrs as $attr_key => $attr_value ) {
		if ( is_bool( $attr_value ) && $attr_value === false ) {
			continue;
		}

		$str = $attr_key;
		if ( strlen( esc_attr( $attr_value ) ) > 0 && $attr_value !== true ) {
			$str .= "=\"" . esc_attr( $attr_value ) . "\"";
		}

		$attrs_string[] = $str;
	}

	return trim( implode( ' ', $attrs_string ) );
}

/**
 * Load template part
 *
 * @param $template_name
 * @param $part_name
 * @return false|string
 */
function load_template_part( $template_name, $part_name = null ) {
	ob_start();
	get_template_part( $template_name, $part_name );
	$var = ob_get_contents();
	ob_end_clean();

	return $var;
}

/**
 * Get current page title
 *
 * @param $post_ID
 * @return mixed|string
 */
function fh_get_current_page_title( $post_ID = null ) {
	if ( !$post_ID ) $post_ID = get_the_ID();
	$current_page_title = get_the_title( $post_ID );

	if ( is_404() )
		$current_page_title = get_field('error404_text', FH_OPTIONS_PAGE);
	elseif ( is_search() )
		$current_page_title = __tr( 'wyniki_wyszukiwania_dla' ) . ' "' . get_search_query() . '"';

	return $current_page_title;
}


/**
 * Generate anchor link
 *
 * Accepting options such as:
 * * icon: string - looks for images/{icon}.svg and adds at the beginning/end of link
 * * icon_position: 'start' | 'end' - default: 'end',  decide where icon should be placed
 * * wrap_title - bool | string - default: 'span', select tag to wrap title, if false - no tag is added
 * @param array $acf_link
 * @param array $options
 * @return string
 */
function fh_acf_link( array $acf_link, array $options = [] ): string {
	$title = $acf_link['title'] ?? '';
	$base_attrs = [
		'href'   => $acf_link['url'] ? esc_url( $acf_link['url'] ) : '',
		'target' => ( $acf_link['target'] ?? '' ) ?: '_self',
	];

	if ( $base_attrs['target'] === '_blank' ) {
		$base_attrs['rel'] = "nofollow noopener noreferrer";
	}
	$user_attrs = $options['attrs'] ?? [];

	$icon = $options['icon'] ?? null;
	$icon = $icon ? load_template_part( "dist/images/$icon.svg" ) : null;
	$icon_position = $options['icon_position'] ?? 'end';

	$wrap_title = $options['wrap_title'] ?? false;
	if ( is_bool( $wrap_title ) && $wrap_title ) {
		$wrap_title = 'span';
	}

	$title = $wrap_title ? "<$wrap_title>$title</$wrap_title>" : $title;


	if ( $icon ) {
		$title_with_icon = [ $title, $icon ];
		if ( $icon_position === 'start' ) {
			$title_with_icon = array_reverse( $title_with_icon );
		}
		$title = implode( '', $title_with_icon );
	}

	$base_classname = classNames( [
		'acf-link',
		'with-icon'                     => !!$icon,
		"icon-position--$icon_position" => !!$icon,
	] );
	$user_attrs['class'] = classNames( $base_classname, ( $user_attrs['class'] ?? '' ) );
	$attrs = array_merge( $base_attrs, $user_attrs );
	$attrs_string = convert_attributes_to_string( $attrs );
	if ( $attrs['href'] && $title ) {
		return "<a $attrs_string>" . $title . "</a>";
	}

	return '';
}

/**
 * Generate dynamic class for html objects
 * https://github.com/cstro/classnames-php
 *
 * @return string
 */
function classNames(): string {
	$args = func_get_args();

	$data = array_reduce( $args, function ( $carry, $arg ) {
		if ( is_array( $arg ) ) {
			return array_merge( $carry, $arg );
		}

		$carry[] = $arg;

		return $carry;
	}, [] );

	$classes = array_map( function ( $key, $value ) {
		$condition = $value;
		$return = $key;

		if ( is_int( $key ) ) {
			$condition = null;
			$return = $value;
		}

		$isArray = is_array( $return );
		$isObject = is_object( $return );
		$isStringableType = !$isArray && !$isObject;

		$isStringableObject = $isObject && method_exists( $return, '__toString' );

		if ( !$isStringableType && !$isStringableObject ) {
			return null;
		}

		if ( $condition === null ) {
			return $return;
		}

		return $condition ? $return : null;

	}, array_keys( $data ), array_values( $data ) );

	$classes = array_filter( $classes );

	return implode( ' ', $classes );
}

/**
 * Replacement for `FH_OPTIONS_PAGE` const. It is more consistent when using along with `get_field()` function
 * @param string $key - key inside options
 * @param string $user_options_page_id user defined options page id if you want to use different options page (than default one)
 * @return mixed
 */
function get_options_field( string $key, string $user_options_page_id = '' ) {
	$options_page_id = $user_options_page_id ?: "options";

	if ( function_exists( 'pll_current_language' ) ) {
		$language = pll_current_language();
		$options_page_id = "$options_page_id-$language";
	}


	return get_field( $key, $options_page_id );
}

/**
 * See {@see get_options_field()} for more information
 */
function the_options_field( string $key, string $user_options_page_id = '' ) {
	echo get_options_field( $key, $user_options_page_id );
}

function fh_svg( string $source ): void {
	include get_template_directory() . "/dist/images/$source.svg";
}

function fh_get_attachment( int $ID, $size = 'full', $attrs = [] ): string {
	try {
		$file = new FH_SVG( $ID );

		return $file->get_source_code( $attrs );
	} catch ( Exception ) {
		return wp_get_attachment_image( $ID, $size, null, $attrs );
	}
}

