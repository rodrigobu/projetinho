function criar_multiportal(){
  TABELA_CONSULTA = $.DataTableXenon({
  	json : URL_CONSULTA,
  	container: "datatable_multiportal",
    filterForm: '#filtro_consulta',
    order: [[1, "asc"]],
    aoColumns: [
        {
           "mData": "Ações",
           'orderable': false,
           'searchable': false,
           'class':'col-md-1 text-center big_icons',
           "mRender": function ( data, type, full ) {
             var HTML = ''
             if(!full['portal_spa']){
                 HTML += '<a href="'+ URL_EDICAO + full["slug"] + '" title="'+TITULO_EDIT+'" class="text-gray "><i class="'+ICON_EDIT+'"></i> </a>';
                 if(!full['padrao']){
                   HTML += '<a href="#" title="'+TITULO_EXC+'" class="text-gray " onclick="excluir_registro(\''+full["slug"]+'\')"> <i class="'+ICON_DELETE+'"></i></a>';
                 }
             }
             return HTML;
           }
       },
       {
          "mData": TITULO_NOME,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-9',
          "mRender": function ( data, type, full ) {
            return full['nome'];
          }
	   },
        {
           "mData": TITULO_PADRAO,
 		  'orderable': true,
           'searchable': true,
           'class':'col-md-2 text-center',
           "mRender": function ( data, type, full ) {
             if( full['padrao'] ){
               return '<i class="fa-check-square" title="Sim"></i>';
             } else {
               return '<i class="fa-square-o" title="Não"></i>';
             }
           }
 	   },
   ]
  });
}

function consultar(){
  TABELA_CONSULTA.reload();
}

$(function() {
    criar_multiportal();
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
