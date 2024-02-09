/**
 * Tools show/hide
 */
function toolsSidebarToggle() {
	const reportToolsSidebar = document.querySelector('aside.report-tools');
	if (!reportToolsSidebar) return;

	reportToolsSidebar.querySelector('button[data-action="toggle-tools"]').addEventListener('click', (event) => {
		const button = event.currentTarget;
		const isActive = button.ariaExpanded === 'true';
		const list = document.getElementById(button.getAttribute('aria-controls'));

		if (!list) return;

		if (!isActive) {
			$(list).slideDown()
		} else {
			$(list).slideUp()
		}
		button.ariaExpanded = !isActive;
	});
}
