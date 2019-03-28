var TABELA_CONSULTA_COMP = undefined;

function editar_comparecimento(slug_registro, checkbox) {
  $.ajax({
    url: URL_EDITAR_COMP,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro,
      compareceu: $(checkbox).is(":checked")
    },
    success: function(dados) {
      if (dados['status'] == 'ok') {
        consultar_comparecimento();
      } else {
        $.dialogs.error(dados['msg']);
        consultar_comparecimento();
      }
    }
  });
}

function remover_comparecimento(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_EXCLUIR_COMP, function() {
    $.ajax({
      url: URL_REMOVER_COMP,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        id: slug_registro,
      },
      success: function(dados) {
        $.dialogs.success(TXT_SUCESSO_EXCLUIR_COMP);
        consultar_comparecimento();
      }
    });
  });
}

function listar_comparecimento() {

  var COLUNAS_TBL = [{
      "mData": TXT_COL_ACOES,
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = ''
        if (!full['fechada'] && PERMITE_DELET_COMP == 'True' && !READONLY) {
          HTML += '<a onclick="remover_comparecimento(\'' + full["num"] + '\')" class="text-gray " title="' + TXT_EXCLUIR_COMP + '" ><i class="' + ICON_EXCLUIR_COMP + '"></i></a> ';
        }

        if (PERMITE_CAND == 'True') {
          HTML += gerar_link_edicao_candidato(full);
        }
        return HTML;

      }
    }, {
      "mData": TXT_COL_DATA_HORA,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 text-center',
      "mRender": function(data, type, full) {
        return '<span value="' + full["hora"] + full["data_us"] + '">' +
          full["data"] + "<br/>" + full["hora"] +
          '</span> ';
      }
    },
    {
      "mData": TXT_COL_CANDIDATO,
      'orderable': true,
      'searchable': true,
      'class': USAFI == 'True' ? 'col-md-3' : 'col-md-4',
      "mRender": render_candidato_coluna_padrao
    },
    {
      "mData": TXT_COL_SELECIONADOR,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        var HTML = '<span>' + full["selecionador"] + '</span>';
        return HTML;
      }
    },
    {
      "sTitle": TXT_COL_COMPARECEU,
      'orderable': false,
      'searchable': false,
      'class': 'col-md-2 text-center big_icons col-xs-1 ',
      "mRender": function(data, type, full) {
        var HTML = ''
        if (PERMITE_EDIT_COMP == 'True') {
          HTML += '<input type="checkbox" ' + (full['compareceu'] ? 'checked' : '') + ' onclick="editar_comparecimento(\'' + full["comparecimento_slug"] + '\', this)">';
        } else {
          HTML += '<input type="checkbox" ' + (full['compareceu'] ? 'checked' : '') + ' disabled="disabled">';
        }
        return HTML;
      }
    },
  ];

  if (USAFI == 'True') {
    COLUNAS_TBL.push({
      "sTitle": TXT_COL_FILA_SELECAO,
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = ''
        if (full['esta_na_fila']) {
          HTML += TXT_SIM;
        }
        return HTML;
      }
    })
  }

  TABELA_CONSULTA_COMP = $.DataTableXenon({
    json: URL_CONS_COMP,
    container: "datatable_comparecimento",
    filterForm: '#filtro_consulta',
    order: [
      [1, "desc"]
    ],
    aoColumns: COLUNAS_TBL,
  });

}

function consultar_comparecimento() {
  TABELA_CONSULTA_COMP.reload();
}

$(function() {
  if (document.URL.match(/comparecimento/)) {
    listar_comparecimento();
  };
  $("#aba_competencia").click(function(e) {
    listar_comparecimento();
  });
});
