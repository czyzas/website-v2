<?php
$cookies = get_options_field('cookies', 'cookies-options');
$module_enabled = $cookies['module_enabled'] ?? false;
$consent_cookie = $_COOKIE['fhpcookie'] ?? false;
?>
<?php if ( $module_enabled ): ?>
	<?php
	$show_options_on_init = $cookies['show_options_on_init'];
	$bar_text = $cookies['bar_text'];
	$popup_main_text = $cookies['popup_main_text'];
	$cookies['required_title'] = $cookies['required_title'] ?: __tr( 'cookies_niezbedne' );
	$cookies['functional_title'] = $cookies['functional_title'] ?: __tr( 'cookies_funkcjonalne' );
	$cookies['analytical_title'] = $cookies['analytical_title'] ?: __tr( 'cookies_analityczne' );
	$cookies['marketing_title'] = $cookies['marketing_title'] ?: __tr( 'cookies_marketingowe' );
	$links = $cookies['links'];
	$accept_all_cookies = __tr( 'zaakceptuj_wszystkie' );
	$reject_all_cookies = __tr( 'odrzuc_wszystkie' );
	$cookies_settings = __tr( 'ustawienia_cookies' );
	$save_cookies_choice = __tr( 'zapisz_wybor' );

	$consents = array_map( function ( $consent ) use ( $cookies ) {
		return [
			'id'    => $consent,
			'show'  => $cookies["{$consent}_show"] ?? false,
			'title' => $cookies["{$consent}_title"] ?? '',
			'text'  => $cookies["{$consent}_text"] ?? '',
		];
	}, [ 'required', 'functional', 'analytical', 'marketing' ] );
	?>
	<div class="fhp-cookies">
		<div class="fhp-cookies-bar<?php if ( !$consent_cookie ) echo ' open' ?>">
			<div class="fhp-cookies-bar-content">
				<p class="fhp-cookies-info"><?php echo $bar_text; ?></p>
				<div class="fhp-cookies-buttons">
					<button class="button button-brand fhp-cookies-accept-all"><?php echo $accept_all_cookies; ?></button>
					<button class="button button-brand fhp-cookies-reject-all"><?php echo $reject_all_cookies; ?></button>
					<button class="button button-brand fhp-cookies-open-settings"><?php echo $cookies_settings; ?></button>
				</div>
			</div>
		</div>
		<div class="fhp-cookies-popup<?php if ( !$consent_cookie && $show_options_on_init ) echo ' open' ?>">
			<div class="fhp-cookies-settings">
				<div class="fhp-cookies-settings-content">
					<div class="main-text">
						<?php echo $popup_main_text; ?>
					</div>

					<div class="fhp-cookies-buttons">
						<button class="button button-brand fhp-cookies-accept-all"><?php echo $accept_all_cookies; ?></button>
						<button class="button button-brand fhp-cookies-reject-all"><?php echo $reject_all_cookies; ?></button>
					</div>


					<?php if ( $consents ): ?>
						<div class="fhp-cookies-consents">
							<?php foreach ( $consents as $consent_index => $consent ): ?>
								<?php if ( $consent['show'] || $consent_index === 0 ): ?>
									<div class="fhp-cookies-consent">
										<div class="title">
											<h3><?php echo $consent['title']; ?></h3>
											<div class="fhp-cookies-field-checkbox">
												<input
													type="checkbox"
													id="fhp-cookies-consent-<?php echo $consent['id']; ?>"
													name="fhp-cookies-consent-<?php echo $consent['id']; ?>"
													data-consent="<?php echo $consent['id']; ?>"
													class="fhp-cookies-input"
													<?php
													if ( $consent_index === 0 )
														echo 'checked disabled';
													?>
												>
												<label for="fhp-cookies-consent-<?php echo $consent['id']; ?>">
                                                <span class="switch">
                                                </span>
												</label>
											</div>
										</div>
										<div class="content">
											<?php echo $consent['text']; ?>
										</div>
									</div>
								<?php endif; ?>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
					<div class="fhp-cookies-buttons">
						<button class="button button-brand fhp-cookies-save-choice"><?php echo $save_cookies_choice; ?></button>
					</div>
					<?php if ( $links ): ?>
						<ul class="fhp-cookies-links">
							<?php foreach ( $links as $link_index => $link ): $link = $link['link']; ?>
								<?php if ( $link ): ?>
									<li>
										<a href="<?php echo $link['url']; ?>"
										   target="<?php echo $link['target'] ?: '_self'; ?>"
										><?php echo $link['title']; ?></a>
									</li>
								<?php endif; ?>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>
