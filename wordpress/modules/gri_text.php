<?php
$gri_list = get_sub_field( 'gri_list' );
$classes = classNames( [
	'module',
	'gri-text',
] );

if ( !isset( $gri_count ) ) {
	$gri_count = 0;
}
?>

<section class="<?= $classes ?>">
	<div class="container-fluid">
		<ul class="gri-list">
			<?php if ( $gri_list ) : ?>
				<?php foreach ( $gri_list as $item ) : ?>
					<li>
						<div id="index-<?php echo sanitize_title( $item['index'] ) . '-' . $gri_count; ?>"
						     class="default-tooltipster"
						     title="<?php echo $item['description'] ?>"
						>
							<?php echo $item['index'] ?>
						</div>
					</li>
					<?php $gri_count++; ?>
				<?php endforeach; ?>
			<?php endif; ?>
		</ul>
	</div>
</section>
