<?php

add_filter( 'graphql_connection_max_query_amount', 'graphql_limit_posts' );
add_filter( 'graphql_connection_amount_requested', 'graphql_limit_posts' );
function graphql_limit_posts(): int {
	return 300;
}

