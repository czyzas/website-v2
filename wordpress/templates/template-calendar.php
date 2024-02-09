<?php
/*
	Template name: Kalendarz
*/

?>
<?php get_header(); ?>
<main class="subpage calendars">
    <?php
    include(locate_template('partials/top.php'));
    ?>
    <section class="calendar margin-bottom">
        <div class="container-fluid page-container">

            <div class="row">
                <div class="col-12 filter-wrapper">
                    <p class="filter-title"><?php echo __tr('kalendarz'); ?></p>
                    <div class="filter">
                        <?php
                        $firstYear = 0;
                        if (have_rows('lata')):
                            while (have_rows('lata')) : the_row();
                        ?>
                            <a href="#" class="<?php echo $firstYear === 0 ? 'active' : '' ?> " data-year="<?php echo get_sub_field('rok'); ?>"><?php echo get_sub_field('rok'); ?></a>
                        <?php
                            if ($firstYear === 0)
                                $firstYear = get_sub_field('rok');
                            endwhile;
                        endif;
                        ?>
                    </div>
                </div>
            </div>

            <?php
            if (have_rows('lata')):
                while (have_rows('lata')) : the_row();
            ?>
                <div class="row year-container <?php echo get_sub_field('rok') === $firstYear ? 'active' : '' ?>" data-year="<?php echo get_sub_field('rok') ?>">
                    <div class="col-12">
                        <div class="row no-gutters">
                            <?php
                            while (have_rows('wydarzenia')): the_row();
                            ?>
                                <div class="col-12 col-lg-3 col-single-event">
                                    <div class="single-event">
                                        <div class="date">
                                            <?php echo str_replace('/', ' / ', get_sub_field('data')) ?>
                                        </div>
                                        <p class="title"><?php the_sub_field('nazwa') ?></p>
                                        <div class="description">
                                            <?php the_sub_field('opis') ?>
                                        </div>
                                        <div class="buttons">
                                            <?php
                                            $link = get_sub_field('link');
                                            if( $link ):
                                                $link_url = $link['url'];
                                                $link_target = $link['target'] ? $link['target'] : '_self';
                                                ?>
                                                <a class="more" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
                                                    <?php echo __tr('zobacz_wiecej'); ?>
                                                </a>
                                            <?php endif; ?>

                                            <button class="button white save-in-outlook"
                                               data-date="<?php the_sub_field('data') ?>"
                                               data-name="<?php the_sub_field('nazwa') ?>"
                                               data-description="<?php the_sub_field('opis') ?>"
                                            >
                                                <?php get_template_part('dist/images/outlook.svg'); ?>
                                                <span class="label">
                                                    <?php echo __tr('zapisz_w_outlook'); ?>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            <?php
                            endwhile;
                            ?>
                        </div>
                    </div>
                </div>

            <?php
                endwhile;
            endif;
            ?>

        </div>
    </section>

	<?php include(locate_template('partials/pages.php'));	 ?>
</main>

<?php get_footer(); ?>
