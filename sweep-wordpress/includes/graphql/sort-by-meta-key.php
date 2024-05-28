<?php
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
