(function () {
	'use strict';
	$(document).ready(function () {

		// Smooth scroll to
		$('.scroll-animation').on('click', function (e) {
			e.preventDefault();

			const href = $(this).attr('href');
			if (href) {
				$("html, body").animate({
					scrollTop: $(href).offset().top
				}, 1000);
			}
		});

		$('.scroll-animation a').on('click', function (e) {
			e.stopPropagation();
		});


		const isOverflowing = (element, container = document.body) => {
			const containerRect = container.getBoundingClientRect();
			const containerTop = containerRect.top + window.scrollY;
			const elementRect = element.getBoundingClientRect();
			const elementTop = elementRect.top + window.scrollY;

			if (containerTop + containerRect.height < elementTop + elementRect.height) {
				return 'bottom'
			}

			if (containerTop > elementTop || elementRect.y <= 0) {
				return 'top';
			}

			return null;
		}

		// Previous reports dropdown logic
		const previousReportsTrigger = document.querySelectorAll('.previous-reports-trigger');
		previousReportsTrigger.forEach((triggerButton) => {
			const container = triggerButton.closest('.previous-reports');
			const list = triggerButton.parentElement.querySelector('ul.previous-reports-list');
			const handleOverflowing = () => {
				const overflowing = isOverflowing(list);
				if (overflowing === 'top') {
					container.classList.remove('side-top');
					container.classList.add('side-bottom');
				} else if (overflowing === 'bottom') {
					container.classList.add('side-top');
					container.classList.remove('side-bottom');
				}
			}
			handleOverflowing();
			triggerButton.addEventListener('click', (event) => {
				handleOverflowing();
				const willClose = triggerButton.classList.contains('open');
				triggerButton.setAttribute('aria-expanded', willClose ? 'false' : 'true')
				triggerButton.classList.toggle('open', !willClose);
				list.classList.toggle('open', !willClose);
			})

			clickedOutside('ul.previous-reports-list', function () {
				triggerButton.classList.remove('open');
				list.classList.remove('open');
			}, ['.previous-reports-trigger']);
		})
	});
}(jQuery));
