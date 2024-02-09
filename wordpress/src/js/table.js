(function () {
	'use strict';
	$(document).ready(function () {

		// table enlarging
		$('.enlarge-table').click(function () {
			var $table;
			var $outerContainer = $(this).parents('.table-container');
			$table = $outerContainer.find('table').first().clone(true);
			var $popup = $table.appendTo('body').wrap('<div class="table-popup"><div class="table-container">').parent().parent();
			$popup.append('<div class="close-popup"></div>');
			$popup.find('.table-container').each(function() {
				new SimpleBar(this);
			});
			$popup.fadeIn();
			$popup.find('.close-popup').click(function () {
				$popup.fadeOut(function () {
					$popup.remove();
				});
			});
			return false;
		});

		// collapsible tables
		$('.table-container').each(function () {
			if ($(this).find('.collapsible-row-parent').length)
				$(this).addClass('collapsible');
			$(this).find('.collapsible-row-child td').wrapInner('<div class="row-content" />');
		});

		$('.table-container .collapsible-row-parent').click(function () {
			var opened = $(this).hasClass('active-parent');
			var level = 1;
			if ($(this).hasClass('parent-level-2')) level = 2;
			if ($(this).hasClass('parent-level-3')) level = 3;
			if ($(this).hasClass('parent-level-4')) level = 4;
			$(this).toggleClass('active-parent');
			$(this).nextUntil('.collapsible-row-parent.parent-level-' + level).each(function () {
				if (opened) {
					var conditionChilds, conditionParents;
					if (level === 1) {
						conditionChilds = $(this).hasClass('child-level-1') ||
							$(this).hasClass('child-level-2') ||
							$(this).hasClass('child-level-3') ||
							$(this).hasClass('child-level-4');
						conditionParents = $(this).hasClass('parent-level-1') ||
							$(this).hasClass('parent-level-2') ||
							$(this).hasClass('parent-level-3') ||
							$(this).hasClass('parent-level-4');
					}
					if (level === 2) {
						conditionChilds = $(this).hasClass('child-level-2') ||
							$(this).hasClass('child-level-3') ||
							$(this).hasClass('child-level-4');
						conditionParents = $(this).hasClass('parent-level-2') ||
							$(this).hasClass('parent-level-3') ||
							$(this).hasClass('parent-level-4');
					}
					if (level === 3) {
						conditionChilds = $(this).hasClass('child-level-3') ||
							$(this).hasClass('child-level-4');
						conditionParents = $(this).hasClass('parent-level-3') ||
							$(this).hasClass('parent-level-4');
					}
					if (level === 4) {
						conditionChilds = $(this).hasClass('child-level-4');
						conditionParents = $(this).hasClass('parent-level-4');
					}

					if (conditionChilds) {
						$(this).removeClass('active-child');
						$(this).find('.row-content').slideUp();
					}
					if (conditionParents) {
						$(this).removeClass('active-parent');
					}
				} else {
					if ($(this).hasClass('child-level-' + level)) {
						$(this).addClass('active-child');
						$(this).find('.row-content').slideDown();
					}
				}
			});
			updateTableSize();
		});

		$('.table-container').each(function () {
			var $container = $(this);
			var showRows = true;
			$container.on('click', '.see-more', function () {
				var buttonThis = $(this);
				if (showRows) {
					$container.find('.collapsible-row-parent').addClass('active-parent');
					$container.find('.collapsible-row-child').addClass('active-child');
					$container.find('.collapsible-row-child').find('.row-content').slideDown();
					buttonThis.text(buttonThis.data('seeless'));
				} else {
					$container.find('.collapsible-row-parent').removeClass('active-parent');
					$container.find('.collapsible-row-child').removeClass('active-child');
					$container.find('.collapsible-row-child').find('.row-content').slideUp();
					buttonThis.text(buttonThis.data('seemore'));
				}
				showRows = !showRows;
				updateTableSize();
			});
		});

		updateTableSize();
		$(window).on('resize', updateTableSize);
	});
}(jQuery));
