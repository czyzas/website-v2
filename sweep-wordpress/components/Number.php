<?php
/**
 * Renders Number component
 *
 * Accepting props such as:
 * * icon: string | array - HTML element (img or svg) of an icon or array
 * * value: string - just number
 * * caption: string - text under/next to value
 * * units: {unit: string}[] - (max 2) units next to value
 * * row:boolean - decide if caption should be in one row with icon (default to `false`)
 * * theme: 'dark' | 'light' - determines the color of text (defaults to `'dark'`)
 * * text_size: 'normal' | 'small' - component text size
 * * classes - string or array, everything classNames functions accepts
 * @param array $props
 * @return void
 */
function Number( array $props = [] ) {
	$icon = $props['icon'] ?? null;
	$value = $props['value'] ?? '';
	$caption = $props['caption'] ?? '';
	$units = $props['units'] ?? [];
	$row = $props['row'] ?? false;
	$theme = $props['theme'] ?? 'dark';
	$text_size = $props['text_size'] ?? 'normal';

	$classes = $props['classes'] ?? [];
	$classes = classNames( [
		'number-component',
		"theme-$theme",
		"text-size--$text_size",
		'direction-row' => $row,
		'with-icon'     => $icon,
		'with-units'    => !empty( $units ),
		'with-value'    => $value,
	], $classes );
	?>

	<div class="<?php echo $classes ?>">
		<div class="value-wrapper">
			<?php if ( $icon ): ?>
				<div class="icon">
					<?php
					if ( is_int( $icon ) ) $icon = [ 'ID' => $icon ];
					echo is_array( $icon ) ? wp_get_attachment_image( $icon['ID'], 'mobile-xs' ) : $icon;
					?>
				</div>
			<?php endif; ?>
			<?php if ( $value ): ?>
				<div class="value"><?php echo $value; ?></div>
			<?php endif; ?>
			<?php if ( !empty( $units ) ): ?>
				<div class="units">
					<?php foreach ( $units as $unit ): $unit = $unit['unit'] ?? $unit; ?>
						<?php if ( $unit ): ?>
							<span class="unit"><?php echo $unit; ?></span>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<div class="caption"><?php echo $caption; ?></div>
	</div>
	<?php
}