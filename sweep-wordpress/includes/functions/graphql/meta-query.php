<?php

namespace WPGraphQL\Extensions\Pagination;

use Exception;
use WP_Post_Type;
use WPGraphQL;

MetaQuery::init();

/**
 * Based on WPGraphQL meta query extension
 * @link https://github.com/wp-graphql/wp-graphql-meta-query
 */
class MetaQuery
{
	public static function init(): void {
		( new MetaQuery() )->bind_hooks();
	}

	function bind_hooks(): void {
		add_action(
			'graphql_register_types',
			[ $this, 'action_graphql_register_types' ],
			9,
			0
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
				'metaQuery' => [
					'type'        => 'MetaQuery',
					'description' => "Filter ${type}s by meta query",
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

			register_graphql_enum_type( 'MetaCompareEnum', [
				'description' => 'Values for meta type in WP_Query',
				'values'      => [
					'EQUAL_TO'                 => [ 'value' => '=' ],
					'NOT_EQUAL_TO'             => [ 'value' => '!=' ],
					'GREATER_THAN'             => [ 'value' => '>' ],
					'GREATER_THAN_OR_EQUAL_TO' => [ 'value' => '>=' ],
					'LESS_THAN'                => [ 'value' => '<' ],
					'LESS_THAN_OR_EQUAL_TO'    => [ 'value' => '<=' ],
					'LIKE'                     => [ 'value' => 'LIKE' ],
					'NOT_LIKE'                 => [ 'value' => 'NOT LIKE' ],
					'IN'                       => [ 'value' => 'IN' ],
					'NOT_IN'                   => [ 'value' => 'NOT IN' ],
					'BETWEEN'                  => [ 'value' => 'BETWEEN' ],
					'NOT_BETWEEN'              => [ 'value' => 'NOT BETWEEN' ],
					'EXISTS'                   => [ 'value' => 'EXISTS' ],
					'NOT_EXISTS'               => [ 'value' => 'NOT EXISTS' ],
				],
			] );

			register_graphql_input_type( 'MetaArray', [
				'fields' => [
					'key'     => [
						'type'        => 'String',
						'description' => __( 'Custom field key', 'wp-graphql' ),
					],
					'value'   => [
						'type'        => 'String',
						'description' => __( 'Custom field value', 'wp-graphql' ),
					],
					'compare' => [
						'type'        => 'MetaCompareEnum',
						'description' => __( 'Custom field value', 'wp-graphql' ),
					],
					'type'    => [
						'type'        => 'MetaTypeEnum',
						'description' => __( 'Custom field value', 'wp-graphql' ),
					],
				],
			] );

			register_graphql_input_type( 'MetaQuery', [
				'fields' => [
					'relation'  => [
						'type' => 'RelationEnum',
					],
					'metaArray' => [
						'type' => [
							'list_of' => 'MetaArray',
						],
					],
				],
			] );
		} catch ( Exception $exception ) {
			trigger_error( $exception->getMessage(), E_USER_WARNING );
		}
	}

	function filter_map_input_to_wp_query_args(
		array $query_args,
		array $where_args
	): array {
		// check to see if the metaQuery came through with the input $args, and
		// map it properly to the $queryArgs that are returned and passed to the WP_Query
		$meta_query = null;
		if ( !empty( $where_args['metaQuery'] ) ) {
			$meta_query = $where_args['metaQuery'];
			if ( !empty( $meta_query['metaArray'] ) && is_array( $meta_query['metaArray'] ) ) {
				if ( count( $meta_query['metaArray'] ) > 2 ) {
					unset( $meta_query['relation'] );
				}
				foreach ( $meta_query['metaArray'] as $meta_query_key => $value ) {
					$meta_query[] = [
						$meta_query_key => $value,
					];
				}
			}
			unset( $meta_query['metaArray'] );
		}

		if ( !empty( $meta_query ) ) {
			$query_args['meta_query'] = $meta_query;
		}

		return $query_args;
	}
}
