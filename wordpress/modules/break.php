<?php
$is_line = get_sub_field( 'is_line' );
$classes = classNames( [
	'module',
	'break',
	'with-line' => $is_line,
] );
?>
<section class="<?= $classes ?>">
	<div class="col" style="height: <?php echo get_sub_field( 'height' ) ?>px">
	</div>
</section>
