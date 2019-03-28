function criar_questao(){
  TABELA_CONSULTA = $.DataTableXenon({
  	json : URL_CONSULTA,
  	container: "datatable_questao",
    filterForm: '#filtro_consulta',
    aoColumns: [
       {
          "mData": TITULO_N,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-4',
          "mRender": function ( data, type, full ) {
            return full['descricao'];
          }
	   },
	   {
          "mData": TITULO_QUEST,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-4',
          "mRender": function ( data, type, full ) {
            return full['descricao'];
          }
	   },
	   {
          "mData": TITULO_RESP,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-4',
          "mRender": function ( data, type, full ) {
            return full['descricao'];
          }
	   },
	   {
          "mData": TITULO_NOTA,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-4',
          "mRender": function ( data, type, full ) {
            return full['descricao'];
          }
	   },
       {
          "mData": TITULO_ACOES,
          'orderable': false,
          'searchable': false,
          'class':'col-md-1 text-center big_icons',
          "mRender": function ( data, type, full ) {
            var HTML = ''
            HTML += '<a href="'+ URL_EDICAO + full["slug"] + '" title="'+TITULO_EDIT+'" class="text-gray "><i class="'+ICON_EDIT+'"></i> </a>';
            HTML += '<a href="#" title="'+TITULO_EXC+'" class="text-gray " onclick="excluir_registro(\''+full["slug"]+'\')"> <i class="'+ICON_DELETE+'"></i></a>';
            return HTML;
          }
    	  },
   ]
  });
}

function consultar(){
  TABELA_CONSULTA.reload();
}

function excluir_registro(slug_registro){

  $.dialogs.confirm('', ALERTA_EXC, function() {
    $.ajax({
      url : URL_EXCLUSAO,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { num : slug_registro },
      success : function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC);
        consultar();
      }
    });
  });

}

$(function() {
	CKEDITOR.config.removePlugins = "elementspath"; // Remove o caminho que ele coloca no rodapé
	CKEDITOR.config.extraPlugins  = 'cadastro_teste_instrucoes';
	tool = [
		{ name: 'edit',           items:[ 'Cut' ,'Copy', 'Paste','Undo','Redo' ,'/']},
		{ name: 'component',      items:[ 'Table', 'HorizontalRule', 'SpecialChar','/' ]},
		{ name: 'others',         items:[ 'Maximize' ,'-','Source', 'Bold', 'Italic','Strike' , 'Underscore','RemoveFormat']},'/',
		{ name: 'indent',         items:[ 'NumberedList','BulletedList','Outdent','Indent','Blockquote',  'Styles','Format']},
		{ name: 'cadastro_teste_instrucoes', items:[ '/',"CampoEspecialTesteInstrucoes"] },
	];

	CKEDITOR.replace( 'id_instrucao_inicio', { extraPlugins : 'cadastro_teste_instrucoes', toolbar : tool });
	CKEDITOR.replace( 'id_instrucao_conclusao', { extraPlugins : 'cadastro_teste_instrucoes', toolbar : tool });

    criar_questao();
});
