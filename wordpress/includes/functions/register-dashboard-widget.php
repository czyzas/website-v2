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
	<p>Click button below to start deploy action! <strong>It may take a while.</strong></p>
	<button id="deployButton" class="button button-primary">Deploy Now</button>
	<div id="deployResult"></div>
	<script type="text/javascript">
		jQuery(document).ready(function ($) {
			$('#deployButton').click(function () {
				let seconds = 0;
				$("#deployResult").html(`Deploying, please wait... ${seconds}s`);

				const interval = setInterval(function () {
					seconds++;
					$("#deployResult").html(`Deploying, please wait... ${seconds}s`);
				}, 1000);

				const data = {
					'action': 'deploy_action',
				};

				$.post(ajaxurl, data, function (response) {
					console.log(response)
					clearInterval(interval);
					$("#deployResult").html(response);
				}).fail(function () {
					clearInterval(interval);
					$("#deployResult").html("Deployment failed. Please try again.");
				});
			});
		});
	</script>
	<?php
}

add_action( 'wp_ajax_deploy_action', 'deploy_via_ajax' );
function deploy_via_ajax() {
	date_default_timezone_set( 'Europe/Warsaw' );
	$deploy_by_hook = deploy_by_hook();

	if ( $deploy_by_hook ) {
		$list = get_deployments_list_by_timestamp( $deploy_by_hook['job']['createdAt'] - 2 * 60 * 1000 );
		$status = check_deploy_status( $list['deployments'][0]['uid'] );
		wp_send_json( "<br>Deployment status: $status", 200 );
	} else {
		wp_send_json( "Something went wrong. Please try again.", 500 );
	}

	wp_die();
}

function check_deploy_status( $deployment_id ) {
	$status = 'ERROR';
	if ( !$deployment_id ) return $status;

	$i = 0;
	while ( $status !== 'READY' || $i > 4 ) {
		$response = call_wp_remote_get( "https://api.vercel.com/v13/deployments/$deployment_id" );

		$data = wp_remote_retrieve_body( $response );
		$data = json_decode( $data, true );

		if ( $data ) {
			$status = $data['readyState'];
		} else {
			break;
		}
		sleep( 5 );
		$i++;
	}

	return $status;
}

function deploy_by_hook() {
	$cache = '?buildCache=true';
	$url = "https://api.vercel.com/v1/integrations/deploy/prj_aYdxE68FQViKIajOyeHvioXtgNPF/UD2ZpNTmV5$cache";
	$response = wp_remote_get( $url );

	if ( is_wp_error( $response ) ) {
		return "Something went wrong: {$response->get_error_message()}";
	}

	$body = wp_remote_retrieve_body( $response );
	$responseData = json_decode( $body, true );
	wp_send_json("Created at: " . date( 'd-m-Y H:i', $responseData['job']['createdAt'] / 1000 ));

	return $responseData;
}

function get_deployments_list_by_timestamp( $deploy_timestamp ) {
	$team_id = 'team_k6tXwaKmg3RTdWylb80jkASu';
	$project_id = 'prj_aYdxE68FQViKIajOyeHvioXtgNPF';
	$url = "https://api.vercel.com/v6/deployments?teamId=$team_id&projectId=$project_id&since=$deploy_timestamp";
	$response = call_wp_remote_get( $url );
	if ( is_wp_error( $response ) ) {
		return "Something went wrong: {$response->get_error_message()}";
	}

	$list = wp_remote_retrieve_body( $response );

	return json_decode( $list, true );
}

function call_wp_remote_get( $url ): WP_Error|array {
	$token = "DXCyBCVERTwxk843WJm0aGqC";
	$headers = array(
		'Content-Type'  => 'application/json',
		'Authorization' => "Bearer $token"
	);

	return wp_remote_get( $url, array(
		'headers' => $headers,
	) );
}
