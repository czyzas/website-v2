<?php
$previous_page_post_id = get_field( 'previous_page' );
$next_page_post_id = get_field( 'next_page' );
$post_type = get_post_type();

if ( $post_type === 'noty_objasniajace' ) {
	$next_post = get_next_post();
	$previous_post = get_previous_post();

	if ( empty( $previous_page_post_id ) && $previous_post ) {
		$previous_page_post_id = $previous_post->ID;
	}

	if ( empty( $next_page_post_id ) && $next_post ) {
		$next_page_post_id = $next_post->ID;
	}
}

if ( $previous_page_post_id || $next_page_post_id ): ?>
	<section class="pages">
		<div class="container-fluid">
			<div class="pages-wrapper">
				<?php if ( $previous_page_post_id ): ?>
					<div class="page-item page-left">
						<a href="<?php the_permalink( $previous_page_post_id ) ?>">
							<div class="arrow-container">
								<?php get_template_part( 'dist/images/arrow-left.svg' ) ?>
							</div>
							<div class="details">
								<div class="title"><?php echo get_the_title( $previous_page_post_id ); ?></div>
							</div>
						</a>
					</div>
				<?php endif; ?>
				<?php if ( $next_page_post_id ): ?>
					<div class="page-item page-right">
						<a href="<?php the_permalink( $next_page_post_id ) ?>">
							<div class="details">
								<div class="title"><?php echo get_the_title( $next_page_post_id ); ?></div>
								<div class="introduction"><?php echo get_field( 'introduction' ); ?></div>
							</div>
							<div class="arrow-container">
								<?php get_template_part( 'dist/images/arrow-left.svg' ) ?>
							</div>
						</a>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>
