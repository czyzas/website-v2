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

		.tag-radio-list ul.acf-radio-list li:not(:last-child) {
			margin-bottom: 4px;
		}

		.tag-radio-list ul.acf-radio-list li label {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.tag-radio-item {
			display: inline-block;
			text-transform: uppercase;
			padding: 3px 8px;
			border-radius: 8px;
			font-size: 12px;
			line-height: 18px;
			font-weight: bold;
			font-family: ui-sans-serif, sans-serif;
			border: 1px solid var(--tag-border, transparent);
			background: var(--tag-bg, #E0E0E0);
			color: var(--tag-fg, #6E6E6E);
		}

		.tag-radio-item[data-color="green"] {
			--tag-fg: #008113;
			--tag-bg: #DDF3D8;
		}

		.tag-radio-item[data-color="algea"] {
			--tag-fg: #22543B;
			--tag-bg: #D9F2E5;
		}

		.tag-radio-item[data-color="red"] {
			--tag-fg: #B81F00;
			--tag-bg: #FCE6E2;
		}

		.tag-radio-item[data-color="sea"] {
			--tag-fg: #052561;
			--tag-bg: #DFE5F1;
		}

		.tag-radio-item[data-color="blue"] {
			--tag-fg: #0192CB;
			--tag-bg: #E6F0F4;
		}

		.tag-radio-item[data-color="glacier"] {
			--tag-fg: #0192CB;
			--tag-bg: #BBE5F5;
		}

		.tag-radio-item[data-color="coral"] {
			--tag-fg: #732178;
			--tag-bg: #F4E2F0;
		}

		.tag-radio-item[data-color="flower"] {
			--tag-fg: #4B0F6C;
			--tag-bg: #E7D6F1;
		}

		.tag-radio-item[data-color="gray"] {
			--tag-fg: #6E6E6E;
			--tag-bg: #E0E0E0;
		}

		.tag-radio-item[data-color="gray-outline"] {
			--tag-fg: #6E6E6E;
			--tag-bg: transparent;
			--tag-border: #8A8A8A;
		}

		.tag-radio-item[data-color="yellow"] {
			--tag-fg: #9A6500;
			--tag-bg: #FFF4D7;
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
		.acf-field-flexible-content > .acf-label {
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
