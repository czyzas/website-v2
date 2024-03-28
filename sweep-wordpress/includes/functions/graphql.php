<?php

use WPGraphQL\Acf\FieldType\FlexibleContent;

add_action( 'graphql_register_types', function () {
	try {
		register_graphql_fields( 'MediaItem', [
			'svgSourceCode' => [
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
			],
		] );

		$group = acf_get_field_group( 1918 );
		$group_fields = acf_get_fields( 1918 );
		$modules_content_field = $group_fields[0];
		$layouts = $modules_content_field['layouts'];
		foreach ( $layouts as $layout ) {
			$type_name = graphql_format_type_name(
				implode(
					' ',
					[
						$group['graphql_field_name'],
						$modules_content_field['name'],
						$layout['name'],
						'Layout',
					]
				)
			);

			register_graphql_field( $type_name, 'layoutName', [
				'type'        => 'String',
				'description' => 'Get flexible field layout name',
				'resolve'     => function ( $page ) {
					return $page['acf_fc_layout'];
				}
			] );
		}

	} catch ( Exception $e ) {
	}
} );
