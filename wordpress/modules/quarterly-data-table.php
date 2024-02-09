<?php
$rows = get_sub_field( 'table_row' );
$cols = [];
foreach ( $rows as $row ) {
	foreach ( $row['year'] as $index => $year ) {
		$cols[$index][] = $year;
	}
}

$classes = classNames( [
	'module',
	'quarterly-data-table',
] );
?>
<section class="<?= $classes ?>">
	<div class="container-fluid page-container">
		<div class="qdt-wrapper">
			<div class="qdt-col qdt-col-labels">
				<div class="qdt-cell qdt-cell-thead">
				</div>
				<?php
				foreach ( $rows as $row ):
					?>
					<div class="qdt-cell">
						<?php echo $row['row_label']; ?>
					</div>
				<?php endforeach; ?>
			</div>
			<div class="swiper swiper-qdt">
				<div class="swiper-wrapper">
					<?php
					foreach ( $cols as $col ):
						?>
						<div class="swiper-slide">
							<div class="qdt-col qdt-col-links">
								<div class="qdt-cell qdt-cell-thead">
									<?php echo( $col[0]['year_label'] ); ?>
								</div>
								<?php
								foreach ( $col as $cells ):
									?>
									<div class="qdt-cell">
										<?php
										if ( $cells['quarter_link'] ):
											foreach ( $cells['quarter_link'] as $index => $link ):
												if ( $link ):
													$quarter = $index + 1;
													$link_url = $link['link'] ? $link['link']['url'] : '';
													$link_title = $link['link'] ? $link['link']['title'] : 'Q' . $quarter;
													$link_target = $link['link'] ? $link['link']['target'] : '_self';
													?>
													<a class="<?php echo $link['link'] ? 'link-active' : 'link-inactive'; ?>"
													   href="<?php echo esc_url( $link_url ); ?>"
													   target="<?php echo esc_attr( $link_target ); ?>"
													>
														<?php echo esc_html( $link_title ); ?>
													</a>
												<?php endif; ?>
											<?php endforeach; ?>
										<?php endif; ?>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
				<div class="swiper-button-prev">
					<?php get_template_part( 'dist/images/arrow-left.svg' ) ?>
				</div>
				<div class="swiper-button-next">
					<?php get_template_part( 'dist/images/arrow-left.svg' ) ?>
				</div>
			</div>
		</div>
	</div>
</section>
