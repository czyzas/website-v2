<?php
$scroll_to = get_sub_field( 'scroll_to' );
$rows = get_sub_field( 'rows' );
$open_first = get_sub_field( 'open_first' );

$classes = classNames( [
	'module',
	'accordion',
	'scroll-animation' => $scroll_to,
	'open-first'       => $open_first,
] );

$accordion_instance = new Accordion( $rows );
if ( $open_first ) {
	$accordion_instance->open_first();
}
?>

<?php if ( $rows ): ?>
	<section class="<?= $classes ?>">
		<div class="container-fluid">
			<?php
			$accordion_instance->set_row_trigger( function ( $row ) {
				?>
				<?php echo $row['title']; ?>
				<span class="sign"><?php get_template_part( 'dist/images/chevron-down.svg' ) ?></span>
				<?php
			} );

			// For `trigger` and `content` keys you can use function instead of array
			// to get current row data when setting attributes
			$accordion_instance->set_attributes(
				ACCORDION_ELEMENT::CONTENT,
				fn( $row ) => [
					'class' => "image-position--" . ( $row['image_column_position'] ?? 'right' )
				]
			);
			$accordion_instance->set_row_content( function ( $row ) {
				$second_column_type = $row['second_column_type'];
				?>
				<?php if ( $row['content'] ): ?>
					<div class="column column-content"><?php echo $row['content']; ?></div>
				<?php endif; ?>
				<?php if ( $second_column_type === 'wysiwyg' ): ?>
					<div class="column column-content"><?php echo $row['second_column_content']; ?></div>
				<?php elseif ( $second_column_type === 'image' && $row['image'] ): ?>
					<?php $position = $row['image_column_position'] ?? 'right'; ?>
					<div class="column column-image column-image--<?= $position ?>">
						<?php echo wp_get_attachment_image( $row['image']['ID'], 'bootstrap-container' ); ?>
					</div>
				<?php endif; ?>
				<?php
			} );
			$accordion_instance->render();
			?>
		</div>
	</section>
<?php endif; ?>
