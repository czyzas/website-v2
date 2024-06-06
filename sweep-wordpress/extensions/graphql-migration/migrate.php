<?php

use FH_Migration\InsightBasicClass;
use FH_Migration\InsightsCategoriesClass;
use FH_Migration\LibraryBasicClass;
use FH_Migration\LibraryCategoriesClass;
use FH_Migration\LibraryPhotoSyncClass;
use FH_Migration\NewsroomBasicClass;
use FH_Migration\NewsroomCategoriesClass;
use FH_Migration\PhotosClass;
use FH_Migration\TagsClass;

require __DIR__ . '/vendor/autoload.php';


add_action( 'rest_api_init', function () {
	register_rest_route( 'migrate', '/(?P<type>[a-zA-Z0-9-]+)', array(
		'methods'  => 'GET',
		'callback' => function (WP_REST_Request $request) {
			$type = $request->get_param('type');
			$migration = match ($type) {
				'insights-categories' => new InsightsCategoriesClass(),
				'newsroom-categories' => new NewsroomCategoriesClass(),
//				'tags' => new TagsClass(),
//				'photos' => new PhotosClass(),
//				'library-basic' => new LibraryBasicClass(),
				'newsroom-basic' => new NewsroomBasicClass(),
				'insight-basic' => new InsightBasicClass(),
//				'library-photo-sync' => new LibraryPhotoSyncClass(),
				default => throw new Exception('Wrong migration type')
			};
			try {
				$data = $migration->migrate();
			} catch (Exception  $e) {
				$data = $e->getMessage();
			}

			return new WP_REST_Response($data);
		},
	) );
} );
