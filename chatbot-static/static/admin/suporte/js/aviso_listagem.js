function criar_aviso(){
  TABELA_CONSULTA = $.DataTableXenon({
  	json : URL_CONSULTA,
  	container: "datatable_aviso",
    filterForm: '#filtro_consulta',
    order: [[0, "desc"]],
    aoColumns: [
        {
           "mData": '',
           'orderable': false,
           'searchable': false,
           'visible': false,
           "mRender": function ( data, type, full ) {
             return full['dt_cadastro'];
           }
        },
        {
           "mData": "Ações",
           'orderable': false,
           'searchable': false,
           'class':'col-md-2 text-center big_icons',
           "mRender": function ( data, type, full ) {
             var HTML = ''
             HTML += '<a href="'+ URL_EDICAO + full["slug"] + '" title="'+TITULO_EDIT+'" class="text-gray "><i class="'+ICON_EDIT+'"></i> </a>';
             HTML += '<a href="#" title="'+TITULO_EXC+'" class="text-gray " onclick="excluir_registro(\''+full["slug"]+'\')"> <i class="'+ICON_DELETE+'"></i></a>';
             if (full['link_externo']!=''){
                HTML += '<a href="' + full['link_externo'] + '" title="' + TITULO_LINK + '" class="text-gray" target="_blank" style="cursor: pointer;"> <i class="' + ICON_LINK + '"></i> </a>';
             }
             return HTML;
           }
       },
       {
          "mData": TITULO_MSG,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-6',
          "mRender": function ( data, type, full ) {
            return full['titulo'];
          }
	   },
       {
          "mData": TITULO_DT_PUBL,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-2',
          "mRender": function ( data, type, full ) {
            return full['data_cadastro'];
          }
	   },
       {
          "mData": TITULO_DT_EXP,
		  'orderable': true,
          'searchable': true,
          'class':'col-md-2',
          "mRender": function ( data, type, full ) {
            return full['data_expiracao'];
          }
	   },

   ]
  });
}

function consultar(){
  TABELA_CONSULTA.reload();
}

$(function() {
    criar_aviso();
});

function excluir_registro(slug_registro){
    alert(slug_registro)
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
