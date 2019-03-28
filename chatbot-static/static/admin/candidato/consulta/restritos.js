
var render_dt_restricao = function(data, type, full) {
  return '<span value="' + full['data_restricao_us'] + '">' + full['data_restricao'] + '</span>';
}

var render_cliente_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    var HTML = '';
    HTML += "<span  class='hidden-md-up'><br/><b>" + TXT_COL_CANDIDATO + ":</b>&nbsp;" + render_candidato_coluna_padrao(data, type, full) + "</span>";
    HTML += "<span  class='hidden-md-up'><br/><b>" + TXT_COL_DT_RESTICAO + ":</b>&nbsp;" + render_dt_restricao(data, type, full) + "</span>";
    return HTML;
  };
  return render_cliente_coluna_padrao(data, type, full, extra_render);
}

function consultar() {

  var COLUNAS_TBL = [
      {
        "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += gerar_link_edicao_candidato(full);
          HTML += gerar_link_edicao_cliente(full);
          HTML += '<span title="' + TITULO_DET + '" class="text-gray " onclick="ver_detalhes(\'' + full["restricao_slug"] + '\')"><i class="' + ICON_DET + '"></i> </span>';
          HTML += '<span title="' + TITULO_EXC + '" class="text-gray " onclick="remover(\'' + full["restricao_slug"] + '\')"><i class="' + ICON_EXC + '"></i> </span>';
          return HTML;
        }
    },
    {
        "mData": TXT_COL_CLIENTE,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4 col-xs-11',
        "mRender": render_cliente_coluna
      },
      {
        "mData": TXT_COL_CANDIDATO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4 hidden-xs',
        "mRender": render_candidato_coluna_padrao
    },
    {
      "mData": TXT_COL_DT_RESTICAO,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 text-center hidden-xs',
      "mRender": render_dt_restricao
    }
];

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


function ver_detalhes(slug_registro) {
  $.ajax({
    url: URL_DETALHES,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro
    },
    success: function(dados) {
      $("#datatable_consulta").hide();
      $("#detalhes_consulta").html(dados["html"]).show();
      $("#id_btn_voltar").click(voltar_detalhes);
    }
  });
}


function recarrega_consultar() {
  TABELA_CONSULTA.reload();
  $("#datatable_consulta").show();
  $("#detalhes_consulta").hide().html("");
}

function voltar_detalhes() {
  $("#datatable_consulta").show();
  $("#detalhes_consulta").hide().html("");
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
          consultar();
        } else {
          $.dialogs.error(dados['msg']);
        }
      }
    });
  });
}

$(function() {
  consultar();
  injeta_src_candidato();
});
