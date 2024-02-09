(function () {
    'use strict';
    $(function () {
        $(document).ready(function () {

            //Calendar
            $('.save-in-outlook').click(function(e){

                var date = moment($(this).data('date'),'DD/MM/YYYY');
                var cal = ics();
                var beginDate = date.format('YYYY/MM/DD');
                var endDate = date.add(1, 'days').format('YYYY/MM/DD');
                cal.addEvent(
                    $(this).data('name'),
                    $(this).data('description'),
                    'Warszawa',
                    beginDate,
                    endDate
                );
                cal.download("calevent");

                e.preventDefault();
                return false;
            });

            // quarterly data table
            $('.subpage .swiper-qdt').each(function () {
                new Swiper($(this)[0], {
                    slidesPerView: 3,
                    spaceBetween: 0,
                    navigation: {
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                    },
                    breakpoints: {
                        767: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                        },
                        575: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                        }
                    }
                });
            });

        });
    });
}(jQuery));
