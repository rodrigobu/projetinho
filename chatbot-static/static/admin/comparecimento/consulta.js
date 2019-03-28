var render_data_hora = function(data, type, full) {
  return '<span value="' + full["hora"] + full["data_us"] + '">' +
    full["data"] + "<br/>" + full["hora"] +
    '</span> ';
}

var render_candidato_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    var HTML = '';
    HTML += "<span  class='hidden-md-up'><br/><b>" + TXT_COL_DATA_HORA + ":</b>&nbsp;" + render_data_hora(data, type, full) + "</span>";
    HTML += "<span  class='hidden-md-up'><br/><b>" + TXT_COL_VAGA + ":</b>&nbsp;" + render_vaga_coluna_padrao(data, type, full) + "</span>";
    HTML += "<span  class='hidden-md-up'><br/><b>" + TXT_COL_SELECIONADOR + ":</b>&nbsp;" + render_selecionador(data, type, full) + "</span>";
    if (USAFI) {
      HTML += "<span  class='hidden-md-up'><br/><b>" + TXT_COL_FILA_SELECAO + ":</b>&nbsp;" + render_fila_selecao(data, type, full) + "</span>";
    }
    return HTML;
  };
  return render_candidato_coluna_padrao(data, type, full, extra_render);
}


var render_selecionador = function(data, type, full) {
  var HTML = '<span>' + full["selecionador"] + '</span>';
  return HTML;
}

var render_compareceu = function(data, type, full) {
  var HTML = ''
  HTML += '<input type="checkbox" ' + (full['compareceu'] ? 'checked' : '') + ' onclick="editar_comparecimento(\'' + full["comparecimento_slug"] + '\', this)">';
  return HTML;
}

var render_fila_selecao = function(data, type, full) {
  var HTML = ''
  if (full['esta_na_fila']) {
    HTML += TXT_SIM;
  }
  return HTML;
}

function consultar() {

  var COLUNAS_TBL = [
      {
        "sTitle": "<span class='hidden-xs'>" + TITULO_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 col-xs-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += gerar_link_edicao_candidato(full);
          HTML += gerar_link_edicao_vaga(full);

          if (!full['esta_na_fila']) {
            HTML += '<a href="' + URL_EDIT_FILA_SELECAO + full["comparecimento_slug"] + '" class="text-gray" title="' + TXT_INSERIR + '"><i class="' + ICONE_FILA_SELECAO + '"></i></a> ';
          }

          HTML += '<a onclick="remover(\'' + full["comparecimento_slug"] + '\')" class="text-gray " title="' + TITULO_EXC + '" ><i class="' + ICON_EXC + '"></i></a> ';
          return HTML;
        }
    },
    {
      "mData": TXT_COL_DATA_HORA,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-1 text-center hidden-xs',
      "mRender": render_data_hora
    },
    {
      "mData": TXT_COL_CANDIDATO,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3 col-xs-10 ',
      "mRender": render_candidato_coluna
    },
    {
      "mData": TXT_COL_VAGA,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 hidden-xs',
      "mRender": render_vaga_coluna_padrao
    },
    {
      "mData": TXT_COL_SELECIONADOR,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-1  hidden-xs',
      "mRender": render_selecionador
    },
    {
      "sTitle": "<span class='hidden-xs'>" + TXT_COL_COMPARECEU + "</span>",
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons col-xs-1 ',
      "mRender": render_compareceu
    },
  ];

  if (USAFI) {
    COLUNAS_TBL.push({
      "sTitle": TXT_COL_FILA_SELECAO,
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center big_icons hidden-xs',
      "mRender": render_fila_selecao
    })
  }

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_consulta",
    filterForm: '#filtro_consulta',
    order: [
      [1, "asc"]
    ],
    aoColumns: COLUNAS_TBL
  });

}


function editar_comparecimento(slug_registro, checkbox) {
  $.ajax({
    url: URL_EDITAR,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro,
      compareceu: $(checkbox).is(":checked")
    },
    success: function(dados) {
      if (dados['status'] == 'ok') {
        recarrega_consultar();
      } else {
        $.dialogs.error(dados['msg']);
        recarrega_consultar();
      }
    }
  });
}


function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}


function remover(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_EXCLUIR, function() {
    $.ajax({
      url: URL_EXCLUIR,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro,
      },
      success: function(dados) {
        if (dados['status'] == 'ok') {
          $.dialogs.success(dados['msg']);
          recarrega_consultar();
        } else {
          $.dialogs.error(dados['msg']);
        }
      }
    });
  });
}


$(function() {
  $("#id_data").change(recarrega_consultar);
  consultar();
  injeta_src_candidato();
});
