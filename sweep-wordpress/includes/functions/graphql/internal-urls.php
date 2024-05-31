<?php
add_action( 'graphql_register_types', function () {
	try {
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

	} catch ( Exception $e ) {
	}
} );

// Replace current host url with internal url
add_filter( 'the_content', function ( $str ) {
	$current_host = $_SERVER['HTTP_HOST'];
	$URL_RE = sprintf( '/href=[\'"]https?:\/\/%s(\/.*[^\/])\/?[\'"]/', preg_quote( $current_host ) );
	$str = preg_replace( $URL_RE, 'href="$1"', $str );

	return $str;
}, 9999 );
