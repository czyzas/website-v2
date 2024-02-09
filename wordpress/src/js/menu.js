(function () {
    'use strict';
    $(document).ready(function () {
        const $header = $('header');
        const $menuOverlay = $('.menu-overlay');
        let lastWindowWidth = $(window).width();

        // Menu toggle
        $(".menu-toggle").on('click', function () {
            $menuOverlay.fadeToggle(300);
            $menuOverlay.toggleClass('open');
            $(this).toggleClass("open");
            $header.toggleClass('open');
            closeSubmenus();
        });


        $('ul.header-main-menu li.menu-item-has-children > a').on('click', function (e) {
            e.preventDefault();
            const $this = $(this);
            const submenuLevel = $this.data('depth');
            if ($this.hasClass('active')) {
                $this.siblings('.submenu').stop().slideUp(300);
                $this.parent().removeClass('open');
                $this.removeClass('active');
            } else {
                closeSubmenus(submenuLevel);
                $this.siblings('.submenu').stop().slideToggle(300);
                $this.parent().toggleClass('open');
                $this.toggleClass('active');
            }
        });

        clickedOutside('.menu-overlay', closeMenu, ['.menu-toggle']);

        $(window).resize(function(){
            if($(window).width() !== lastWindowWidth){
                closeMenu();
                lastWindowWidth = $(window).width();
            }
        });

        function closeMenu() {
            $('.header-right nav.open').fadeOut(300, function () {
                $(this).css('display', '');
                $(this).removeClass('open');
            });
            $header.removeClass('open');
            $('.menu-toggle').removeClass('open');
            $menuOverlay.fadeOut();
            $menuOverlay.removeClass('open');
            closeSubmenus();
        }

        function closeSubmenus(dataLevel = 1) {
            $('ul[data-level="' + dataLevel + '"] li.menu-item-has-children > a.active').each(function () {
                $(this).siblings('.submenu').stop().slideToggle(300, function () {
                    $(this).css('display', '')
                });
                $(this).removeClass('active');
                $(this).parent().removeClass('open');
            });
        }

    });
}(jQuery));