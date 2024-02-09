<?php
$desktop_image = get_sub_field( 'desktop_image' );
$desktop_image_contrast = get_sub_field( 'desktop_image_contrast' );
$desktop_width = get_sub_field( 'desktop_width' );
$desktop_width = $desktop_width ? "${desktop_width}px" : "auto";
$mobile_image = get_sub_field( 'mobile_image' ) ?: $desktop_image;
$mobile_image_contrast = get_sub_field( 'mobile_image_contrast' );
$mobile_width = get_sub_field( 'mobile_width' );
$mobile_width = $mobile_width ? "${mobile_width}px" : "auto";
$zoomable = get_sub_field( 'zoomable' );

$classes = classNames( [
	'module',
	'responsive-image',
] );
?>

<section class="<?= $classes ?>">
	<div class="container-fluid">
		<div class="<?= classNames( 'image-container', [ 'zoomable' => $zoomable ] ) ?>">
			<?php if ( $desktop_image ): ?>
				<div class="desktop-image" style="--width: <?php echo $desktop_width; ?>;">
					<?php echo wp_get_attachment_image(
						$desktop_image['ID'],
						'bootstrap-container',
						null,
						[ 'class' => classNames( [ 'hide-on-contrast' => $desktop_image_contrast ] ) ]
					); ?>
					<?php if ( $desktop_image_contrast ): ?>
						<?php echo wp_get_attachment_image(
							$desktop_image_contrast['ID'],
							'bootstrap-container',
							null,
							[ 'class' => classNames( 'show-on-contrast' ) ]
						); ?>
					<?php endif; ?>
				</div>
			<?php endif; ?>
			<?php if ( $mobile_image ): ?>
				<div class="mobile-image" style="--width: <?php echo $mobile_width; ?>;">
					<?php echo wp_get_attachment_image(
						$mobile_image['ID'],
						'bootstrap-container',
						null,
						[ 'class' => classNames( [ 'hide-on-contrast' => $mobile_image_contrast ] ) ]
					); ?>
					<?php if ( $mobile_image_contrast ): ?>
						<?php echo wp_get_attachment_image(
							$mobile_image_contrast['ID'],
							'bootstrap-container',
							null,
							[ 'class' => classNames( 'show-on-contrast' ) ]
						); ?>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php if ( $desktop_image ): ?>
				<div class="popup-image">
					<?php echo wp_get_attachment_image(
						$desktop_image['ID'],
						'full',
						null,
						[ 'class' => classNames( [ 'hide-on-contrast' => $desktop_image_contrast ] ) ]
					); ?>
					<?php if ( $desktop_image_contrast ): ?>
						<?php echo wp_get_attachment_image(
							$desktop_image_contrast['ID'],
							'full',
							null,
							[ 'class' => classNames( 'show-on-contrast' ) ]
						); ?>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
