function criar_vagas_requisitadas() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_REQUISITADAS_JSON,
    container: "datatable_vagas_requisitadas",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_DT,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2 hidden-xs',
        "mRender": function(data, type, full) {
          return full['dt_cadastro'];
        }
      }, {
        "mData": TXT_COL_FUNCAO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-6 col-xs-12',
        "mRender": function(data, type, full) {
          var HTML = "<span><b>" + full["funcao"] + "</b></span>" +
            "<span class='hidden-md-up'><b><br/>" + TXT_COL_DT + ":</b>&nbsp;" + full["dt_cadastro"] + "</span>" +
            "<span class='hidden-md-up'><b><br/>" + TXT_COL_REQUISITANTE + ":</b>&nbsp;" + full["solicitante"] + "</span>" +
            "<span class='hidden-md-up'><b><br/>" + TXT_COL_STATUS + ":</b>&nbsp;" + full["status_desc"] + "</span>";
          return HTML;
        }
      },
      {
        "mData": TXT_COL_REQUISITANTE,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2 hidden-xs',
        "mRender": function(data, type, full) {
          return full['solicitante'];
        }
      },
      {
        "mData": TXT_COL_STATUS,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2 hidden-xs',
        "mRender": function(data, type, full) {
          return full['status_desc'];
        }
      },
    ]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  criar_vagas_requisitadas();
});
