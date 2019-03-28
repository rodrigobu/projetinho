var TABELA_CONSULTA = undefined;

function listar_promotor() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_PROMOTOR,
    container: "datatable_promotores",
    filterForm: '#filtro_consulta',
    aoColumns: [
      {
        "mData": TITULO_ATE_QUANDO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return "<span value='"+full['dt_atualizacao_formatus']+"'>" +full['dt_atualizacao_format']+"</span>";
        }
      },{
        "mData": TITULO_PROMOTOR,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-8',
        "mRender": function(data, type, full) {
          return full['promotor'];
        }
      }
    ]
  });
}

function consultar_promotor() {
  TABELA_CONSULTA.reload();
}


$(function() {
    listar_promotor();
});
