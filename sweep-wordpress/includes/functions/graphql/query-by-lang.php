<?php

add_action( 'graphql_register_types', function () {
	try {
		$allowed_post_types = \WPGraphQL::get_allowed_post_types( 'objects', [ 'graphql_register_root_field' => true ] );

		foreach ( $allowed_post_types as $post_type_object ) {
			register_graphql_field( 'RootQuery', $post_type_object->graphql_single_name . "ByLang", [
				'type'        => $post_type_object->graphql_single_name,
				'description' => "Get page by lang",
				'args'        => [
					'lang' => [
						'type'        => [ 'non_null' => 'String', ],
						'description' => 'Filter by WPML language code',
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

