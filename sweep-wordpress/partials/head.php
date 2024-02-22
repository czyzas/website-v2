<?php
$site_name = get_bloginfo();
$title_separator = '-';
$current_page_title = get_the_title();

if ( is_front_page() ) {
	$current_page_title = $site_name;
} else {
	$current_page_title = fh_get_current_page_title();

	$current_page_title = implode( " ", [
		$current_page_title,
		$title_separator,
		$site_name,
	] );
}
?>
<head>
	<?php insert_tracking_code( TrackingCodePositions::HEAD_TOP ); ?>
	<meta charset="utf-8">
	<title><?php echo $current_page_title; ?></title>
	<?php if ( !get_post_meta( get_the_ID(), '_yoast_wpseo_metadesc', true ) ): ?>
		<meta name="description" content="<?php bloginfo( 'description' ); ?>" />
	<?php endif; ?>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="simple-title" content="<?php echo is_front_page() ? $site_name : fh_get_current_page_title(); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<?php wp_head(); ?>
	<?php insert_tracking_code( TrackingCodePositions::HEAD_BOTTOM ); ?>
</head>