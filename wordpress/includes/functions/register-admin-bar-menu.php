<?php

add_action( 'admin_bar_menu', function ( $wp_admin_bar ) {
	$args = array(
		'id'    => 'site-redeploy',
		'title' => 'Deploy page',
		'meta' => array( 'class' => 'ib-icon' ),
		'href'  => '/deploy/',
	);
	$wp_admin_bar->add_node( $args );
}, 999 );
