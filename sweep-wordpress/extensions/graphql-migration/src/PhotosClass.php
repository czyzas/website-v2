<?php

namespace FH_Migration;

class PhotosClass extends MigrationClass implements MigrationInterface {
	public string $query_code = <<<'QUERY'
						query($limit: Int, $skip: Int) {
						  allGraphCmsAsset(
						    filter: {coverImageArticle: {elemMatch: {category: {usage: {eq: Library}}}}, locale: {eq: en}}
						    limit: $limit
						    skip: $skip
						  ) {
						    pageInfo {
						      currentPage
						      itemCount
						      pageCount
						      perPage
						      totalCount
						    }
						    nodes {
						      remoteId
						      url
						      alt
						      fileName
						      mimeType
						    }
						  }
						}
						QUERY;

	public function migrate() {
		do {
			$data = $this->getData();
			foreach ( $data['allGraphCmsAsset']['nodes'] as $asset ) {
				$remote_id = $asset['remoteId'];
				$attachment_args = [
					'post_type' => 'attachment',
					'post_status' => 'inherit',
					'meta_query' => [
						'key' => 'remote_id',
						'value' => $remote_id
					],
					'fields' => 'ids'
				];
				$attachment_check = new \WP_Query($attachment_args);

				if (!$attachment_check->have_posts()) {
					$filename = $asset['fileName'];
					$image_data = file_get_contents($asset['url']);
					$upload_dir = wp_upload_dir();
					$upload_path = $upload_dir['path'] . '/' . $filename;
					if (file_put_contents($upload_path, $image_data)) {
						$attachment = array(
							'guid'           => $upload_dir['url'] . '/' . $filename,
							'post_mime_type' => $asset['mimeType'],
							'post_title'     => preg_replace('/\.[^.]+$/', '', $filename),
							'post_content'   => '',
							'post_status'    => 'inherit'
						);

						$attach_id = wp_insert_attachment($attachment, $upload_path);

						require_once(ABSPATH . 'wp-admin/includes/image.php');
						$attach_data = wp_generate_attachment_metadata($attach_id, $upload_path);
						wp_update_attachment_metadata($attach_id, $attach_data);
						update_post_meta($attach_id, '_wp_attachment_image_alt', $asset['alt']);
						add_post_meta($attach_id, 'remote_id', $remote_id);
					} else {
						throw new \Exception('Can\'t upload ' . $filename . '. ID - ' . $remote_id);
					}
				}
			}
			$this->query_variables['skip'] = $data['allGraphCmsAsset']['pageInfo']['currentPage'] * $data['allGraphCmsAsset']['pageInfo']['itemCount'];
//		} while ($data['allGraphCmsAsset']['pageInfo']['pageCount'] > $data['allGraphCmsAsset']['pageInfo']['currentPage']);
		} while ($data['allGraphCmsAsset']['pageInfo']['pageCount'] < $data['allGraphCmsAsset']['pageInfo']['currentPage']);
		return $data;
	}
}
