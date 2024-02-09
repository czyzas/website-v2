<?php
if (get_field('modules')) {
	$indexes = [];
	foreach (get_field('modules') as $module) {
		if ($module['acf_fc_layout'] === 'gri_text' && $module['gri_list']) {
			$indexes = array_merge($indexes, $module['gri_list']);
		}
	}
}
if (isset($indexes) && $indexes):
	?>
	<div class="gri-container">
		<span class="gri-label">GRI:</span>[
		<ul class="gri-list">
			<?php foreach ($indexes as $gri_index => $index): ?>
				<li><a href="#index-<?php echo sanitize_title($index['index']) . '-' . $gri_index; ?>" class="scroll-animation"><?php echo $index['index'] ?></a></li>
			<?php endforeach; ?>
		</ul>]
	</div>
<?php endif; ?>
