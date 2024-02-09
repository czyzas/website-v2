<?php

/**
 * Renders Quotation component
 *
 * Accepting props such as:
 * * hide_quotation_mark - determines if quotation mark should be visible
 * * quotation_content - the content passed to `<blockquote>`
 * * theme - can be light or dark - determines the color of text
 * * author_name - authors name
 * * author_occupation - more info about author
 * * author_photo - ACF field, must have valid ID field inside
 * * classes - string or array, everything classNames functions accepts
 * @param array $props
 * @return void
 */

function Quotation( array $props = [] ) {
	$hide_quotation_mark = $props['hide_quotation_mark'] ?? false;
	$quotation_content = $props['quotation_content'] ?? '';
	$theme = $props['theme'] ?? 'dark';
	$author_name = $props['author_name'] ?? '';
	$author_occupation = $props['author_occupation'] ?? '';
	$author_photo = $props['author_photo'] ?? null;
	$classes = $props['classes'] ?? [];

	$classes = classNames( [
		'quotation-component',
		"theme-$theme",
		'hide-quotation-mark' => $hide_quotation_mark,
	], $classes );
	?>
	<div class="<?php echo $classes ?>">
		<?php if ( !$hide_quotation_mark ): ?>
			<div class="quotation-mark"><?php get_template_part( 'dist/images/quote-mark.svg' ) ?></div>
		<?php endif; ?>
		<div class="quotation-content">
			<blockquote><?php echo $quotation_content; ?></blockquote>
			<?php if ( $author_photo || $author_name || $author_occupation ): ?>
				<div class="author">
					<?php if ( $author_photo ): ?>
						<div class="author-photo">
							<?php echo wp_get_attachment_image( $author_photo['ID'], 'mobile-xs' ); ?>
						</div>
					<?php endif; ?>
					<div class="author-details">
						<?php if ( $author_name ): ?>
							<strong class="author-name"><?php echo $author_name; ?></strong>
						<?php endif; ?>
						<?php if ( $author_occupation ): ?>
							<span class="author-occupation"><?php echo $author_occupation; ?></span>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
	<?php
}