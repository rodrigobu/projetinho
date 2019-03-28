var toggle_deficiencia = function() {
    if ($("#id_aceita_limitacao").is(":checked")) {
        $("#div_id_obs_deficiencia, #div_id_deficiencias").parent('div').show();
    } else {
        $("#div_id_obs_deficiencia, #div_id_deficiencias").parent('div').hide();
    }
};

$(function(){
    CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
    CKEDITOR.config.shiftEnterMode = CKEDITOR.ENTER_BR;
    CKEDITOR.config.autoUpdateElement = true;
    /*CKEDITOR.config.protectedSource.push( /<[\s\S]*?\/>/g );*/
    CKEDITOR.config.fullPage = false;
    CKEDITOR.config.entities = false;
    CKEDITOR.config.basicEntities  = false;
	  CKEDITOR.config.removePlugins = "elementspath"; // Remove o caminho que ele coloca no rodapé
    CKEDITOR.config.resize_enabled = false;
    CKEDITOR.config.toolbar = [
        { name: 'edit',      items:[ 'Cut', 'Copy', 'Paste','Undo','Redo' ,'/']},
        { name: 'component', items:[ 'Table', 'HorizontalRule', 'SpecialChar','/' ]},
        { name: 'others',    items:[ 'Maximize', '-', 'Source']},
        { name: 'styles',    items:[ 'Bold', 'Italic', 'Strike' , 'Underscore','RemoveFormat' , 'Styles', 'Format']},
        { name: 'indent',    items:[ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]},
        { name: 'especiais', items:[ '/', "CampoEspecial"] }
    ];
    if(READONLY){
      CKEDITOR.config.readOnly = true;
    }

    make_calcula_salario();

    toggle_deficiencia();
    $("#id_aceita_limitacao").on("click", toggle_deficiencia);
    $("#id_deficiencias").val(DEFICIENCIAS_VAGA).multiselect('refresh');
});
