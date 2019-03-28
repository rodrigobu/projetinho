function criar_conceito(){
  TABELA_CONSULTA = $.DataTableXenon({
  	json : URL_CONSULTA_CONCEITO,
  	container: "datatable_conceito",
    filterForm: '#filtro_consulta',
    order: [[1, "asc"]],
    aoColumns: [
        {
           "mData": TITULO_ACOES,
           'orderable': false,
           'searchable': false,
           'class':'col-md-1 text-center big_icons',
           "mRender": function ( data, type, full ) {
             var HTML = ''
             if (full['proibir_edicao']){
                 HTML += '<span title="'+TITULO_EDITNO+'"><i class="'+ICON_INFO+'"></i><span>';
             }else{
                 HTML += '<a href="'+ URL_EDICAO + full["slug"] + '" title="'+TITULO_EDIT+'" class="text-gray "><i class="'+ICON_EDIT+'"></i> </a>';
                 HTML += '<a href="#" title="'+TITULO_EXC+'" class="text-gray " onclick="excluir_registro(\''+full["slug"]+'\')"> <i class="'+ICON_DELETE+'"></i></a>';
             };
             return HTML;
           }
       },
       {
          "mData": TITULO_DESCR,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-6',
          "mRender": function ( data, type, full ) {
            return full['descricao'];
          }
	   },
       {
          "mData": TITULO_SIGLA,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-3',
          "mRender": function ( data, type, full ) {
            return full['sigla'];
          }
	   },
       {
          "mData": TITULO_PART,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-2',
          "mRender": function ( data, type, full ) {
            return full['part_sel'];
          }
	   },
   ]
  });
}

function consultar(){
  TABELA_CONSULTA.reload();
}

$(function() {
    criar_conceito();
});

function excluir_registro(slug_registro){

  $.dialogs.confirm('', ALERTA_EXC, function() {
    $.ajax({
      url : URL_EXC_CONCEITO,
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
