<?php

add_action( 'acf/init', function () {
	acf_update_setting( 'google_api_key', 'AIzaSyCRPjv9FXcWodJmJ1YU4Nq87F0VMjFl_NE' );

	// Add options page programatically for Polylang
	if ( function_exists( 'acf_add_options_page' ) && function_exists( 'pll_languages_list' ) ) {
		$langs = pll_languages_list();
		foreach ( $langs as $lang ) {
			#TODO: Ogarnąć lepiej menu_slug/post_id tak aby ACF łapał od razu
			acf_add_options_sub_page( [
				'page_title'  => "Options: $lang",
				'menu_title'  => "Options: $lang",
				'menu_slug'   => "options-$lang",
				'post_id'     => "options-$lang",
				'parent_slug' => 'options'
			] );
		}
	}
} );


/**
 * Local JSON Functionality to save
 *
 * @return string
 */
add_filter( 'acf/settings/save_json', function () {
	return get_stylesheet_directory() . '/includes/acf-json';
} );

/**
 * Local JSON Functionality to load
 *
 * @param $paths
 * @return mixed
 */
add_filter( 'acf/settings/load_json', function ( $paths ) {
	// remove original path (optional)
	unset( $paths[0] );

	// append path
	$paths[] = get_stylesheet_directory() . '/includes/acf-json';

	// return
	return $paths;
} );

/*
 * Add flexible content key next to its title to make it easier to search of specific key
 */
add_action( 'acf/input/admin_head', function () {
	?>
	<style>
		.acf-field-flexible-content .acf-label {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	</style>
	<script type="text/javascript">
		acf.addAction('ready', () => {
			const flexibleContentFields = document.querySelectorAll('.acf-field-flexible-content');
			flexibleContentFields.forEach((field) => {
				const label = field.querySelector('.acf-label');
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.classList.add('button-link', 'collapse-all');
				btn.innerText = 'Toggle all';
				label.append(btn);
			});


			// Add event listener to all buttons via event bubbling
			window.addEventListener('click', (event) => {
				if (!event.target.classList.contains('collapse-all')) return;
				const btn = event.target;
				const layoutItem = btn.closest('.acf-field-flexible-content').querySelector('.values>.layout');
				if (!layoutItem) return;
				// Determine by first child if we should collapse or expand
				const isCollapsed = (el) => el && el?.classList?.contains('-collapsed');
				const willOpen = isCollapsed(layoutItem);

				for (const item of layoutItem.parentNode.children) {
					if (willOpen === isCollapsed(item)) {
						item.querySelector('a.-collapse')?.click();
					}
				}
			});
		});
	</script>
<?php } );
