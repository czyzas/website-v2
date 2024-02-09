jQuery(function($) {
    $(document).ready(function(){
        if(typeof acf !== 'undefined') {
            acf.add_action('load', function ($el) {
                $(document).on('click', '.insert-dictionary', openDictionaryForm);
            });
        }
    });

    function openDictionaryForm(e) {
        var editorEl = $(e.target).siblings('.add_media').data('editor');
        var editorId = editorEl.split('-')[2];

        var popup = $('<div class="dictionary-popup" data-editor="'+ editorId +'">');
        var inputWord = $('<input id="dictionary_word" placeholder="Słowo" />');
        var inputTerm = $('<input id="dictionary_term" placeholder="Tag" />');
        var inputTermId = $('<input id="dictionary_term_id" type="hidden" />');
        var btnContainer = $("<div class='buttonsContainer'>");
        var closebtn = $('<a href="#" class="button closeBtn">Zamknij</a>');
        var insertbtn = $('<a href="#" class="button insertWord">Dodaj</a>');

        inputWord.appendTo(popup);
        inputTerm.appendTo(popup);
        inputTermId.appendTo(popup);
        closebtn.appendTo(btnContainer);
        insertbtn.appendTo(btnContainer);
        btnContainer.appendTo(popup);
        popup.appendTo($('body'));

        $('.closeBtn').click(function(e){
            $(this).closest('.dictionary-popup').remove();

            e.preventDefault();
            return false;
        });

        $('.insertWord').click(function(e){
            var term = $('.dictionary-popup #dictionary_term').val();
            term = term.trim();
            term = rtrim(',', term);

            var shortcode = '[dictionary term="' + term + '" word="' + $('.dictionary-popup #dictionary_word').val() + '"]';

            var dataEditor = $('.dictionary-popup').data('editor');

            tinymce.get('acf-editor-' + dataEditor).execCommand('mceInsertContent', false, shortcode);

            $(this).closest('.dictionary-popup').remove();
            e.preventDefault();
            return false;
        });

        jQuery('#dictionary_term').suggest("/wp-admin/admin-ajax.php?action=tag_id_search&tax=dictionary", {multiple:true, multipleSep: ","});

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
