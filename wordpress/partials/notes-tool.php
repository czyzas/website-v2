<?php // TODO: zrobić z tego modal ?>
<section class="module notes-tool" hidden>
    <div class="container-fluid page-container">
	    <label for="new-note"><?php echo __tr('nowa_notatka'); ?></label>
        <textarea id="new-note" placeholder="<?php echo __tr('wpisz_notatke') ?>"></textarea>
	    <div class="buttons">
		    <button type="button" class="button button-brand" data-action="save-note"><?php echo __tr('zapisz'); ?></button>
		    <button type="button" class="button button-brand" data-action="delete-note"><?php echo __tr('usun'); ?></button>
		    <button type="button" class="button button-brand" data-action="close-notes-tool"><?php echo __tr('zamknij'); ?></button>
	    </div>
    </div>
</section>
