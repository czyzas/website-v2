<?php
add_action( 'media_buttons', function () {
	echo '<button type="button" class="numbers-converter button">Konwerter liczb</button>';
}, 15 );

add_action( 'admin_enqueue_scripts', function () {
	wp_enqueue_script( 'numbers-converter-button', get_template_directory_uri() . '/includes/numbers-converter/numbers-converter-admin.js', array( 'jquery' ), '1.0', true );
} );

add_action( 'admin_head', function () {
	wp_enqueue_style( 'numbers-converter-button', get_template_directory_uri() . '/includes/numbers-converter/numbers-converter-admin.css', false, '1.0' );
} );