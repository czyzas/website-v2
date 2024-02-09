(function () {
    'use strict';
    $(function () {
        $(document).ready(function () {

            $.fn.datepicker.dates['pl'] = {
                days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
                daysShort: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Piąt.", "Sob."],
                daysMin: ["Ndz.", "Pn.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
                months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                monthsShort: ["Sty.", "Lut.", "Mar.", "Kwi.", "Maj", "Cze.", "Lip.", "Sie.", "Wrz.", "Paź.", "Lis.", "Gru."],
                today: "Dzisiaj",
                weekStart: 1,
                clear: "Wyczyść",
                format: "dd.mm.yyyy"
            };

            $('input.datepicker').datepicker({
                format: 'dd/mm/yyyy',
                language: 'pl',
                clearBtn: true,
                autoclose: true
            });

            $('input.datepicker').on('changeDate', function () {
                $(".reports .detailed-filter .search").click();
            })

            $('.calendar .filter a').click(function (e) {
                $(".calendar .filter a").removeClass('active');
                $(this).addClass('active');
                var year = $(this).data('year');
                $('.year-container.active').fadeOut(function () {
                    $('.year-container.active').removeClass('active');
                    var chosen = $('.year-container[data-year="' + year + '"]');
                    chosen.fadeIn();
                    chosen.addClass('active');
                });

                e.preventDefault();
                return false;
            });

            $('.gatherings-container .filter a').click(function (e) {
                $(".gatherings-container .filter a").removeClass('active');
                $(this).addClass('active');
                var year = $(this).data('year');
                $('.gatherings.active').fadeOut(function () {
                    $('.gatherings.active').removeClass('active');
                    var chosen = $('.gatherings[data-year="' + year + '"]');
                    chosen.fadeIn();
                    chosen.addClass('active');
                });

                e.preventDefault();
                return false;
            });

            $("#keyword, #date-from, #date-to").keypress(function (event) {
                if (event.keyCode === 13) {
                    $(".reports .detailed-filter .search").click();
                }
            });

            $(".reports .detailed-filter .search").click(function (event) {

                var keyword = $("#keyword").val();
                var dateFrom = $("#date-from").val();
                var dateTo = $("#date-to").val();

                if (keyword !== "" || dateTo !== "" || dateTo !== "") {

                    event.preventDefault();
                    $(".reports .filter a").removeClass('active');

                    var tableRows = $("table tbody tr");
                    tableRows.hide();
                    tableRows.each(function () {
                        var correct = true;

                        if (keyword !== "") {
                            var content = $(this).text();
                            content = content.toLowerCase();
                            keyword = keyword.toLowerCase();
                            if (content.indexOf(keyword) === -1) {
                                correct = false;
                            }
                            // insertParam("slowo-kluczowe", keyword);
                        }

                        if (dateFrom !== "") {
                            var date = moment($(this).data('date'), 'DD/MM/YYYY');
                            var inputDate = moment(dateFrom, 'DD/MM/YYYY');
                            // insertParam("data-od", dateFrom);

                            if (date < inputDate) {
                                correct = false;
                            }
                        }

                        if (dateTo !== "") {
                            var date = moment($(this).data('date'), 'DD/MM/YYYY');
                            var inputDate = moment(dateTo, 'DD/MM/YYYY');
                            // insertParam("data-do", dateTo);

                            if (date > inputDate) {
                                correct = false;
                            }
                        }

                        if (correct) {
                            $(this).show();
                        }
                    });

                    editParams([
                        {key: 'slowo-kluczowe', value: keyword},
                        {key: 'data-od', value: dateFrom},
                        {key: 'data-do', value: dateTo}
                    ], ['rok']);
                }
                event.preventDefault();
                return false;
            });

            $('.reports .filter a').click(function (e) {
                $(".reports .filter a").removeClass('active');
                $(this).addClass('active');
                var year = $(this).data('year');

                editParams([{key: 'rok', value: year}], ['slowo-kluczowe', 'data-od', 'data-do']);

                $("table tbody tr").hide();
                $("table tbody tr[data-year='" + year + "']").show();

                e.preventDefault();
                return false;
            });

            if ($(".reports .detailed-filter .search").length) {
                $(".reports .detailed-filter .search").click();
            }
        });
        $(window).on('load', function () {
        });

        function editParams(paramsToAdd, paramsToRemove) {

            var kvp = document.location.search.substr(1).split('&');
            let i = 0;

            for (var j = 0; j < paramsToAdd.length; j++) {
                var key = encodeURIComponent(paramsToAdd[j].key);
                var value = encodeURIComponent(paramsToAdd[j].value);

                for (; i < kvp.length; i++) {
                    if (kvp[i].startsWith(key + '=')) {
                        let pair = kvp[i].split('=');
                        pair[1] = value;
                        kvp[i] = pair.join('=');
                        break;
                    }
                }

                if (i >= kvp.length) {
                    kvp[kvp.length] = [key, value].join('=');
                }
            }

            for (i = 0; i < kvp.length; i++) {
                for (var j = 0; j < paramsToRemove.length; j++) {
                    if (kvp[i].startsWith(paramsToRemove[j] + '=')) {
                        let pair = kvp[i].split('=');
                        pair[1] = "";
                        kvp[i] = pair.join('=');
                        break;
                    }
                }
            }

            // can return this or...
            let params = kvp.join('&');
            params = params.trimLeft("&").trimRight("&");
            console.log(params);
            window.history.replaceState(null, null, "?" + params);
        }

        String.prototype.trimLeft = function(charlist) {
            if (charlist === undefined)
                charlist = "\s";

            return this.replace(new RegExp("^[" + charlist + "]+"), "");
        };

        String.prototype.trimRight = function(charlist) {
            if (charlist === undefined)
                charlist = "\s";

            return this.replace(new RegExp("[" + charlist + "]+$"), "");
        };
    });
}(jQuery));