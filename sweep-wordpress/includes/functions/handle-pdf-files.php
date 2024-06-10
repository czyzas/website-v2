<?php
function wp_rename_filename( $filename, $post_id = 0 ) {
	$info = pathinfo( $filename );
	$ext = empty( $info['extension'] ) ? '' : '.' . $info['extension'];
	$name = basename( $filename, $ext );

	return $name . '-' . $post_id . $ext;
}

add_action( 'add_attachment', function ( $attachment_ID ) {
	$file = get_attached_file( $attachment_ID );
	$filetype = wp_check_filetype( $file );
	if ( $filetype['ext'] !== 'pdf' ) {
		return;
	}

	$upload_dir = wp_upload_dir();
	$upload_path = trailingslashit( $upload_dir['path'] );

	$filename = basename( $file );
	$new_filename = wp_rename_filename( $filename, $attachment_ID );
	$new_file = $upload_path . $new_filename;

	rename( $file, $new_file );

	update_attached_file( $attachment_ID, $new_file );

	wp_update_attachment_metadata( $attachment_ID, wp_generate_attachment_metadata( $attachment_ID, $new_file ) );

	$slug = pathinfo( $new_filename, PATHINFO_FILENAME );

	$attachment_post = array(
		'ID'        => $attachment_ID,
		'post_name' => sanitize_title( $slug )
	);
	wp_update_post( $attachment_post );
} );


add_filter('the_content', function ($content) {
	$pattern = '/href="[^"]*\/uploads\/(?:\d{4}\/\d{2}\/)?([^"]*\.pdf)"/';
	$replacement = 'href="/pdf/$1"';
	$content = preg_replace($pattern, $replacement, $content);
	return $content;
});


add_action('graphql_register_types', function() {
	register_graphql_field('MediaItem', 'frontMediaItemUrl', [
		'type' => 'String',
		'resolve' => function($mediaItem) {
			$file_url = wp_get_attachment_url($mediaItem->ID);

			$filetype = wp_check_filetype(get_attached_file($mediaItem->ID));
			if ($filetype['ext'] === 'pdf') {
				$filename = basename($file_url);
				$new_url = "/pdf/$filename";
				return $new_url;
			}

			return $file_url;
		}
	]);
});
