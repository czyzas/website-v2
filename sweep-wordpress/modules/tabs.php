<?php
$tabs = get_sub_field( 'tabs' );
$orientation = get_sub_field( 'orientation' );
$tabs_instance = new Tabs( $tabs );

$classes = classNames( [
	'module',
	'tabs',
	"orientation-$orientation"
] );
?>
<section class="<?= $classes ?>">
	<div class="container-fluid">
		<?php
		$tabs_instance->set_tab_nav_item( fn( $tab ) => $tab['title'] );
		$tabs_instance->set_attributes(
			TABS_ELEMENT::TAB_PANE,
			function ( $tab ) use ( $orientation ) {
				$second_column_type = $tab['second_column_type'] ?? 'none';
				$image_column_position = $tab['image_column_position'] ?? 'right';
				$image_vertical_position = $tab['image_vertical_position'] ?? 'top';

				$position = $orientation === 'horizontal' ? $image_column_position : $image_vertical_position;
				if ( $orientation === 'horizontal' && $second_column_type !== 'image' ) $position = false;

				return [
					'class' => [
						"image-position--" . $position => $position,
					]
				];
			} );
		$tabs_instance->set_tab_content( function ( $tab ) use ( $orientation ) {
			$image = $tab['image'] ?? null;
			$second_column_type = $tab['second_column_type'] ?? 'none';
			$content = $tab['content'] ?? '';
			$second_column_content = $tab['second_column_content'] ?? '';
			?>
			<?php if ( $image && (
					( $orientation === 'horizontal' && $second_column_type === 'image' )
					|| $orientation === 'vertical'
				)
			): ?>
				<div class="column column-image">
					<?php echo wp_get_attachment_image( $image['ID'], 'bootstrap-container' ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $content ): ?>
				<div class="column column-content"><?= $content ?></div>
			<?php endif; ?>
			<?php if ( $second_column_content && ( $orientation === 'horizontal' && $second_column_type === 'wysiwyg' ) ): ?>
				<div class="column column-content"><?= $second_column_content ?></div>
			<?php endif; ?>
			<?php
		} );
		$tabs_instance->render();
		?>
	</div>
</section>
