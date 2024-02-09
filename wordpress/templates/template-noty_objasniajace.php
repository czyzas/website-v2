<?php
/*
	Template name: Noty objaśniające
*/
?>

<?php get_header(); ?>

<main class="subpage">

	<?php
	include(locate_template('partials/top.php'));
	include(locate_template('partials/notes-tool.php'));
	?>

	<section class="module clarifying-notes">
		<div class="container-fluid">
			<?php
			$args = array(
				'parent' => 0,
				'taxonomy' => 'note_category',
				'orderby' => 'post_date',
				'order' => 'ASC'
			);
			$categories = get_categories( $args );

			function showClarifyingNote($category, $parentNote, $level = 0){
				$termArg = array();
				if($category != 0){
					$termArg = array(
						array(
							'taxonomy' => 'note_category',
							'field' => 'term_id',
							'terms' => $category
						)
					);
				}
				$args=array(
					'post_type' => 'noty_objasniajace',
					'post_status' => 'publish',
					'posts_per_page' => -1,
					'post_parent' => $parentNote,
					'tax_query' => $termArg,
					'order_by' => 'date',
					'order' => 'asc',
				);

				$spaces = "";
				for($i = 0; $i<$level; $i++){
					$spaces .= "&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				$posts = get_posts($args);
				foreach($posts as $post){
					echo '<div class="note-parent"><p>' . $spaces . '<a href="'.get_permalink($post->ID).'">'. $post->post_title.'</a></p>';
					$children = get_posts(
						array(
							'post_parent='.$post->ID,
							'post_type' => 'noty_objasniajace',
							'post_status' => 'publish',
						)
					);
					if( count( $children ) != 0 ) {
						showClarifyingNote(0, $post->ID, $level+1);
					}
					echo '</div>';
				}
			}

			foreach ( $categories as $category ) {
				echo "<div class='note-category-name'><h3 class='note-header' id='".$category->term_id."'>";
				echo $category->name . '<br/>';
				echo "</h3></div>";

				showClarifyingNote($category->term_id, 0);
			}

			?>
		</div>
	</section>

	<?php
	include(locate_template('partials/pages.php'));
	get_sidebar();
	?>

</main>

<?php get_footer(); ?>
