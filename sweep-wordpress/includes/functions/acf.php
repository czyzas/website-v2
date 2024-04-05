<?php

/**
 * Local JSON Functionality to save
 *
 * @return string
 */
add_filter( 'acf/settings/save_json', function () {
	return get_stylesheet_directory() . '/includes/acf-json';
} );

/**
 * Local JSON Functionality to load
 *
 * @param $paths
 * @return mixed
 */
add_filter( 'acf/settings/load_json', function ( $paths ) {
	// remove original path (optional)
	unset( $paths[0] );

	// append path
	$paths[] = get_stylesheet_directory() . '/includes/acf-json';

	// return
	return $paths;
} );

add_action( 'acf/input/admin_head', function () {
	?>
	<style>
		.acf-fields > .acf-field.invisible-group {
			padding: 0;
		}

		.acf-fields > .acf-field.invisible-group > .acf-label {
			display: none;
		}

		.acf-fields > .acf-field.invisible-group > .acf-input > .acf-fields.-border {
			border: none;
		}

		.color-box {
			display: inline-block;
			border: 1px solid #BDBDBD;
			background: var(--box-color, transparent);
			width: 1em;
			height: 1em;
			border-radius: 2px;
			vertical-align: text-bottom;
			margin-right: 2px;
		}
	</style>
	<?php
} );
