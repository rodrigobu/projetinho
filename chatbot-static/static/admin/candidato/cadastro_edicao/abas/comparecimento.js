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

  var COLUNAS_TBL = [];

  if (!READONLY) {
    COLUNAS_TBL.push({
      "mData": TITULO_ACOES,
      'orderable': false,
      'searchable': false,
      'class': 'text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = ''
        if (USAFI && !full['esta_na_fila']) {
          HTML += '<a href="' + URL_EDIT_FILA_SELECAO + full["comparecimento_slug"] + '" class="text-gray" title="' + TXT_INSERIR + '"><i class="' + ICONE_FILA_SELECAO + '"></i></a> ';
        }
        HTML += '<a onclick="remover_comparecimento(\'' + full["comparecimento_slug"] + '\')" class="text-gray " title="' + TITULO_EXC + '" ><i class="' + ICON_EXC + '"></i></a> ';
        if (VALID_VAGA == 'True') {
          HTML += gerar_link_edicao_vaga(full);
        }
        return HTML;

      }
    })
  }

  COLUNAS_TBL.push({
    "sTitle": TXT_COL_COMPARECEU,
    'orderable': false,
    'searchable': false,
    'class': 'text-center big_icons',
    "mRender": function(data, type, full) {
      var HTML = ''
      if (!READONLY) {
        HTML += '<input type="checkbox" ' + (full['compareceu'] ? 'checked' : '') + ' onclick="editar_comparecimento(\'' + full["comparecimento_slug"] + '\', this)">';
      } else {
        HTML += '<input type="checkbox" ' + (full['compareceu'] ? 'checked' : '') + ' disabled>';
      }
      return HTML;
    }
  });
  COLUNAS_TBL.push({
    "mData": TXT_COL_DATA_HORA,
    'orderable': true,
    'searchable': true,
    'class': 'text-center',
    "mRender": function(data, type, full) {
      return '<span value="' + full["hora"] + full["data_us"] + '">' +
        full["data"] + "<br/>" + full["hora"] + '</span> ';
    }
  });
  COLUNAS_TBL.push({
    "mData": TXT_COL_CLIENTE,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": render_cliente_coluna_padrao
  });
  COLUNAS_TBL.push({
    "mData": TXT_COL_VAGA,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": render_vaga_coluna_padrao
  });
  COLUNAS_TBL.push({
    "mData": TXT_COL_SELECIONADOR,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      var HTML = '<span>' + full["selecionador"] + '</span>';
      return HTML;
    }
  })

  if (USAFI) {
    COLUNAS_TBL.push({
      "sTitle": TXT_COL_FILA_SELECAO,
      'orderable': false,
      'searchable': false,
      'class': 'text-center big_icons',
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
    aoColumns: COLUNAS_TBL,
    order: [
      [2, "asc"]
    ],
    complete: function() {
      $("#table_datatable_comparecimento").css("width", (150 * 10) + "px");
      $("#table_datatable_comparecimento").css("min-width", "100%");
      $("#table_datatable_comparecimento").parent().remove("col-sm-12");
      $("#table_datatable_comparecimento").parent().css("overflow-x", "scroll");
    },
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
