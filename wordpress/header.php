<!DOCTYPE html>
<html lang="<?php echo FH_LANGUAGE; ?>">
	<?php get_template_part('partials/head') ?>
	<body <?php body_class(); ?>>
	<?php insert_tracking_code( TrackingCodePositions::BODY_TOP ); ?>
	<header class="header">
		<div class="container-fluid page-container">
			<div class="site-details">
				<a class="site-logo" href="<?php echo fh_homepage_url( '/' ); ?>">
					<img src="<?php echo get_template_directory_uri() . '/dist/images/logo.svg' ?>"
					     alt="<?php echo get_bloginfo() ?>"
					>
				</a>
				<div class="site-title"><?php the_field( 'site_title', FH_OPTIONS_PAGE ); ?></div>
			</div>

			<div class="site-tools">
				<?php get_template_part( 'partials/header-tools/contrast' ); ?>
				<?php get_template_part( 'partials/header-tools/language-switcher' ); ?>
				<?php get_template_part( 'partials/header-tools/font-size-switcher' ); ?>
				<?php get_template_part( 'partials/header-tools/search' ); ?>
				<?php get_template_part( 'partials/header-tools/menu-hamburger' ); ?>
			</div>
		</div>

		<div class="menu-overlay">
			<?php
			wp_nav_menu( array(
				'depth'           => 10, // 1 = no dropdowns, 2 = with dropdowns.
				'container'       => 'nav',
				'container_class' => 'header-main-menu-container',
				'container_id'    => 'header-main-menu-container',
				'menu_class'      => 'header-main-menu',
				'menu_id'         => 'header-main-menu',
				'theme_location'  => 'primary-menu',
				'walker'          => new WP_Bootstrap_Navwalker(),
				'items_wrap'      => '<ul id="%1$s" class="%2$s" data-level="1">%3$s</ul>'
			) );
			?>
		</div>
	</header>