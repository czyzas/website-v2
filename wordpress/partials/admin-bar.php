<?php if ( !is_admin_bar_showing() && is_user_logged_in() ) : ?>
	<style>
		.fhp-admin-bar {
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 11;
			width: 100px;
			height: 100px;
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
			padding: 10px;
		}

		.fhp-admin-bar:hover .toolbar-list {
			opacity: 1;
			visibility: visible;
			transform: translateY(0px);
		}

		.fhp-admin-bar .toolbar-list {
			display: block;
			background-color: #ffffff;
			border-radius: 6px;
			box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
			padding: 8px 0;
			position: absolute;
			left: 10px;
			bottom: 10px;
			transition: all 150ms ease;
			width: 180px;
			opacity: 0;
			visibility: hidden;
			transform: translateY(8px);
		}

		.fhp-admin-bar .toolbar-list li {
			padding: 5px;
		}

		.fhp-admin-bar .toolbar-list a {
			display: flex;
			align-items: baseline;
			gap: 8px;
			color: #1e293b;
			padding: 5px 10px;
			font-size: 16px
		}

		.fhp-admin-bar .toolbar-list svg {
			width: auto;
			height: 0.85em;
			stroke-width: 1.5;
			transform: translateY(1px);
		}

		.fhp-admin-bar .toolbar-list a:hover {
			color: #003aff;
		}

		.fhp-admin-bar svg {
			max-width: 32px;
			height: auto;
		}

		.fhp-admin-bar:hover svg g {
			fill: #21759b;
		}
	</style>
	<div class="fhp-admin-bar">
		<ul class="toolbar-list">
			<li><a href="<?php echo get_admin_url(); ?>"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="9" x2="9" y1="21" y2="9"></line></svg><span>Kokpit</span></a></li>
			<li><a href="<?php echo get_home_url(); ?>"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg><span>Strona główna</span></a></li>
			<li><a href="<?php echo get_edit_post_link(); ?>"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg><span>Edytuj stronę</span></a></li>
		</ul>
		<svg viewBox="0 0 122.52 122.523" xmlns="http://www.w3.org/2000/svg">
			<g fill="#464342">
				<path d="m8.708 61.26c0 20.802 12.089 38.779 29.619 47.298l-25.069-68.686c-2.916 6.536-4.55 13.769-4.55 21.388z" />
				<path d="m96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.667 14.006-.667 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501l19.138 56.925 11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.667 13.843.667 5.496 0 14.006-.667 14.006-.667 2.835-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z" />
				<path d="m62.184 65.857-15.768 45.819c4.708 1.384 9.687 2.141 14.846 2.141 6.12 0 11.989-1.058 17.452-2.979-.141-.225-.269-.464-.374-.724z" />
				<path d="m107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z" />
				<path d="m61.262 0c-33.779 0-61.262 27.481-61.262 61.26 0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.265-27.48 61.265-61.263-.001-33.779-27.487-61.26-61.265-61.26zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z" />
			</g>
		</svg>
	</div>
<?php endif;