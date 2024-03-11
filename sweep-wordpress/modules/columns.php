<?php
$counter = get_sub_field( 'columns_counter' );
$classes = classNames( [
	'module',
	'columns',
] );
?>
<section class="<?= $classes ?>">
	<div class="container-fluid">
		<div class="row">
			<?php if ( $counter === 'one' ): ?>
				<div class="col-12">
					<?php echo get_sub_field( 'content' )['first'] ?>
				</div>
			<?php endif; ?>

			<?php
			if ( $counter === 'two' ):
				$column_width = get_sub_field( 'column_width' );
				$classes1 = 'col-12 col-md-6';
				$classes2 = 'col-12 col-md-6';

				if ( $column_width === 'left' ) {
					$classes1 = 'col-12 col-md-4';
					$classes2 = 'col-12 col-md-8';
				}

				if ( $column_width === 'right' ) {
					$classes1 = 'col-12 col-md-8';
					$classes2 = 'col-12 col-md-4';
				}
				?>
				<div class="<?php echo $classes1; ?>">
					<?php echo get_sub_field( 'content' )['first'] ?>
				</div>
				<div class="<?php echo $classes2; ?>">
					<?php echo get_sub_field( 'content' )['second'] ?>
				</div>
			<?php endif; ?>

			<?php if ( $counter === 'three' ): ?>
				<div class="col-12 col-md-4">
					<?php echo get_sub_field( 'content' )['first'] ?>
				</div>
				<div class="col-12 col-md-4">
					<?php echo get_sub_field( 'content' )['second'] ?>
				</div>
				<div class="col-12 col-md-4">
					<?php echo get_sub_field( 'content' )['third'] ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
