<?php

namespace FH_Migration;

class PhotoClass
{
	private string $hygraph_id;

	private ?int $article_id;

	private array $asset;

	/**
	 * @param ?int $article_id
	 * @param array $asset
	 */
	public function __construct( array $asset, ?int $article_id = null ) {
		$this->article_id = $article_id;
		$this->asset = $asset;
	}


	public function getId() {
		if(empty($this->asset)) {
			return null;
		}
		$attachment = $this->checkExists();

		return $attachment ?? $this->storeImage();
	}

	private function checkExists() {
		global $sitepress;
		$attachment_args = [
			'posts_per_page' => 1,
			'post_type' => 'attachment',
			'post_status' => 'inherit',
			'meta_query' => array(
				array(
					'key'       => 'hygraph_id',
					'value'     => $this->asset['id'],
					'compare'   => '='
				)
			),
			'fields' => 'ids'
		];
		$sitepress->switch_lang($sitepress->get_default_language());
		$attachment_check = new \WP_Query($attachment_args);

		return $attachment_check->have_posts() ? $attachment_check->posts[0] : null;
	}

	private function storeImage() {
		$filename = $this->asset['fileName'];
		$image_data = file_get_contents($this->asset['url']);
		$upload_dir = wp_upload_dir();
		$upload_path = $upload_dir['path'] . '/' . $filename;
		if (file_put_contents($upload_path, $image_data)) {
			$attachment = array(
				'guid'           => $upload_dir['url'] . '/' . $filename,
				'post_mime_type' => $this->asset['mimeType'],
				'post_title'     => preg_replace( '/\.[^.]+$/', '', $filename ),
				'post_content'   => '',
				'post_status'    => 'inherit'
			);

			$attach_id = wp_insert_attachment( $attachment, $upload_path, $this->article_id );

			require_once( ABSPATH . 'wp-admin/includes/image.php' );
			$attach_data = wp_generate_attachment_metadata( $attach_id, $upload_path );
			wp_update_attachment_metadata( $attach_id, $attach_data );
			update_post_meta( $attach_id, '_wp_attachment_image_alt', $this->asset['alt'] );
			wp_update_post( [
				'ID'          => $attach_id,
				'post_author' => 1,
			] );
			add_post_meta( $attach_id, 'hygraph_id', $this->asset['id'] );

			return $attach_id;
		}
		return null;
	}
}
