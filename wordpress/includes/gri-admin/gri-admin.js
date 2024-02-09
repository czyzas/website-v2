jQuery(function($) {
    $(document).ready(function(){
        if(typeof acf !== 'undefined') {
            acf.add_action('load', function ($el) {
                $(document).on('click', '.insert-gri', openGriForm);
            });
        }
    });

    function openGriForm(e) {
        var editorEl = $(e.target).siblings('.add_media').data('editor');
        var editorId = editorEl.split('-')[2];

        var popup = $('<div class="gri-popup" data-editor="'+ editorId +'">');
        var inputTerm = $('<input id="gri_post" placeholder="GRI" />');
        var inputTermId = $('<input id="gri_id" type="hidden" />');
        var btnContainer = $("<div class='buttonsContainer'>");
        var closebtn = $('<a href="#" class="button closeBtn">Zamknij</a>');
        var insertbtn = $('<a href="#" class="button insertWord">Dodaj</a>');

        // inputWord.appendTo(popup);
        inputTerm.appendTo(popup);
        inputTermId.appendTo(popup);
        closebtn.appendTo(btnContainer);
        insertbtn.appendTo(btnContainer);
        btnContainer.appendTo(popup);
        popup.appendTo($('body'));

        $('.closeBtn').click(function(e){
            $(this).closest('.gri-popup').remove();

            e.preventDefault();
            return false;
        });

        $('.insertWord').click(function(e){
            e.preventDefault();
            var term = $('.gri-popup #gri_post').val();
            term = term.split('|')[0];
            term = term.trim();

            var shortcode = '[gri griid="' + term + '"]';

            var dataEditor = $('.gri-popup').data('editor');

            tinymce.get('acf-editor-' + dataEditor).execCommand('mceInsertContent', false, shortcode);

            $(this).closest('.gri-popup').remove();
            e.preventDefault();
            return false;
        });

        jQuery('#gri_post').suggest("/wp-admin/admin-ajax.php?action=gri_id_search&post_type=gri_indicator", {multiple:true, multipleSep: ","});

        e.preventDefault();
        return false;
    };

    function rtrim(char, str) {
        if (str.slice(str.length - char.length) === char) {
            return rtrim(char, str.slice(0, 0 - char.length));
        } else {
            return str;
        }
    }
});
