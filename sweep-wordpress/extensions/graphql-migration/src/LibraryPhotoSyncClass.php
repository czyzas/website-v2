<?php

namespace FH_Migration;

class LibraryPhotoSyncClass extends MigrationClass implements MigrationInterface {
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
						      coverImageArticle {
						        remoteId
						      }
						    }
						  }
						}
						QUERY;

	public function migrate() {
		do {
			$data = $this->getData();
			foreach ( $data['allGraphCmsAsset']['nodes'] as $asset ) {
				$remote_id = $asset['remoteId'];
				$posts = [];
				$attachment_args = [
					'post_type' => 'attachment',
					'post_status' => 'inherit',
					'meta_query' => [
						'key' => 'remote_id',
						'value' => $remote_id
					],
					'fields' => 'ids'
				];
				$attachment = new \WP_Query($attachment_args);

				if ($attachment->have_posts()) {
					foreach ($asset['coverImageArticle'] as $remote_post_id) {
						$posts_args = [
							'post_type' => 'library',
							'post_status' => 'publish',
							'meta_query' => [
								'key' => 'remote_id',
								'value' => $remote_post_id['remoteId']
							],
							'fields' => 'ids'
						];
						$posts_ids = new \WP_Query($posts_args);
						$posts = array_merge($posts, $posts_ids->posts);
					}
					if ($posts) {
						$attachment_id = $attachment->posts[0];
						foreach ($posts as $post) {
							set_post_thumbnail($post, $attachment->ID);
						}
					}
				}
			}
			$this->query_variables['skip'] = $data['allGraphCmsAsset']['pageInfo']['currentPage'] * $data['allGraphCmsAsset']['pageInfo']['itemCount'];
//		} while ($data['allGraphCmsAsset']['pageInfo']['pageCount'] > $data['allGraphCmsAsset']['pageInfo']['currentPage']);
		} while ($data['allGraphCmsAsset']['pageInfo']['pageCount'] < $data['allGraphCmsAsset']['pageInfo']['currentPage']);
		return $data;
	}
}
