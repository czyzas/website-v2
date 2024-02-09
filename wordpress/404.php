<?php get_header(); ?>

<main class="subpage error-404">
	<section>
		<div class="container-fluid error-404-content">
			<h1><?php echo get_options_field( 'error404_headline' ); ?></h1>
			<p><?php echo get_options_field( 'error404_text' ); ?></p>
			<?php
			$link = get_options_field( 'error404_link' );
			echo fh_acf_link( $link, [
				'icon'          => 'arrow-left',
				'icon_position' => 'start',
			] );
			?>
		</div>
	</section>
</main>

<?php get_footer(); ?>
