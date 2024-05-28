<?php

namespace WPGraphQL\Extensions\Pagination;

use Exception;
use WP_Post_Type;
use WP_Query;
use WPGraphQL;
use WPGraphQL\Data\Connection\AbstractConnectionResolver;

Pagination::init();

/**
 * Based on WPGraphQL offset pagination extension
 * @link https://github.com/valu-digital/wp-graphql-offset-pagination/
 */
class Pagination
{
	public static function init(): void {
		( new Pagination() )->bind_hooks();
	}

	static function get_paged( AbstractConnectionResolver $resolver ): int {
		$args = $resolver->get_args();

		return intval( $args['where']['pagination']['paged'] ?? 1 );
	}

	function bind_hooks(): void {
		add_action(
			'graphql_register_types',
			[ $this, 'action_graphql_register_types' ],
			9,
			0
		);
		add_filter(
			'graphql_connection_page_info',
			[ $this, 'filter_graphql_connection_page_info' ],
			10,
			2
		);
		add_filter(
			'graphql_connection_query_args',
			[ $this, 'filter_graphql_connection_query_args' ],
			10,
			5
		);
		add_filter(
			'graphql_map_input_fields_to_wp_query',
			[ $this, 'filter_map_input_to_wp_query_args' ],
			10,
			2
		);
	}

	static function add_post_type_fields( WP_Post_Type $post_type_object ): void {
		try {
			$type = ucfirst( $post_type_object->graphql_single_name );
			register_graphql_fields( "RootQueryTo${type}ConnectionWhereArgs", [
				'pagination' => [
					'type'        => 'Pagination',
					'description' => "Paginate ${type}s with pages",
				],
			] );
		} catch ( Exception $exception ) {
			trigger_error( $exception->getMessage(), E_USER_WARNING );
		}
	}

	function action_graphql_register_types(): void {
		try {
			// Register Pagination in `where` args in all post types
			foreach ( WPGraphQL::get_allowed_post_types() as $post_type ) {
				self::add_post_type_fields( get_post_type_object( $post_type ) );
			}

			// Create object for Pagination Info
			register_graphql_object_type( 'PaginationPageInfo', [
				'description' => 'Get information about the pagination state',
				'fields'      => [
					'totalPages'  => [
						'type'        => 'Int',
						'description' => 'Total amount of pages in this connection',
					],
					'currentPage' => [
						'type'        => 'Int',
						'description' => 'Current page in this connection',
					],
				],
			] );

			// Register created object in pageInfo
			register_graphql_field( 'WPPageInfo', 'pagination', [
				'type'        => 'PaginationPageInfo',
				'description' => 'Get information about the pagination state in the current connection',
			] );

			// Register input for post types
			register_graphql_input_type( 'Pagination', [
				'description' => 'Pagination input type',
				'fields'      => [
					'postsPerPage' => [
						'type'        => 'Int',
						'description' => 'Number of post to show per page. Passed to posts_per_page of WP_Query.',
					],
					'paged'        => [
						'type'        => 'Int',
						'description' => 'Number of page. Passed to paged of WP_Query.',
					],
				],
			] );

			// Register pagination for ContentNode
			register_graphql_field(
				'RootQueryToContentNodeConnectionWhereArgs',
				'pagination',
				[
					'type'        => 'Pagination',
					'description' => 'Paginate content nodes with pages',
				]
			);

		} catch ( Exception $exception ) {
			trigger_error( $exception->getMessage(), E_USER_WARNING );
		}
	}

	/**
	 * Lazily enable total calculations only when they are asked in the
	 * selection set.
	 */
	function filter_graphql_connection_query_args(
		$query_args,
		AbstractConnectionResolver $resolver
	) {
		$info = $resolver->get_info();
		$selection_set = $info->getFieldSelection( 2 );

		if ( !isset( $selection_set['pageInfo']['pagination']['totalPages'] ) ) {
			// get out if not requesting total counting
			return $query_args;
		}

		$query_args['no_found_rows'] = false;

		return $query_args;
	}

	// Return pageInfo
	function filter_graphql_connection_page_info(
		$page_info,
		AbstractConnectionResolver $resolver
	) {
		/**
		 * @var WP_Query $query
		 */
		$paged = self::get_paged( $resolver );
		/** @var WP_Query $query */
		$query = $resolver->get_query();

		$totalPages = $query->max_num_pages;

		$page_info['pagination'] = [
			'currentPage' => $paged,
			'totalPages'  => $totalPages,
		];

		return $page_info;
	}

	function filter_map_input_to_wp_query_args(
		array $query_args,
		array $where_args
	): array {
		if ( isset( $where_args['pagination']['paged'] ) ) {
			$query_args['paged'] = $where_args['pagination']['paged'];
		}

		if ( isset( $where_args['pagination']['postsPerPage'] ) ) {
			$query_args['posts_per_page'] = intval( $where_args['pagination']['postsPerPage'] );
		}

		return $query_args;
	}
}
