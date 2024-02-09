<?php
$title = get_the_title();
$image = get_field( 'image' ) ?: get_field( 'subpage_default_image', FH_OPTIONS_PAGE );
$hide_image = get_field( 'hide_main_image' );

if ( is_404() ) {
	$title = get_field( 'error404_title', FH_OPTIONS_PAGE );
	$image = get_field( 'error404_image', FH_OPTIONS_PAGE );
	$hide_image = false;
}

$classes = classNames( [
	'top',
	'no-image' => $hide_image,
] );
?>

<section class="<?= $classes ?>">
	<div class="container-fluid">
		<div class="top-items">
			<?php include(locate_template('partials/breadcrumbs.php')); ?>
		</div>
		<h1 class="<?php echo get_field( 'smaller_title' ) ? 'smaller' : '' ?>">
			<?php echo $title; ?>
		</h1>
		<?php if ( !$hide_image && $image ): ?>
			<div class="top-image">
				<?php echo wp_get_attachment_image( $image['ID'], 'full', false, [ 'class' => 'img-fluid' ] ); ?>
			</div>
		<?php endif; ?>

		<?php $introduction = get_field( 'introduction' ); ?>
		<?php if ( $introduction ): ?>
			<div class="introduction">
				<p><?php echo $introduction; ?></p>
			</div>
		<?php endif; ?>
	</div>
</section>
