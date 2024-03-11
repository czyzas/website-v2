<?php
$type = get_sub_field( 'type' );
$display_as = get_sub_field( 'display_as' );
$id = get_sub_field( 'id' );
$content = get_sub_field( 'content' );
$custom_color_toggle = get_sub_field( 'custom_color_toggle' );
$custom_color = get_sub_field( 'custom_color' );

$classes = classNames( [
	'module',
	'headline',
	'custom-color' => $custom_color_toggle && $custom_color
] );

$attrs = [];
if ( $custom_color_toggle && $custom_color ) {
	$attrs['style'] = "--custom-color:$custom_color;";
}

if ( $id ) {
	$attrs['id'] = sanitize_title( $id );
}

if ( $display_as != $type ) {
	$attrs['class'] = 'as-'.$display_as;
}
$attrs = convert_attributes_to_string( $attrs );
?>

<section class="<?= $classes; ?>">
	<div class="container-fluid">
		<?php echo "<$type $attrs>$content</$type>" ?>
	</div>
</section>
