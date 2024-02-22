<?php
if ( have_rows( 'modules' ) ): ?>
	<div class="modules">
		<?php
		while ( have_rows( 'modules' ) ) : the_row();
			$template_filename = locate_template( 'modules/' . get_row_layout() . '.php' );
			if ( file_exists( $template_filename ) )
				include( $template_filename );
		endwhile;
		?>
	</div>
<?php
endif;