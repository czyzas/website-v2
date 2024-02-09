<?php
$links = get_options_field( 'footer_links' );
$content = get_options_field( 'footer_content' );
$legal_note = get_options_field( 'footer_legal_note' );
?>
<footer class="footer">
	<section class="footer-top">
		<div class="container-fluid">
			<div class="column-content">
				<a class="site-logo" href="<?php echo fh_homepage_url( '/' ); ?>">
					<img src="<?php echo get_template_directory_uri() . '/dist/images/logo.svg' ?>"
					     alt="<?php echo get_bloginfo() ?>"
					>
				</a>
				<?php if ( $content ): ?>
					<div class="content"><?php echo $content; ?></div>
				<?php endif; ?>
				<?php get_template_part( 'partials/previous-reports' ); ?>
			</div>

			<div class="column-menu">
				<?php
				wp_nav_menu( array(
					'depth'           => 10,
					'container'       => 'nav',
					'container_class' => 'footer-menu-container',
					'container_id'    => 'footer-menu-container',
					'menu_class'      => 'footer-menu',
					'menu_id'         => 'footer-menu',
					'theme_location'  => 'footer-menu',
					'walker'          => new WP_Bootstrap_Navwalker(),
					'items_wrap'      => '<ul id="%1$s" class="%2$s" data-level="1">%3$s</ul>'
				) );
				?>
			</div>
		</div>
	</section>
	<section class="footer-bottom">
		<div class="container-fluid">
			<div class="column-content">
				<?php if ( $legal_note ): ?>
					<p class="legal-note"><?= $legal_note ?></p>
				<?php endif; ?>
			</div>
			<?php if ( $links ): ?>
				<div class="column-menu">
					<ul class="additional-links">
						<?php foreach ( $links as $item ): $link = $item['link'] ?>
							<?php if ( $link ): ?>
								<li><?php echo fh_acf_link( $link ); ?></li>
							<?php endif; ?>
						<?php endforeach; ?>
					</ul>
				</div>
			<?php endif; ?>

			<div class="column-socials">
				<?php get_template_part( 'partials/socials' ); ?>
			</div>
		</div>
	</section>
</footer>

<?php get_template_part( 'partials/search-modal' ); ?>

<?php get_template_part( 'partials/cookies' ); ?>

<?php get_template_part( 'partials/admin-bar' ); ?>

<?php wp_footer(); ?>

<?php insert_tracking_code( TrackingCodePositions::BODY_BOTTOM ); ?>
</body>
</html>
