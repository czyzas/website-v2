<?php
	// Add custom image sizes
	add_image_size( 'fhd', 1920 );
	add_image_size( 'bootstrap-container', 1140 );
	add_image_size( 'mobile-xs', 575 );

    // Prevent sizes from creating
    # Thumbnail 150x150 (crop)
    update_option( 'thumbnail_size_h', 150 );
    update_option( 'thumbnail_size_w', 150 );
    update_option( 'thumbnail_crop', 0 ); // disable crop
    # Medium (300px)
    update_option( 'medium_size_h', 0 );
    update_option( 'medium_size_w', 0 );
    # Medium_large (768px)
    update_option( 'medium_large_size_w', 0 );
    update_option( 'medium_large_size_h', 0 );
    # Large (1024px)
    update_option( 'large_size_h', 0 );
    update_option( 'large_size_w', 0 );

    // Remove 2x sizes
    remove_image_size('1536x1536');
    remove_image_size('2048x2048');
