<?php get_header(); ?>

<main class="subpage">
    <?php
    include(locate_template('partials/top.php'));
    include(locate_template('modules/modules_includer.php'));
    include(locate_template('partials/pages.php'));
    ?>
</main>

<?php get_footer(); ?>
