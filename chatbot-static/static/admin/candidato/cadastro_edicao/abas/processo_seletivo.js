var TABELA_CONSULTA_PS = undefined;

function listar_processo_seletivo() {

  var COLUNAS_TBL = [{
    "mData": TITULO_ACOES,
    'orderable': false,
    'searchable': false,
    'class': 'text-center big_icons',
    "mRender": function(data, type, full) {
      var HTML = ''
      HTML += '<a href="' + URL_DETALHES_PS + full["num"] + '" title="' + TITULO_DETALHES + '" class="text-gray "><i class="' + ICON_DETALHES + '"></i> </a>';

      if (VALID_VAGA == 'True') {
        HTML += gerar_link_edicao_vaga(full);
      }
      if (VALID_CLIENTE == 'True') {
        HTML += gerar_link_edicao_cliente(full);
      }
      return HTML;

    }}, {
      "mData": TXT_COL_VAGA,
      'orderable': true,
      'searchable': true,
      'class': '',
      "mRender": render_vaga_coluna_padrao
    },
    {
      "mData": TXT_COL_CLIENTE,
      'orderable': true,
      'searchable': true,
      'class': '',
      "mRender": render_cliente_coluna_padrao
    },
  ];

  if (MOD_ETAPA == 'True') {
    COLUNAS_TBL.push({
      "mData": TXT_COL_ETAPA,
      'orderable': true,
      'searchable': true,
      'class': '',
      "mRender": function(data, type, full) {
        return full['etapa'];
      }
    }, );
  }

  if (MOD_ENCAM == 'True') {
    COLUNAS_TBL.push({
      "mData": TXT_COL_ENCAM,
      'orderable': true,
      'searchable': true,
      'class': '',
      "mRender": function(data, type, full) {
        return full['encaminhado'];
      }
    }, );
  }

  COLUNAS_TBL.push({
    "mData": TXT_COL_APROV,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['aprovado'];
    }
  });

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONS_PS,
    container: "datatable_processo_seletivo",
    filterForm: '#filtro_consulta',
    aoColumns: COLUNAS_TBL,
    order: [
      [2, "asc"]
    ],
    complete: function() {
      $("#table_datatable_processo_seletivo").css("width", (140 * 10) + "px");
      $("#table_datatable_processo_seletivo").css("min-width", "100%");
      $("#table_datatable_processo_seletivo").parent().remove("col-sm-12");
      $("#table_datatable_processo_seletivo").parent().css("overflow-x", "scroll");
    },
  });

}

function consultar_processo_seletivo() {
  TABELA_CONSULTA_PS.reload();
}

$(function() {
  if (document.URL.match(/processo_seletivo/)) {
    listar_processo_seletivo();
  };
  $("#aba_competencia").click(function(e) {
    listar_processo_seletivo();
  });
});
