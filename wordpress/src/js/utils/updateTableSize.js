function updateTableSize() {
	$('.table-container').each(function () {
		if ($(this).parent().hasClass('panel-body')) return;
		const containerWidth = $(this).width();
		const tableWidth = $('table', this).width();
		const tableWrapper = $(this).find('.table-wrapper');
		const simpleBarInstance = SimpleBar.instances.get(tableWrapper[0]);

		if (tableWidth > containerWidth) {
			$(this).addClass('scrollable');
			!simpleBarInstance && new SimpleBar(tableWrapper[0]);
		} else {
			$(this).removeClass('scrollable');
		}
	});
}
