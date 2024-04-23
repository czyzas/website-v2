<?php

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

add_action( 'acf/input/admin_head', function () {
	?>
	<style>
		.acf-fields > .acf-field.invisible-group {
			padding: 0;
		}

		.acf-fields > .acf-field.invisible-group > .acf-label {
			display: none;
		}

		.acf-fields > .acf-field.invisible-group > .acf-input > .acf-fields.-border {
			border: none;
		}

		.color-box {
			display: inline-block;
			border: 1px solid #BDBDBD;
			background: var(--box-color, transparent);
			width: 1em;
			height: 1em;
			border-radius: 2px;
			vertical-align: text-bottom;
			margin-right: 2px;
		}
	</style>
	<?php
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
				/** @type {HTMLButtonElement} */
				const btn = event.target;
				if (!btn.classList.contains('collapse-all')) return;
				const layoutItem = btn.closest('.acf-field-flexible-content')
					.querySelector('.values>.layout');
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
