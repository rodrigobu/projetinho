$(function() {
    CKEDITOR.config.extraPlugins = 'wordcount,especiais_sms';
    CKEDITOR.config.wordcount = {
        showWordCount : false,
        showCharCount : true,
        charLimit :     '140',
        wordLimit :     'unlimited'
    };
    CKEDITOR.config.toolbar = [{
        name  : 'edit',
        items : ['Undo', 'Redo', '/']
    }, {
        name  : 'especiais_sms',
        items : ['/', "CampoEspecial_sms"]
    }];

    CKEDITOR.config.enterMode         = CKEDITOR.ENTER_BR;
    CKEDITOR.config.shiftEnterMode    = CKEDITOR.ENTER_BR;
    CKEDITOR.config.autoUpdateElement = true;
    /*CKEDITOR.config.protectedSource.push( /<[\s\S]*?\/>/g );*/
    CKEDITOR.config.fullPage = false;
    CKEDITOR.config.entities = false;
    CKEDITOR.config.basicEntities  = false;
    CKEDITOR.config.removePlugins  = 'elementspath';
    CKEDITOR.config.resize_enabled = false;

});
