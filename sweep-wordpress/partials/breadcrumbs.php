<?php
$bc_title = fh_get_current_page_title();
$bc_home_text = get_field( 'breadcrumbs_text', FH_OPTIONS_PAGE ) ?: get_bloginfo();

if ( is_404() ) {
	$bc_title = get_field( 'error404_title', FH_OPTIONS_PAGE );
}

global $post;
$current_post_parent_id = $post->post_parent ?? 0;
$current_post_type = $post->post_type ?? 'post';
$cursor = $current_post_parent_id;

$list_id = null;
$list = get_field( "${current_post_type}_posts_list", FH_OPTIONS_PAGE );
if (!is_404()) {
	$list_id = is_single( $post->ID ) && $list && $list->ID ? $list->ID : null;
}

if ( !$cursor && $list_id ) {
	$cursor = $list_id;
}

$breadcrumbs = [];
while ( $cursor ) {
	$cursor_obj = get_post( $cursor );
	$cursor_parent_id = $cursor_obj->post_parent;
	$breadcrumbs[] = $cursor;

	if ( !$cursor_parent_id && $list_id && !in_array( $list_id, $breadcrumbs ) ) {
		$cursor_parent_id = $list_id;
	}

	$cursor = $cursor_parent_id;
}

$breadcrumbs = array_reverse( $breadcrumbs );
?>
<div class="breadcrumbs">
	<ul class="breadcrumbs-list">
		<li><a href="<?php echo fh_homepage_url( '/' ); ?>"><?php echo $bc_home_text ?></a></li>
		<li aria-hidden="true"><?php get_template_part( 'dist/images/breadcrumbs.svg' ); ?></li>
		<?php foreach ( $breadcrumbs as $crumb_index => $crumb_ID ): ?>
			<li>
				<a href="<?php echo get_the_permalink( $crumb_ID ) ?>"><?php echo get_the_title( $crumb_ID ) ?></a>
			</li>
			<li aria-hidden="true"><?php get_template_part( 'dist/images/breadcrumbs.svg' ); ?></li>
		<?php endforeach; ?>
		<li><span><?php echo $bc_title; ?></span></li>
	</ul>
</div>