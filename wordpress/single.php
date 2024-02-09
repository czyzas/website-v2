<?php get_header(); ?>

    <main class="subpage">
        <?php
        include(locate_template('partials/top.php'));
        include(locate_template('partials/notes-tool.php'));
        include(locate_template('modules/modules_includer.php'));
        include(locate_template('partials/pages.php'));
        get_sidebar();
        ?>
    </main>

<?php get_footer(); ?>
