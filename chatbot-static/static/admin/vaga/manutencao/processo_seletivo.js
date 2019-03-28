function listar_processo_seletivo() {
  colunas = [
    {
        "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-sm-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = '';
          HTML += '<a title="' + TXT_REALIZA_MANUTENCAO + '" href="' + URL_MANUTENCAO_PROC_SEL + full['num'] + '" class="text-gray"><i class="' + ICONE_MANUTENCAO + '"></i></a> ';
          return HTML;
        }
    },
   {
      "mData": TXT_COL_CANDIDATO,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-6 col-xs-10',
      "mRender": render_candidato_coluna_padrao
    },
    {
      "mData": TXT_COL_STATUS,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-5 hidden-xs',
      "mRender": function(data, type, full) {
        var HTML = '';
        HTML += '<span>' + TXT_COL_APROVADO + ": " + full["aprovado"] + '</span><br/>';

        if (full['usa_encaminhamento']) {
          HTML += '<span>' + TXT_COL_ENCAMINHADO + ": " + full["encaminhado"] + '</span> ';
        }
        return HTML;
      }
    }
  ]

  TABELA_CONSULTA_PROC_SEL = $.DataTableXenon({
    json: URL_PROCESSO_SELETIVO_JSON,
    container: "datatable_processo_seletivo",
    filterForm: '#filtro_consulta',
    order: [[1, "asc"]],
    aoColumns: colunas
  });
}

function consultar_processo_seletivo() {
  TABELA_CONSULTA_PROC_SEL.reload();
}
