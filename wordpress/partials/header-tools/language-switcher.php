<?php
$switcher_languages = [
	[
		'code'  => 'pl',
		'title' => 'PL',
		'label' => __tr( 'jezyk_polski' ),
	],
	[
		'code'  => 'en',
		'title' => 'EN',
		'label' => __tr( 'jezyk_angielski' ),
	],
]
?>
<?php if ( $switcher_languages ): ?>
	<div class="tool-container language-switcher">
		<ul class="languages">
			<?php foreach ( $switcher_languages as $language ): ?>
				<?php if ( FH_LANGUAGE !== $language['code'] ): ?>
					<li>
						<?php echo fh_acf_link( [
							'title' => $language['title'],
							'url'   => "/" . $language['code'],
						], [
							'attrs' => [
								'aria-label' => $language['label']
							]
						] ); ?>
					</li>
				<?php endif; ?>
			<?php endforeach; ?>
		</ul>
	</div>
<?php endif; ?>
