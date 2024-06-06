<?php

namespace FH_Migration;

use FH_Migration\Exception;
use Softonic\GraphQL\Client;
use Softonic\GraphQL\ClientBuilder;
use Softonic\GraphQL\Response;

abstract class MigrationClass
{
	public string $query_code;

	public array $query_variables = [];
	private string $api_address = 'http://localhost:8000/___graphql';

	private Client $client;

	public function __construct() {
		$this->client = ClientBuilder::build($this->api_address);

		$this->query_variables = [
			'limit' => isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit']: 12,
			'skip' => isset($_GET['skip']) && is_numeric($_GET['skip']) ? (int)$_GET['skip']: 0,
			'locale' => isset($_GET['locale']) && is_string($_GET['locale']) ? (string)$_GET['locale']: 'en',
		];
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
}
