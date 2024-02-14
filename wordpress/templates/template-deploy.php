<?php
/*
	Template name: Deploy
*/

get_header(); ?>

	<main class="subpage">
		<?php
		include( locate_template( 'partials/top.php' ) );

		$cache = '?buildCache=false';
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
				foreach ($responseData as $key => $value) {
					if (is_array($value)) {
						echo "$key:  <br>";
						foreach ($value as $subKey => $subValue) {
							echo "$subKey: $subValue <br>";
						}
						echo "<br>";
					} else {
						echo "$key: $value <br>";
					}
				}
			} else {
				echo "Invalid JSON response";
			}
		}
		?>
	</main>

<?php get_footer();

