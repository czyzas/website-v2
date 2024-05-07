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
					if ( !isset( $page['url'] ) ) {
						return null;
					}

					$url = $page['url'];
					$parsed = parse_url( $url );

					$current_host = $_SERVER['HTTP_HOST'];
					$host = $parsed['host'] ?? null;
					$path = $parsed['path'] ?? null;

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

// TODO: FILTER BY CATEGORY SLUG
// https://stackoverflow.com/a/76356744

//// First, we register the field in the "where" clause.
//add_action( 'graphql_register_types', function () {
//	try {
//		$customposttype_graphql_single_name = "Country"; // Replace this with your custom post type single name in PascalCase
//
//		// Registering the 'categorySlug' argument in the 'where' clause.
//		// Feel free to change the name 'categorySlug' to something that suits your requirements.
//		register_graphql_field( 'RootQueryTo' . $customposttype_graphql_single_name . 'ConnectionWhereArgs', 'categorySlug', [
//			'type'        => [ 'list_of' => 'String' ], // To accept multiple strings
//			'description' => __( 'Filter by post objects that have the specific category slug', 'your_text_domain' ),
//		] );
//	} catch ( Exception $e ) {
//	}
//} );
//
//// Next, we add a filter to modify the query arguments.
//add_filter( 'graphql_post_object_connection_query_args', function (
//	$query_args,
//	$source,
//	$args,
//	$context,
//	$info
//) {
//
//	$categorySlug = $args['where']['categorySlug']; // Accessing the 'categorySlug' argument.
//
//	if ( isset( $categorySlug ) ) {
//		// If the 'categorySlug' argument is provided, we add it to the tax_query.
//		// For more details, refer to the WP_Query class documentation at https://developer.wordpress.org/reference/classes/wp_query/
//		$query_args['tax_query'] = [
//			[
//				'taxonomy' => 'your_taxonomy',
//				// Replace 'your_taxonomy' with your actual taxonomy key
//				'field'    => 'slug',
//				'terms'    => $categorySlug
//			]
//		];
//	}
//
//	return $query_args;
//}, 10, 5 );

// TODO: SORT BY META KEY
// https://github.com/wp-graphql/wp-graphql/issues/287#issuecomment-341930784
add_filter( 'graphql_queryArgs_fields', function ( $fields ) {
	$fields['metaKey'] = [
		'type'        => "String",
		'description' => __( 'Show posts with a specific meta_key.', 'your-custom-plugin' ),
	];

	return $fields;
} );

add_filter( 'graphql_orderby_values', function ( $values ) {
	$values['META_VALUE'] = [
		'value'       => 'meta_value',
		'description' => __( 'Order by meta_value', 'your-custom-plugin' ),
	];
	$values['META_VALUE_NUM'] = [
		'value'       => 'meta_value_num',
		'description' => __( 'Order by meta_value_num', 'your-custom-plugin' ),
	];

	return $values;
} );

add_filter( 'graphql_post_object_connection_query_args', function (
	$query_args,
	$source,
	$args,
	$context,
	$info
) {
	if ( !empty( $args['where']['metaKey'] ) ) {
		$query_args['meta_key'] = esc_html( $args['where']['metaKey'] );
	}

	return $query_args;
}, 10, 5 );

//add_filter( 'graphql_post_fields', function( $fields ) {
//	$fields['someNumber'] = [
//		'type' => "Int",
//		'resolve' => function( $post ) {
//			$value = get_post_meta( $post->ID, 'some_number', true );
//			return absint( $value );
//		}
//	];
//	return $fields;
//} );
