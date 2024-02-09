jQuery(function($) {
    $(document).ready(function(){
        if(typeof acf !== 'undefined') {
            acf.add_action('load', function ($el) {
                $(document).on('click', '.insert-table', openInsertTableForm);
            });
        }
    });

    function openInsertTableForm(e) {
        var editorEl = $(e.target).siblings('.add_media').data('editor');
        var editorId = editorEl.split('-')[2];

        var popup = $('<div class="insert-table-popup" data-editor="'+ editorId +'">');
        var inputTable = $('<input id="insert-table-title" placeholder="Tabela (tytuł)" />');
        var btnContainer = $("<div class='buttonsContainer'>");
        var closebtn = $('<a href="#" class="button closeBtn">Zamknij</a>');
        var insertbtn = $('<a href="#" class="button insertTable">Dodaj</a>');

        inputTable.appendTo(popup);
        closebtn.appendTo(btnContainer);
        insertbtn.appendTo(btnContainer);
        btnContainer.appendTo(popup);
        popup.appendTo($('body'));

        $('.closeBtn').click(function(e){
            $(this).closest('.insert-table-popup').remove();

            e.preventDefault();
            return false;
        });

        $('.insertTable').click(function(e){
            var tableTitle = $('.insert-table-popup #insert-table-title').val();
            var tableTitleSplitted = tableTitle.split('ID:');
            var tableId = tableTitleSplitted[1];

            var shortcode = '[insert-table id="' + tableId + '"]';

            var dataEditor = $('.insert-table-popup').data('editor');

            tinymce.get('acf-editor-' + dataEditor).execCommand('mceInsertContent', false, shortcode);

            $(this).closest('.insert-table-popup').remove();
            e.preventDefault();
            return false;
        });

        jQuery('#insert-table-title').suggest("/wp-admin/admin-ajax.php?action=table_id_search", {multiple:false});

        e.preventDefault();
        return false;
    };
});
