<?php
$hide_search = get_field( 'hide_search', FH_OPTIONS_PAGE );
?>
<?php if ( !$hide_search ): ?>
	<div class="tool-container search-container">
		<button
			type="button"
			class="tool-trigger search-trigger"
			data-action="search-trigger"
			aria-controls="site-search-panel"
			aria-expanded="false"
			aria-label="<?php echo __tr( 'szukaj' ) ?>"
		>
			<span class="search-icon-open"><?php get_template_part( 'dist/images/search.svg' ); ?></span>
			<span class="search-icon-close"><?php get_template_part( 'dist/images/close.svg' ); ?></span>
		</button>
		<div class="search-panel" id="site-search-panel">
			<form class="search-panel-wrapper">
				<input
					class="search-input"
					name="search-term"
					placeholder="<?php echo __tr( 'szukaj' ) ?>"
					aria-label="<?php echo __tr( 'wpisz_wyszukiwane_haslo' ) ?>"
				/>
				<button
					type="submit"
					class="perform-search"
					aria-label="<?php echo __tr('pokaz_wyniki_wyszukiwania')?>"
				><?php get_template_part( 'dist/images/search.svg' ) ?></button>
			</form>
		</div>
	</div>
<?php endif; ?>