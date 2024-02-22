<div class="sharing">
	<?php
	/* uncomment library in gulpfile.js and main.scss to enable sharing */
	$share_on = __tr( "udostepnij_w" );
	$data_url = get_permalink();
	$data_title = get_the_title();
	$sharing_arr = [
		'facebook' => [
			'aria-label' => "$share_on Facebook",
		],
		'twitter'  => [
			'aria-label' => "$share_on Twitter",
		],
		'linkedin' => [
			'aria-label' => "$share_on LinkedIn",
		],
	];
	foreach ( $sharing_arr as $type => $sharing_attrs ):
		$attrs = array_merge( [
			'type'        => 'button',
			'data-sharer' => $type,
			'data-url'    => $data_url,
			'data-title'  => $data_title,
		], $sharing_attrs );
		$attrs = convert_attributes_to_string( $attrs );
		?>
		<button <?= $attrs; ?>>
			<?php get_template_part( "dist/images/socials/$type.svg" ); ?>
		</button>
	<?php endforeach; ?>
</div>