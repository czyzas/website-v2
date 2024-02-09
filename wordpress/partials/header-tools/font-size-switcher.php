<?php $font_size_id = uniqid(); ?>
<div class="tool-container font-size-switcher">
	<button
		type="button"
		class="tool-trigger font-trigger"
		data-action="switch-font-size"
		aria-labelledby="font-size-label-<?= $font_size_id ?>"
	>
		<span class="sr-only" id="font-size-label-<?= $font_size_id ?>">
			<span><?php echo __tr( 'rozmiar_tekstu' ) ?></span>
			<span
				class="font-size-name"
				id="font-size-name-<?= $font_size_id ?>"
			><?php echo __tr( 'normalna' ) ?></span>
		</span>
		<?php get_template_part( 'dist/images/font.svg' ) ?>
	</button>
</div>