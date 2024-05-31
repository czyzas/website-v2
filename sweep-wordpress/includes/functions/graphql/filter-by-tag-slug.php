<?php
/**
 * ADD FILTERING BY TAGS
 */
add_action( 'graphql_register_types', function () {
	// Register the field in the "where" clause.
	try {
		$post_types = [ 'Event', 'Post', 'InsightsItem', 'NewsroomItem', 'CaseStudy' ];
		foreach ( $post_types as $post_type ) {
			register_graphql_fields( 'RootQueryTo' . $post_type . 'ConnectionWhereArgs', [
				'tagSlug' => [
					'type'        => [ 'list_of' => 'String' ], // To accept multiple strings
					'description' => 'Filter by post objects that have the specific tag slug',
				],
			] );

		}
	} catch ( Exception $e ) {
	}
} );
add_filter( 'graphql_post_object_connection_query_args', function (
	$query_args,
	$source,
	$args,
) {
	// Accessing the 'categorySlug' argument.
	if ( !isset( $args['where']['tagSlug'] ) ) return $query_args;

	$tagSlug = $args['where']['tagSlug'];

	$post_type = $query_args['post_type'];
	$taxonomy = match ( true ) {
		in_array( 'event', $post_type ) => 'event-tag',
		in_array( 'post', $post_type ) => 'tag',
		in_array( 'insights', $post_type ) => 'insights-tag',
		in_array( 'newsroom', $post_type ) => 'newsroom-tag',
		in_array( 'case-study', $post_type ) => 'case-study-tag',
		default => null
	};

	if ( !$taxonomy ) return $query_args;

	// If the 'tagSlug' argument is provided, we add it to the tax_query.
	// For more details, refer to the WP_Query class documentation at https://developer.wordpress.org/reference/classes/wp_query/
	$query_args['tax_query'] ??= [];
	$query_args['tax_query'][] = [
		'taxonomy' => $taxonomy,
		'field'    => 'slug',
		'terms'    => $tagSlug
	];

	return $query_args;
}, 10, 5 );
