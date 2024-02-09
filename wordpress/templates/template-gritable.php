<?php
/*
	Template name: Tabela GRI
*/
?>

<?php get_header(); ?>
<?php get_sidebar(); ?>

<main class="subpage gri-index">
	<?php include(locate_template('partials/top.php')); ?>


    <div class="gri-panel modules">
        <div class="container">
			<?php
			$args = array(
				'post_type' => 'gri_indicator',
				'post_status' => 'publish',
				'posts_per_page' => -1
			);
			$indicators = get_posts($args);
			?>
            <div class="col-xs-12">
                <div class="bar">
                    <input id="search-gri" type="text" placeholder="Szukaj..."/>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <ul class="gri-indicators">

                            <?php
                            $halfcount = count($indicators) / 2;
                            $i = 0;
                            foreach($indicators as $indicator) { ?>
                                <li>
                                    <a href="#"><?php echo $indicator->post_title; ?></a>
                                    <?php
                                    $gri_post_id = $indicator->ID;
                                    $gri_id = get_field('id', $gri_post_id);
                                    if( have_rows('list_of_pages', $gri_post_id) ): ?>
                                        <ul>
                                            <?php while ( have_rows('list_of_pages', $gri_post_id) ) : the_row();
                                                $page_id = get_sub_field('page', false, false);
                                                $href = get_the_permalink($page_id).'#'.$gri_id;
                                                $title = get_the_title($page_id); ?>
                                                <li><a href="<?php echo $href; ?>"><?php echo $title; ?></a></li>
                                            <?php endwhile; ?>
                                        </ul>
                                    <?php endif; ?>
                                </li>

                            <?php
                                $i++;
                            }
                            ?>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
	                    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		                    <?php the_content(); ?>
	                    <?php endwhile; else: ?>
                            <p><?php _e('Sorry, this page does not exist.'); ?></p>
	                    <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
