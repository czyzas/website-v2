<?php
$hide_quotation_mark = get_sub_field( 'hide_quotation_mark' );
$quotation_content = get_sub_field( 'quotation_content' );
$theme = get_sub_field( 'theme' );
$author_name = get_sub_field( 'author_name' );
$author_occupation = get_sub_field( 'author_occupation' );
$author_photo = get_sub_field( 'author_photo' );
$background_photo = get_sub_field( 'background_photo' );
$content_alignment = get_sub_field( 'content_alignment' );

$classes = classNames( [
	'module',
	'quotation',
	'with-background' => $background_photo,
] );
?>
<section class="<?= $classes ?>">
	<div class="container-fluid">
		<div class="quotation-container"
		     style="<?php echo $background_photo && $content_alignment ? "--content-alignment:$content_alignment;" : '' ?>"
		>
			<?php Quotation( [
				'hide_quotation_mark' => $hide_quotation_mark,
				'quotation_content'   => $quotation_content,
				'theme'               => $theme,
				'author_name'         => $author_name,
				'author_occupation'   => $author_occupation,
				'author_photo'        => $author_photo,
				'classes'             => $classes,
			] ); ?>
			<?php if ( $background_photo ): ?>
				<div class="background-photo">
					<?php echo wp_get_attachment_image( $background_photo['ID'], 'bootstrap-container' ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
