<?php

    // ENQUEUE SCRIPTS AND STYLES
    add_action( 'wp_enqueue_scripts', function () {
        $links = [
            'jquery'         => [
                'css' => '',
                'js'  => get_template_directory_uri() . '/includes/jquery.min.js'
            ],
            'jquery-migrate' => [
                'css' => '',
                'js'  => get_template_directory_uri() . '/includes/jquery-migrate.min.js'
            ],
            'dependency'     => [
                'css' => get_template_directory_uri() . '/dist/css/dependencies.min.css',
                'js'  => get_template_directory_uri() . '/dist/js/dependencies.min.js',
            ],
            'app'            => [
                'css' => get_template_directory_uri() . '/dist/css/app.min.css',
                'js'  => get_template_directory_uri() . '/dist/js/app.min.js',
            ],
        ];

        # JS
        wp_deregister_script( 'jquery' );
        wp_deregister_script( 'jquery-migrate' );

        # CSS
        foreach ( $links as $key => $link ) {

            foreach ( $link as $type => $url ) {
                $ver = getFileLastModifiedDateFromUrl( $url );
                $handle = $key;

                if ( $type === 'css' )
                    wp_enqueue_style( $handle, $url, false, $ver );
                elseif ( $type === 'js' )
                    wp_enqueue_script( $handle, $url, false, $ver, true );
            }

        }

		# Push variables to FRONT
		wp_localize_script('app', 'fh_config', array(
			'ajax_url' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('ajax-nonce'),
			'translations' => getAllTranslations( FH_LANGUAGE ),
			'homepage_url' => fh_homepage_url(),
			'template_uri' => get_template_directory_uri(),
			'page_id' => get_the_ID(),
			'page_url' => get_the_permalink(),
		));

    } );

