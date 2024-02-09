<?php
$numbers = get_sub_field( 'numbers' );
$text_smaller = get_sub_field( 'text_smaller' );
$row = get_sub_field( 'row' );
$alignment = get_sub_field( 'alignment' );
$background_photo = get_sub_field( 'background_photo' );
$theme = get_sub_field( 'theme' );

$props = [
	'text_size' => $text_smaller ? 'small' : 'normal',
	'row'       => $row,
	'theme'     => $theme,
	'classes'   => [
		'with-background' => $background_photo
	],
];

$numbers = array_map( function ( $number ) use ( $props ) {
	return array_merge( $number, $props );
}, $numbers );

$classes = classNames( [
	'module',
	'big-numbers',
	'margin-bottom',
	"alignment--$alignment",
	'text-smaller'    => $text_smaller,
	'with-background' => $background_photo,
] );

?>
<?php if ( $numbers ): ?>
	<section class="<?= $classes ?>">
		<div class="container-fluid">
			<div class="relative-wrapper">
				<div class="big-numbers-container">
					<?php
					foreach ( $numbers as $number ) {
						Number( $number );
					}
					?>
				</div>
				<?php if ( $background_photo ): ?>
					<div class="background-photo">
						<?php echo wp_get_attachment_image( $background_photo['ID'], 'bootstrap-container', false, [ 'class' => 'img-fluid' ] ); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>
<?php endif; ?>