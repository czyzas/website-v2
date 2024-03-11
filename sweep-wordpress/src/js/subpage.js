(function () {
	'use strict';
	$(document).ready(function () {

        // handle tables in accordions
        $('.subpage .accordion .collapse').on('shown.bs.collapse', function () {
            updateTableSize();
            $(window).resize();
        });

        // accordion scroll animation
        $('.subpage .accordion.scroll-animation .collapse').on('shown.bs.collapse', function () {
            const positionTop = $(this).parent().offset().top; // - $('header').height();
            $('html, body').animate({
                scrollTop: positionTop
            }, 500);
        });

	    // responsive-image module zoomable feature
	    document.querySelectorAll('.module.responsive-image .image-container.zoomable .desktop-image').forEach((containerElement) => {
		    const popupContainer = document.createElement('div');
		    popupContainer.classList.add('popup-image-container');
		    const clonedImg = containerElement.parentElement.querySelector('.popup-image img').cloneNode(true);
		    clonedImg.classList.add('popup-image');
		    popupContainer.appendChild(clonedImg);

		    const removePopupContainer = () => {
			    $(popupContainer).fadeOut(() => {
				    popupContainer.remove();
			    });
		    };
		    popupContainer.addEventListener('click', removePopupContainer);

		    const mediaQuery = window.matchMedia('(min-width: 768px)');
		    mediaQuery.addEventListener('change', () => {
			    if (!mediaQuery.matches) {
				    removePopupContainer();
			    }
		    })
		    containerElement.querySelector('img').addEventListener('click', () => {
			    if (mediaQuery.matches) {
				    document.body.appendChild(popupContainer);
				    $(popupContainer).fadeIn();
			    }
		    })
	    });

        //Tooltipster

		// default tooltips
		$('.default-tooltipster').tooltipster({
			maxWidth: 290,
			contentAsHTML: true,
			interactive: true,
			functionPosition: function (instance, helper, position) {
				position.coord.left = helper.geo.origin.offset.left - 20;
				return position;
			},
		});

	});
}(jQuery));
