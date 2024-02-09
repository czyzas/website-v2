<?php
$hide_search = get_field( 'hide_search', FH_OPTIONS_PAGE );
?>
<?php if ( !$hide_search ): ?>
	<div class="custom-modal search-results-modal">
		<div class="box">
			<div class="close-icon close-modal">
				<?php get_template_part( 'dist/images/close.svg' ) ?>
			</div>
			<div class="m-body">
				<h2><?php echo __tr( 'wyniki_wyszukiwania' ) ?> <i class="phrase-container"></i></h2>
				<div class="results-container custom-scrollbar">
					<ul class="results-list"></ul>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>
