<?php

/**
 * Add a widget to the dashboard.
 *
 * This function is hooked into the 'wp_dashboard_setup' action below.
 */

add_action( 'wp_dashboard_setup', function () {
	wp_add_dashboard_widget(
		'deploy_page',
		'Deploy Page',
		'deploy_page_callback'
	);
} );

function deploy_page_callback() {
	?>
	<style>
		#deployButton {
			margin-bottom: 20px;
		}
	</style>
	<button id="deployButton" class="button button-primary">Deploy Now</button>
	<div id="deployResult"></div>
	<script type="text/javascript">
		jQuery(document).ready(function ($) {
			$('#deployButton').click(function () {
				$("#deployResult").html("Deploying, please wait...");
				const data = {
					'action': 'deploy_action',
				};
				$.post(ajaxurl, data, function (response) {
					$("#deployResult").html(response);
				});
			});
		});
	</script>
	<?php
}

add_action( 'wp_ajax_deploy_action', 'deploy_via_ajax' );
function deploy_via_ajax() {
	date_default_timezone_set( 'Europe/Warsaw' );
	$cache = '?buildCache=true';
	$url = "https://api.vercel.com/v1/integrations/deploy/prj_aYdxE68FQViKIajOyeHvioXtgNPF/UD2ZpNTmV5$cache";
	$headers = array(
		'Content-Type' => 'application/json',
	);

	$response = wp_remote_get( $url, array(
		'headers' => $headers,
	) );

	if ( is_wp_error( $response ) ) {
		$error_message = $response->get_error_message();
		echo "Something went wrong: $error_message";
	} else {
		$body = wp_remote_retrieve_body( $response );
		$responseData = json_decode( $body, true );

		if ( $responseData !== null ) {
			foreach ( $responseData as $key => $value ) {
				if ( is_array( $value ) ) {
					echo "$key:  <br>";
					foreach ( $value as $subKey => $subValue ) {
						if ( $subKey == 'createdAt' ) $subValue = date( 'd-m-Y H:i', $subValue / 1000 );
						echo "$subKey: $subValue <br>";
					}
					echo "<br>";
				} else {
					echo "$key: $value <br>";
				}
			}

			$deploy_timestamp = $responseData['job']['createdAt'] - 30 * 60 * 1000;
			$team_id = 'team_k6tXwaKmg3RTdWylb80jkASu';
			$project_id = 'prj_aYdxE68FQViKIajOyeHvioXtgNPF';
			$token = "DXCyBCVERTwxk843WJm0aGqC";
			$url = "https://api.vercel.com/v6/deployments?teamId=$team_id&projectId=$project_id&since=$deploy_timestamp";
			$headers = array(
				'Content-Type'  => 'application/json',
				'Authorization' => "Bearer $token"
			);
			$response = wp_remote_get( $url, array(
				'headers' => $headers,
			) );

			$body_data = wp_remote_retrieve_body( $response );

			if ( $body_data ) {
				$body_data = json_decode( $body_data, true );

				$status = check_deploy_status($body_data['deployments'][0]['uid'], $headers);

				echo "Deployment status: $status";
			}
		} else {
			echo "Invalid JSON response";
		}
	}
	wp_die();
}

function check_deploy_status($deployment_id, $headers) {
	$status = '';
	$i = 0;
	while ($status !== 'READY' || $i > 10) {
		$response = wp_remote_get("https://api.vercel.com/v13/deployments/$deployment_id", array(
			'headers' => $headers,
		));

		$data = wp_remote_retrieve_body($response);
		$data = json_decode( $data, true );

		if ($data) {
			$status = $data['readyState'];
		}
		sleep(5);
		$i++;
	}
	return $status;
}
