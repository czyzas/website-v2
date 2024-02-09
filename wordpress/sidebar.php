<aside class="report-tools">
	<button
		type="button"
		class="tools-trigger"
		data-action="toggle-tools"
		aria-expanded="false"
		aria-controls="tools-list"
	>
		<span><?php echo __tr( 'narzedzia' ); ?></span>

		<span data-open="true"><?php get_template_part( 'dist/images/close.svg' ) ?></span>
		<span data-open="false"><?php get_template_part( 'dist/images/tools-hamburger.svg' ) ?></span>
	</button>
	<ul class="tools-list" id="tools-list">
		<li>
			<button
				type="button"
				data-action="toggle-highlighter"
				aria-pressed="false"
				aria-labelledby="toggle-highlighter-description"
			>
				<span
					class="icon-container"
					aria-hidden="true"
				><?php get_template_part( 'dist/images/highlight-text-icon.svg' ) ?></span>

				<span
					class="tool-description"
					id="toggle-highlighter-description"
				><?php echo __tr( 'podkresl_tekst' ); ?></span>
			</button>
		</li>
		<li>
			<button
				type="button"
				class="with-active-icon"
				data-active="false"
				data-action="add-to-print-basket"
				aria-labelledby="add-to-print-basket-description"
			>
				<span
					class="icon-container"
					aria-hidden="true"
				>
					<span class="icon-inactive"><?php get_template_part( 'dist/images/add-to-print-basket-icon.svg' ) ?></span>
					<span class="icon-active"><?php get_template_part( 'dist/images/check.svg' ) ?></span>
				</span>

				<span
					class="tool-description"
					id="add-to-print-basket-description"
				><?php echo __tr( 'dodaj_do_koszyka_z_wydrukami' ); ?></span>
			</button>
		</li>
		<li>
			<a href="<?php echo get_field( 'tools_print_basket_page', FH_OPTIONS_PAGE ); ?>"
			   aria-labelledby="go-to-print-basket-description"
			>
				<span
					class="icon-container"
					aria-hidden="true"
				><?php get_template_part( 'dist/images/go-to-print-basket-icon.svg' ) ?></span>

				<span
					class="tool-description"
					id="go-to-print-basket-description"
				><?php echo __tr( 'idz_do_koszyka_z_wydrukami' ); ?></span>
			</a>
		</li>
		<li>
			<button
				type="button"
				data-action="use-print-version"
				aria-pressed="false"
				aria-labelledby="use-print-version-description"
			>
				<span
					class="icon-container"
					aria-hidden="true"
				><?php get_template_part( 'dist/images/print-version-icon.svg' ) ?></span>
				<span
					class="tool-description"
					id="use-print-version-description"
				><?php echo __tr( 'wersja_do_druku' ); ?></span>
			</button>
		</li>
		<li>
			<button
				type="button"
				data-action="show-notes-tool"
				aria-labelledby="show-notes-tool-description"
			>
				<span
					class="icon-container"
					aria-hidden="true"
				><?php get_template_part( 'dist/images/add-note-icon.svg' ) ?></span>

				<span
					class="tool-description"
					id="show-notes-tool-description"
				><?php echo __tr( 'dodaj_notatke' ); ?></span>
			</button>
		</li>
		<li>
			<a href="<?php echo get_field( 'tools_notes_page', FH_OPTIONS_PAGE ); ?>"
			   aria-labelledby="tools-notes-page-description"
			>
				<span
					class="icon-container"
					aria-hidden="true"
				><?php get_template_part( 'dist/images/see-notes-icon.svg' ) ?></span>
				<span
					class="tool-description"
					id="tools-notes-page-description"
				><?php echo __tr( 'zobacz_notatki' ); ?></span>
			</a>
		</li>
	</ul>
</aside>
