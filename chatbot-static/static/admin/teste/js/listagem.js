function criar_teste(){
  TABELA_CONSULTA = $.DataTableXenon({
  	json : URL_CONSULTA,
  	container: "datatable_teste",
    filterForm: '#filtro_consulta',
    aoColumns: [
       {
          "mData": "Descrição",
		  'orderable': true,
          'searchable': true,
          'class':'col-md-4',
          "mRender": function ( data, type, full ) {
            return full['descricao'];
          }
	   },
       {
          "mData": "Ações",
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

$(function() {
    criar_teste();
});

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
