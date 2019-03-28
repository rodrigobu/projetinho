$(function() {
    CKEDITOR.config.extraPlugins = 'especiais';
    CKEDITOR.config.toolbar = [
        { name: 'edit',      items:[ 'Cut', 'Copy', 'Paste','Undo','Redo' ,'/']},
        { name: 'component', items:[ 'Table', 'HorizontalRule', 'SpecialChar','/' ]},
        { name: 'others',    items:[ 'Maximize', '-', 'Source']},
        { name: 'styles',    items:[ 'Bold', 'Italic', 'Strike' , 'Underscore','RemoveFormat' , 'Styles', 'Format']},
        { name: 'indent',    items:[ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]},
        { name: 'especiais', items:[ '/', "CampoEspecial"] }
    ];

    CKEDITOR.config.enterMode         = CKEDITOR.ENTER_BR;
    CKEDITOR.config.shiftEnterMode    = CKEDITOR.ENTER_BR;
    CKEDITOR.config.autoUpdateElement = true;
    /*CKEDITOR.config.protectedSource.push( /<[\s\S]*?\/>/g );*/
    CKEDITOR.config.fullPage = false;
    CKEDITOR.config.entities = false;
    CKEDITOR.config.basicEntities  = false;
    CKEDITOR.config.removePlugins  = 'elementspath';
    CKEDITOR.config.resize_enabled = false;

    $("#form_dados").submit(function(){

        for(var i in CKEDITOR.instances) {
          CKEDITOR.instances[i].updateElement();
        };

    })

});
