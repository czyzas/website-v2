<?php $previous_reports = get_field( 'previous_reports', FH_OPTIONS_PAGE ); ?>
<?php if ( $previous_reports ): ?>
	<div class="previous-reports side-top">
		<button type="button" aria-expanded="false" class="previous-reports-trigger">
			<?php echo __tr( 'poprzednie_raporty' ); ?>
			<?php get_template_part( 'dist/images/previous-reports.svg' ) ?>
		</button>
		<ul class="previous-reports-list" aria-label="<?php echo __tr('poprzednie_raporty'); ?>">
			<?php foreach ( $previous_reports as $report ): ?>
				<?php $link = $report['link']; ?>
				<?php if ( $link ): ?>
					<li class="previous-reports-link" role="presentation">
						<?php echo fh_acf_link( $link ); ?>
					</li>
				<?php endif; ?>
			<?php endforeach; ?>
		</ul>
	</div>
<?php endif; ?>