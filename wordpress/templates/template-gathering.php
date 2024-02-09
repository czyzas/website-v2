<?php
/*
	Template name: Walne zgromadzenie
*/

?>
<?php get_header(); ?>
<main class="subpage gatherings">
    <?php
    include( locate_template( 'partials/top.php' ) );
    ?>
    <section class="gatherings-container margin-bottom">
        <div class="container-fluid page-container">

            <div class="row">
                <div class="col-12 filter-wrapper">
                    <p class="filter-title"><?php echo __tr('walne_zgromadzenia'); ?></p>
                    <div class="filter">
                        <?php
                        $firstYear = 0;
                        if (have_rows('lata')):
                            while (have_rows('lata')) : the_row();
                                ?>
                                <a href="#" class="<?php echo $firstYear === 0 ? 'active' : '' ?>" data-year="<?php echo get_sub_field('rok'); ?>">
                                    <?php echo get_sub_field('rok'); ?>
                                </a>
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
            if (have_rows('lata')): ?>
                <div class="row">
                    <?php while (have_rows('lata')) : the_row(); ?>
                        <div class="col-12 gatherings <?php echo get_sub_field('rok') === $firstYear ? 'active' : '' ?>"
                             data-year="<?php echo get_sub_field('rok') ?>"
                        >

                            <?php $counter = 1;
                            while (have_rows('wydarzenia')): the_row(); ?>
                                <div class="single-gathering">
                                    <div class="row no-gutters">
                                        <div class="col-12">
                                            <p class="title"><?php the_sub_field('nazwa') ?></p>
                                        </div>
                                        <div class="col-12 col-lg-6">
                                            <div class="detailed-info">
                                                <?php if (get_sub_field('rodzaj')): ?>
                                                    <div class="row no-gutters">
                                                        <div class="col-6 col-md-3">
                                                            <?php echo __tr('rodzaj'); ?>
                                                        </div>
                                                        <div class="col-6 col-md-9"><?php the_sub_field('rodzaj') ?></div>
                                                    </div>
                                                <?php endif; ?>
                                                <?php if (get_sub_field('data')): ?>
                                                    <div class="row no-gutters">
                                                        <div class="col-6 col-md-3">
                                                            <?php echo __tr('data'); ?>
                                                        </div>
                                                        <div class="col-6 col-md-9">
                                                            <?php the_sub_field('data') ?>
                                                        </div>
                                                    </div>
                                                <?php endif; ?>
                                                <?php if (get_sub_field('godzina')): ?>
                                                    <div class="row no-gutters">
                                                        <div class="col-6 col-md-3">
                                                            <?php echo __tr('godzina'); ?>
                                                        </div>
                                                        <div class="col-6 col-md-9">
                                                            <?php the_sub_field('godzina') ?>
                                                        </div>
                                                    </div>
                                                <?php endif; ?>
                                                <?php if (get_sub_field('lokalizacja')): ?>
                                                    <div class="row no-gutters">
                                                        <div class="col-6 col-md-3">
                                                            <?php echo __tr('lokalizacja'); ?>
                                                        </div>
                                                        <div class="col-6 col-md-9">
                                                            <?php the_sub_field('lokalizacja') ?>
                                                        </div>
                                                    </div>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                        <div class="col-12 col-lg-6">
                                            <div class="download">
                                                <p class="files-to-download-title"><?php echo __tr('pliki_do_pobrania'); ?></p>
                                                <?php if (have_rows('pliki')) : ?>
                                                    <div class="files-to-download">
                                                        <ul class="">
                                                            <?php while (have_rows('pliki')): the_row(); ?>
                                                                <?php $file = get_sub_field('plik'); ?>
                                                                <li>
                                                                    <a download
                                                                       href="<?php echo $file['url'] ?>"
                                                                    >
                                                                        <div class="image">
                                                                            <?php get_template_part('dist/images/icon-download.svg'); ?>
                                                                        </div>
                                                                        <span>
                                                                            <?php echo get_sub_field('nazwa') ? get_sub_field('nazwa') : $file['name'] ?>
                                                                        </span>
                                                                    </a>
                                                                </li>
                                                            <?php endwhile; ?>
                                                        </ul>
                                                    </div>

                                                <?php else: ?>
                                                    <p><?php echo __tr('pliki_do_pobrania_brak'); ?></p>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                        <?php if (get_sub_field('opis')): ?>
                                            <div class="col-12">
                                                <div class="description">
                                                    <?php the_sub_field('opis'); ?>
                                                </div>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endwhile; ?>
                        </div>
                    <?php endwhile; ?>
                </div>
            <?php endif; ?>

        </div>
    </section>

    <?php include(locate_template('partials/pages.php'));	 ?>
</main>

<?php get_footer(); ?>
