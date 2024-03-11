<?php

abstract class TrackingCodePositions
{
	const HEAD_TOP = 'head_top';
	const HEAD_BOTTOM = 'head_bottom';
	const BODY_TOP = 'body_top';
	const BODY_BOTTOM = 'body_bottom';
}

/**
 * Insert tracking code based on position
 *
 * @param $position
 * @return void|null
 */
function insert_tracking_code( $position = 'head_bottom' ) {
	if ( !function_exists( 'get_field' ) ) {
		return null;
	}

	$position = $position ?: 'head_bottom';
	$respect_cookies = get_field( 'respect_cookies', 'tracking-options' );

	$cookies = get_options_field('cookies', 'cookies-options');
	$module_enabled = $respect_cookies ? ($cookies['module_enabled'] ?? false) : true;
	if ( !$module_enabled ) {
		return null;
	}

	$all_codes = get_field( 'tracking_codes', 'tracking-options' ) ?: [];
	$filtered_codes = array_filter( $all_codes, function ( $code ) use ( $position ) {
		return $code && $code['position'] && $code['position'] === $position;
	} );

	foreach ( $filtered_codes as $code ) {
		$print_tracking_code = $code['tracking_code'] ?: '';
		if ( $respect_cookies ) {
			$cookies_category = $code['cookies_category'];

			if ( $cookies_category ) {
				if ( strpos( $print_tracking_code, 'type=' ) === false ) {
					$print_tracking_code = str_replace( '<script', '<script type="text/javascript"', $print_tracking_code );
				}

				$cookies_category = implode( ' ', $cookies_category );
				$print_tracking_code = str_replace( 'type="text/javascript"', "type=\"text/plain\" data-fhpc=\"$cookies_category\"", $print_tracking_code );
			}
		}
		echo $print_tracking_code;
	}
}