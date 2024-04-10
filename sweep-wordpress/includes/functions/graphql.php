<?php

add_filter( 'request', function ( $vars ) {

	if ( is_graphql_http_request() && !empty( $vars['name'] ) ) {
		$vars['suppress_filters'] = true;
	}

	return $vars;
} );

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
			register_graphql_field( 'RootQuery', $post_type_object->graphql_single_name."ByLang", [
				'type'        => $post_type_object->graphql_single_name,
				'description' => "Get page by lang",
				'args'        => [
					'lang' => [
						'type' => [
							'non_null' => 'String',
						]
					],
					'slug' => [
						'type' => [
							'non_null' => 'String',
						]
					]
				],
				'resolve'     => function ( $source, $args, $context, $info ) use ( $post_type_object ) {
					if ( isset( $args['lang'] ) ) {
						do_action( 'wpml_switch_language', $args['lang'] );
					}

					return $context->node_resolver->resolve_uri(
						$args['slug'],
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
