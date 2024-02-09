<?php $table_id = isset( $args['id'] ) ? intval( $args['id'] ) : null; ?>
<?php if ( $table_id ): ?>
	<div class="table-container">
		<div class="table-tools">
			<?php
			$file = get_field( 'xls_file', $table_id );
			if ( $file ): ?>
				<a href="<?php echo $file['url']; ?>"
				   class="download-table"
				   download
				   aria-label="<?php echo __tr( 'eksport_do_excela' ); ?>"
				>
					<span><?php echo __tr( 'eksport_do_excela' ); ?></span>
				</a>
			<?php endif;
			if ( get_field( 'zoomable', $table_id ) ): ?>
				<a href="#" class="enlarge-table" aria-label="<?php echo __tr( 'powieksz' ); ?>">
					<span><?php echo __tr( 'powieksz' ); ?></span>
					<?php fh_svg('zoom'); ?>
				</a>
			<?php endif; ?>
		</div>
		<h2 class="title"><?php the_field( 'table_title', $table_id ); ?></h2>
		<div class="table-wrapper">
			<?php echo apply_filters( 'the_content', make_clickable( get_post_field( 'post_content', $table_id ) ) ); ?>
		</div>
		<?php if ( get_field( 'caption', $table_id ) ): ?>
			<div class="caption">
				<?php the_field( 'caption', $table_id ); ?>
			</div>
		<?php endif; ?>
	</div>
	<?php if ( is_user_logged_in() ): ?>
		<div>
			<a href='/wp-admin/post.php?post=<?php echo $table_id; ?>&action=edit'
			   target="_blank"
			>EDYTUJ</a>
		</div>
	<?php endif; ?>
<?php endif; ?>
