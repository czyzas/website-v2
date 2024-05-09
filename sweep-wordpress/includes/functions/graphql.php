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

/**
 * FILTER BY CATEGORY SLUG
 * https://stackoverflow.com/a/76356744
 */
add_action( 'graphql_register_types', function () {
	// Register the field in the "where" clause.
	try {
		$post_types = [ 'Event', 'Post' ];
		foreach ( $post_types as $post_type ) {
			register_graphql_field( 'RootQueryTo' . $post_type . 'ConnectionWhereArgs', 'categorySlug', [
				'type'        => [ 'list_of' => 'String' ], // To accept multiple strings
				'description' => 'Filter by post objects that have the specific category slug',
			] );

		}
	} catch ( Exception $e ) {
	}
} );
// Add a filter to modify the query arguments.
add_filter( 'graphql_post_object_connection_query_args', function (
	$query_args,
	$source,
	$args,
) {
	// Accessing the 'categorySlug' argument.
	if ( !isset( $args['where']['categorySlug'] ) ) return $query_args;

	$categorySlug = $args['where']['categorySlug'];

	$post_type = $query_args['post_type'];
	$taxonomy = match ( true ) {
		in_array( 'event', $post_type ) => 'event-category',
		in_array( 'post', $post_type ) => 'category',
		default => null
	};

	if ( !$taxonomy ) return $query_args;

	// If the 'categorySlug' argument is provided, we add it to the tax_query.
	// For more details, refer to the WP_Query class documentation at https://developer.wordpress.org/reference/classes/wp_query/
	$query_args['tax_query'] = [
		[
			'taxonomy' => $taxonomy,
			'field'    => 'slug',
			'terms'    => $categorySlug
		]
	];

	return $query_args;
}, 10, 5 );

/**
 * SORT BY META KEY
 * https://github.com/wp-graphql/wp-graphql/issues/287#issuecomment-341930784
 */
add_action( 'graphql_register_types', function () {
	// Register the field in the "where" clause.
	try {
		register_graphql_enum_type( 'MetaTypeEnum', [
			'description' => 'Values for meta type in WP_Query',
			'values'      => [
				'CHAR'     => [ 'value' => 'CHAR' ],
				'NUMERIC'  => [ 'value' => 'NUMERIC' ],
				'BINARY'   => [ 'value' => 'BINARY' ],
				'DATE'     => [ 'value' => 'DATE' ],
				'DATETIME' => [ 'value' => 'DATETIME' ],
				'DECIMAL'  => [ 'value' => 'DECIMAL' ],
				'SIGNED'   => [ 'value' => 'SIGNED' ],
				'TIME'     => [ 'value' => 'TIME' ],
				'UNSIGNED' => [ 'value' => 'UNSIGNED' ],
			],
		] );

		$allowed_post_types = \WPGraphQL::get_allowed_post_types( 'objects', [ 'show_in_graphql' => true ] );
		foreach ( $allowed_post_types as $post_type_object ) {
			$type_name = graphql_format_type_name( implode(
				' ',
				[
					'RootQueryTo',
					$post_type_object->graphql_single_name,
					'ConnectionWhereArgs',
				]
			) );

			register_graphql_fields( $type_name, [
				'metaKey'  => [
					'type'        => "String",
					'description' => 'Show posts with a specific meta_key.',
				],
				'metaType' => [
					'type'        => 'MetaTypeEnum',
					'description' => 'Set `meta_type` value.'
				]
			] );
		}
	} catch ( Exception $e ) {
	}
} );
/** Add meta values to the orderby enum */
add_filter( 'graphql_PostObjectsConnectionOrderbyEnum_values', function ( $values ) {
	$values['META_VALUE'] = [
		'value'       => 'meta_value',
		'description' => 'Order by meta_value',
	];
	$values['META_VALUE_NUM'] = [
		'value'       => 'meta_value_num',
		'description' => 'Order by meta_value_num',
	];

	return $values;
} );

add_filter( 'graphql_post_object_connection_query_args', function (
	$query_args,
	$source,
	$args,
) {
	$meta_key = $args['where']['metaKey'] ?? null;
	$meta_type = $args['where']['metaType'] ?? null;

	if ( !empty( $meta_key ) ) {
		$query_args['meta_key'] = esc_html( $meta_key );
	}
	if ( !empty( $meta_type ) ) {
		$query_args['meta_type'] = esc_html( $meta_type );
	}

	return $query_args;
}, 10, 5 );
