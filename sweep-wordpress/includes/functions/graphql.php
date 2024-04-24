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

		register_graphql_fields( 'AcfLink', [
			'internalUrl' => [
				'type'        => 'String',
				'description' => 'Url without wordpress domain',
				'resolve'     => function ( $page ) {
					$url = $page['url'];
					$parsed = parse_url( $url );

					$current_host = $_SERVER['HTTP_HOST'];
					$host = $parsed['host'];
					$path = $parsed['path'];
					if ( $current_host !== $host ) return null;

					return rtrim( $path, '/' );
				}
			]
		] );

		$MODULES_GROUP_ID = 1918;
		$group = acf_get_field_group( $MODULES_GROUP_ID );
		$group_fields = acf_get_fields( $MODULES_GROUP_ID );
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

		$allowed_post_types = \WPGraphQL::get_allowed_post_types( 'objects', [ 'graphql_register_root_field' => true ] );

		foreach ( $allowed_post_types as $post_type_object ) {
			register_graphql_field( 'RootQuery', $post_type_object->graphql_single_name . "ByLang", [
				'type'        => $post_type_object->graphql_single_name,
				'description' => "Get page by lang",
				'args'        => [
					'lang' => [
						'type' => [
							'non_null' => 'String',
						]
					],
					'uri'  => [
						'type' => [
							'non_null' => 'String',
						]
					]
				],
				'resolve'     => function ( $source, $args, $context, $info ) use (
					$post_type_object
				) {
					if ( isset( $args['lang'] ) ) {
						do_action( 'wpml_switch_language', $args['lang'] );
					}

					return $context->node_resolver->resolve_uri(
						$args['uri'],
						[
							'post_type' => $post_type_object->name,
							'nodeType'  => 'ContentNode'
						]
					);
				},
			] );
		}
	} catch ( Exception $e ) {
	}
} );
