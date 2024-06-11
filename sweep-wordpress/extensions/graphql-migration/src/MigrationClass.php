<?php

namespace FH_Migration;

use FH_Migration\Exception;
use Softonic\GraphQL\Client;
use Softonic\GraphQL\ClientBuilder;
use Softonic\GraphQL\Response;
use WP_Query;

abstract class MigrationClass
{
	public string $query_code;

	public array $query_variables = [];
	private string $api_address = 'http://localhost:8000/___graphql';

	private Client $client;
	protected string $locale;

	public function __construct() {
		$this->client = ClientBuilder::build($this->api_address);

		$this->locale = isset($_GET['locale']) && is_string($_GET['locale']) ? (string)$_GET['locale']: 'en';

		$this->query_variables = [
			'limit' => isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit']: 12,
			'skip' => isset($_GET['skip']) && is_numeric($_GET['skip']) ? (int)$_GET['skip']: 0,
			'locale' => $this->locale,
		];

		if(isset($_GET['remoteId']) && is_string($_GET['remoteId'])) {
			$this->query_variables['remoteId'] = (string)$_GET['remoteId'];
		}
	}

	protected function fetchData(): Response {
		return $this->client->query($this->query_code, $this->query_variables);
	}

	protected function parseData($data): array {
		return $data->getData();
	}

	protected function handleErrors($data): void {
		if ($data->hasErrors()) {
			throw new Exception('API Error: ' . implode(', ', $data->getErrors()));
		}
	}

	public function getData(): array {
		$data = $this->fetchData();
		$this->handleErrors($data);
		return $this->parseData($data);
	}

	protected function changeIDToEn($id) {
		// Regex to match the pattern and capture groups
		$pattern = '/^((?:[^:]+:)*)([^:]+):([^:]+)$/';
		$replacement = '${1}en:${3}';

		// Use preg_replace to perform the replacement
		$newId = preg_replace($pattern, $replacement, $id);

		return $newId;
	}

	protected function getTrid( $id, $post_type ) {
		global $sitepress;
		$main_article_id = $this->changeIDToEn($id);
		$check_post_args = array(
			'posts_per_page'   => 1,
			'post_type'        => $post_type,
			'meta_key'         => 'hygraph_id',
			'meta_value'       => $main_article_id,
			'fields'            => 'ids'
		);
		$check_post = new WP_Query( $check_post_args );
		if ($check_post->have_posts()) {
			return $sitepress->get_element_trid($check_post->posts[0], "post_$post_type");
		}
		return null;
	}
}
