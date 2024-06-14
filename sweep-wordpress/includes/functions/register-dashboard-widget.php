<?php
/**
 * Add a widget to the dashboard.
 *
 * This function is hooked into the 'wp_dashboard_setup' action below.
 */

use function Env\env;

add_action( 'wp_dashboard_setup', function () {
	wp_add_dashboard_widget(
		'deploy_page',
		'Deploy Page',
		'deploy_page_callback'
	);
} );

function deploy_page_callback() {
	global $wpdb;
	$table_name = "{$wpdb->prefix}deploy_logs";
	$results = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $table_name ORDER BY id DESC LIMIT %d", 1 ), ARRAY_A );
	$result = $results[0] ?? [];
	?>
	<p>Click button below to start deploy action! <strong>It may take a while.</strong></p>
	<button id="deployButton"
	        class="button button-primary"
	        style="margin-bottom: 20px;"
	>Deploy Now
	</button>
	<div id="deployResult">
		<strong>Last deploy:</strong><br>
		<?php if ( $result ): ?>
			UID: <?php echo $result['uid']; ?><br>
			Status: <?php echo $result['status']; ?><br>
			Created at: <?php echo $result['created_at']; ?><br>
			User: <?php echo $result['user']; ?><br>
		<?php endif; ?>
	</div>
	<?php
}

function deploy_page_js_script() {
	?>
	<script type="text/javascript">
		jQuery(document).ready(function ($) {
			const deployButton = $('#deployButton');
			deployButton.click(function () {
				let seconds = 0;
				const deployResult = $('#deployResult');

				deployResult.html(`Deploying, please wait... ${seconds}s`);
				deployButton.prop('disabled', true);

				const interval = setInterval(function () {
					seconds++;
					deployResult.html(`Deploying, please wait... ${seconds}s`);
				}, 1000);

				const data = {
					'action': 'deploy_action',
				};

				$.post(ajaxurl, data, function (response) {
					clearInterval(interval);
					deployResult.html(response);
					deployButton.prop('disabled', false);
				}).fail(function () {
					clearInterval(interval);
					deployResult.html('Deployment failed. Please try again.');
					deployButton.prop('disabled', false);
				});
			});
		});
	</script>
	<?php
}

add_action( 'admin_footer', 'deploy_page_js_script' );


add_action( 'wp_ajax_deploy_action', 'deploy_via_ajax' );
function deploy_via_ajax() {
	global $wpdb;
	date_default_timezone_set( 'Europe/Warsaw' );

	$deploy_by_hook = deploy_by_hook();
	if ( $deploy_by_hook ) {
		sleep( 5 );
		$list = get_deployments_list_by_timestamp( $deploy_by_hook['job']['createdAt'] - 2 * 60 * 1000 );
		$status = check_deploy_status( $list['deployments'][0]['uid'] );

		$date = date( 'Y-m-d H:i:s', intval( $deploy_by_hook['job']['createdAt'] / 1000 ) );
		$response = "<strong>Current deploy:</strong><br> UID: {$list['deployments'][0]['uid']} <br> Created at: $date <br> Deployment status: $status";

		$table_name = "{$wpdb->prefix}deploy_logs";
		$data = array(
			'uid'        => $list['deployments'][0]['uid'],
			'status'     => $status,
			'created_at' => $date,
			'user'       => get_the_author_meta( 'nickname', get_current_user_id() ),
		);
		create_db_table( $table_name );
		$wpdb->insert( $table_name, $data );
		wp_send_json( $response, 200 );
	} else {
		wp_send_json( "Something went wrong. Please try again.", 500 );
	}

	wp_die();
}

function check_deploy_status( $deployment_id ) {
	$status = 'NO PARAM';
	if ( !$deployment_id ) return $status;

	$i = 0;
	while ( $i < 240 ) {
		$response = call_wp_remote_get( "https://api.vercel.com/v13/deployments/$deployment_id" );

		$data = wp_remote_retrieve_body( $response );
		$data = json_decode( $data, true );

		if ( $data ) {
			$status = $data['readyState'];
			if ( $status === 'READY' || $status === 'ERROR' ) {
				return $status;
			}
		} else {
			break;
		}
		sleep( 10 );
		$i++;
	}

	return $status;
}

function deploy_by_hook() {
	$cache = '?buildCache=true';
	$vercel_deploy_hook = env( 'VERCEL_DEPLOY_HOOK' );
	$url = $vercel_deploy_hook . $cache;
	$response = wp_remote_get( $url );

	if ( is_wp_error( $response ) ) {
		return "Something went wrong: {$response->get_error_message()}";
	}

	$body = wp_remote_retrieve_body( $response );

	return json_decode( $body, true );
}

function get_deployments_list_by_timestamp( $deploy_timestamp ) {
	$team_id = env( 'VERCEL_TEAM_ID' );
	$project_id = env( 'VERCEL_PROJECT_ID' );
	$url = "https://api.vercel.com/v6/deployments?teamId=$team_id&projectId=$project_id&since=$deploy_timestamp";
	$response = call_wp_remote_get( $url );
	if ( is_wp_error( $response ) ) {
		return "Something went wrong: {$response->get_error_message()}";
	}

	$list = wp_remote_retrieve_body( $response );

	return json_decode( $list, true );
}

function call_wp_remote_get( $url ): WP_Error|array {
	$token = env( 'VERCEL_TOKEN' );
	$headers = array(
		'Content-Type'  => 'application/json',
		'Authorization' => "Bearer $token"
	);

	return wp_remote_get( $url, array(
		'headers' => $headers,
	) );
}

function create_db_table( $table_name ) {
	global $wpdb;

	//$wpdb->query("DROP TABLE IF EXISTS $table_name");

	if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) != $table_name ) {
		$charset_collate = $wpdb->get_charset_collate();
		$sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            uid varchar(100) NOT NULL,
            status varchar(100) NOT NULL,
            created_at datetime NOT NULL,
            user varchar(100) NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}
}
