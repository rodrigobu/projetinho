function criar_historico_ocorrencia(){
  var aoColumns_descr = {
     "mData": TITULO_DESCR,
     'orderable': true,
     'searchable': true,
     'class':'col-md-7',
     "mRender": function ( data, type, full ) {
       return full['descricao'];
     }
  }

  var aoColumns_mostra = {
     "mData": TITULO_MOSTR,
     'orderable': true,
     'searchable': true,
     'class':'col-md-3',
     "mRender": function ( data, type, full ) {
       return full['mostra_portal_cliente'];
     }
   }

   var aoColumns_acao = {
       "mData": TITULO_ACOES,
       'orderable': false,
       'searchable': false,
       'class':'col-md-2 text-center big_icons',
       "mRender": function ( data, type, full ) {
         var HTML = ''
         HTML += '<a href="'+ URL_EDICAO + full["slug"] + '" title="'+TITULO_EDIT+'" class="text-gray "><i class="'+ICON_EDIT+'"></i> </a>';
         HTML += '<a href="#" title="'+TITULO_EXC+'" class="text-gray " onclick="excluir_registro(\''+full["slug"]+'\')"> <i class="'+ICON_DELETE+'"></i></a>';
         return HTML;
       }
    }

  var aoColumns_plus = [aoColumns_acao, aoColumns_descr]
  if (USA_PORTAL_CLIENTE=='True'){
    var aoColumns_plus = [aoColumns_acao, aoColumns_descr, aoColumns_mostra]
  }

  TABELA_CONSULTA = $.DataTableXenon({
  	json : URL_CONSULTA,
  	container: "datatable_historico_ocorrencia",
    filterForm: '#filtro_consulta',
    order: [[1, "asc"]],
    aoColumns: aoColumns_plus
  });
}

function consultar(){
  TABELA_CONSULTA.reload();
}

$(function() {
    criar_historico_ocorrencia();
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
