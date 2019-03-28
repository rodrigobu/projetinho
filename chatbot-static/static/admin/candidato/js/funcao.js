function listar_funcao(){
  TABELA_CONSULTA_FUNCAO = $.DataTableXenon({
  	json : URL_CONSULTA_FUNCAO,
  	container: "datatable_funcao",
    filterForm: '#filtro_consulta',
    aoColumns: [
       {
          "mData": 'TITULO_FUNCAO',
		  'orderable': true,
          'searchable': true,
          'class':'col-md-4',
          "mRender": function ( data, type, full ) {
            return '';
          }
	   },
       {
          "mData": 'TITULO_NIVEL',
		  'orderable': true,
          'searchable': true,
          'class':'col-md-4',
          "mRender": function ( data, type, full ) {
            return '';
          }
	   },
       {
          "mData": TITULO_ACOES,
          'orderable': false,
          'searchable': false,
          'class':'col-md-1 text-center big_icons',
          "mRender": function ( data, type, full ) {
            return '';
          }
    	  },
   ]
  });
}

$(function() {
    listar_funcao();
});
