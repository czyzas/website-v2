<?php

add_action( 'graphql_register_types', function () {
	try {
		register_graphql_field( 'MediaItem', 'svgSourceCode', [
			'type'        => 'String',
			'description' => 'Return svg source if image was optimized inside WP',
			'resolve'     => function ( \WPGraphQL\Model\Post $page ) {
				try {
					$file = new FH_SVG( $page->databaseId );

					return $file->get_source_code();
				} catch ( Exception ) {
					return null;
				}
			}
		] );
	} catch ( Exception $e ) {
	}
} );
