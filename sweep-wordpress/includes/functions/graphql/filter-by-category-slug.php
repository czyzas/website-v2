<?php

/**
 * FILTER BY CATEGORY SLUG
 * https://stackoverflow.com/a/76356744
 */
add_action( 'graphql_register_types', function () {
	// Register the field in the "where" clause.
	try {
		$post_types = [ 'Event', 'Post', 'InsightsItem', 'NewsroomItem' ];
		foreach ( $post_types as $post_type ) {
			register_graphql_fields( 'RootQueryTo' . $post_type . 'ConnectionWhereArgs', [
				'categorySlug' => [
					'type'        => [ 'list_of' => 'String' ], // To accept multiple strings
					'description' => 'Filter by post objects that have the specific category slug',
				],
			] );

		}
	} catch ( Exception $e ) {
	}
} );
// ADD FILTERING BY CATEGORIES
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
		in_array( 'insights', $post_type ) => 'insights-category',
		in_array( 'newsroom', $post_type ) => 'newsroom-category',
		default => null
	};

	if ( !$taxonomy ) return $query_args;

	// If the 'categorySlug' argument is provided, we add it to the tax_query.
	// For more details, refer to the WP_Query class documentation at https://developer.wordpress.org/reference/classes/wp_query/
	$query_args['tax_query'] ??= [];
	$query_args['tax_query'][] = [
		'taxonomy' => $taxonomy,
		'field'    => 'slug',
		'terms'    => $categorySlug
	];

	return $query_args;
}, 10, 5 );
