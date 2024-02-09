<?php
$image_position = get_sub_field( 'image_position' );
$image = get_sub_field( 'image' );
$text_column = get_sub_field( 'text_column' );

$classes = classNames( [
	'module',
	'column-with-image',
	"image-position--$image_position",
] );
?>
<section class="<?= $classes ?>">
	<div class="container-fluid grid">
		<div class="text-column">
			<?php echo $text_column; ?>
		</div>
		<div class="image-column">
			<?php echo fh_get_attachment( $image['ID'], 'bootstrap-container' ); ?>
		</div>
	</div>
</section>