<?php
$socials = get_options_field( 'socials' );
if ( $socials ):
	?>
	<ul class="socials">
		<?php foreach ( $socials as $item ): $link = $item['link']; ?>
			<li>
				<?php $title = $link['title']; ?>
				<a href="<?php echo $link['url']; ?>"
				   target="_blank"
				   rel="nofollow noopener noreferrer"
				   aria-label="<?= $title ?>"
				><?php get_template_part( "dist/images/$title.svg" ) ?></a>
			</li>
		<?php endforeach; ?>
	</ul>
<?php endif; ?>