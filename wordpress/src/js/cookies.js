(function () {
    'use strict';
    $(document).ready(function () {

        const cookiesCategories = ['required', 'functional', 'analytical', 'marketing'];

        function setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function fhpCookiesConvertTypes(cookiesTypes) {

            $("script").each(function () {
                if ($(this).data('fhpc')) {
                    const dataFHC = $(this).data('fhpc').split(' ');

                    if (dataFHC.every((type) => cookiesTypes.includes(type))) {
                        const newScript = $("<script type='text/javascript'>")

                        newScript.text($(this).text());
                        newScript.attr('data-fhpc', $(this).attr('data-fhpc'))

                        $(this).after(newScript);
                        $(this).remove();
                    }
                }
            });

            $("iframe").each(function () {
                if ($(this).data('fhpc')) {
                    const dataFHC = $(this).data('fhpc').split(' ');

                    if (dataFHC.every((type) => cookiesTypes.includes(type))) {
                        $(this).attr('src', $(this).data('src'));
                    }
                }
            });
        }

        function fhpCookiesClosePopup() {
            $('.fhp-cookies .fhp-cookies-popup').removeClass('open').fadeOut();
            $('.fhp-cookies .fhp-cookies-bar').fadeOut();
            $('body').removeClass('fhp-no-scroll');
        }

        function fhpCheckCheckedConsents(cookiesTypes) {
            $('input[type="checkbox"].fhp-cookies-input').each(function () {
                const consent = $(this).data('consent');
                $(this).prop('checked', cookiesTypes.includes(consent))
            });
        }

        if (!getCookie('fhpcookie')) {
            $('.fhp-cookies').show();
        } else {
            const fhpcookie = getCookie('fhpcookie').split(',');
            fhpCookiesConvertTypes(fhpcookie);
            fhpCheckCheckedConsents(fhpcookie);
        }

        $('.fhp-cookies .fhp-cookies-accept-all').on('click', function () {
            setCookie('fhpcookie', cookiesCategories.join(','), 30);

            fhpCookiesConvertTypes(cookiesCategories);
            fhpCheckCheckedConsents(cookiesCategories);
            fhpCookiesClosePopup();
        });

        $('.fhp-cookies .fhp-cookies-reject-all').on('click', function () {
            const fhcChoices = 'required';
            setCookie('fhpcookie', fhcChoices, 30);

            const fhcChoicesArray = fhcChoices.split(',');

            fhpCheckCheckedConsents(fhcChoicesArray);
            fhpCookiesClosePopup();
        });

        $('.fhp-cookies .fhp-cookies-save-choice').on('click', function () {
            const fhcChoicesArray = [];
            $('input[type="checkbox"].fhp-cookies-input').each(function () {
                const consent = $(this).data('consent');
                const isChecked = $(this).prop('checked');
                if(isChecked) {
                    fhcChoicesArray.push(consent);
                }
            });

            setCookie('fhpcookie', fhcChoicesArray.join(','), 30);

            fhpCookiesConvertTypes(fhcChoicesArray);
            fhpCheckCheckedConsents(fhcChoicesArray);
            fhpCookiesClosePopup();
        });

        $('.fhp-cookies-open-settings, a[href="#fhp-cookies-open-settings"]').on('click', function (e) {
            e.preventDefault();
            $('body').addClass('fhp-no-scroll');
            $('.fhp-cookies .fhp-cookies-popup').fadeIn(() => {
                $('.fhp-cookies-popup').addClass('open');
            });
        });

        $('.fhp-cookies .fhp-cookies-settings').each(function() {
            new SimpleBar(this);
        });
    });
}(jQuery));
