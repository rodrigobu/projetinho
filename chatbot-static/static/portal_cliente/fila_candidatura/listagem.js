var render_candidato_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    return " <span><b><br/>" + TXT_COL_ESCOLARIDADE + ":</b>&nbsp;" + full["escolaridade"] + "</span>" +
      " <span><b><br/>" + TXT_COL_FUNCOES + ":</b>&nbsp;" + full["funcoes"] + "</span>" +
      " <span class='hidden-md-up'><b><br/>" + TXT_COL_TRABALHANDO + ":</b>&nbsp;" + full["trabalhando"] + "</span>" +
      " <span class='hidden-md-up'><br/><b>" + TXT_COL_DATA + ":</b>&nbsp;" + full["dt_candidatura"] + '</span> ' +
      " <span class='hidden-md-up'><br/><b>" + TXT_COL_CIDADE_ESTADO + ":</b>&nbsp;" + full["cand_cidade"] + " " + full["cand_estado"] + '</span> ' +
      " <span class='hidden-md-up'><br/>" + gerar_cv_link(full) + '</span> ';
  };
  return render_candidato_coluna_padrao(data, type, full, extra_render);
}

function criar_fila_cand() {

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_FILA_CAND_JSON,
    container: "datatable_fila_cand",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_NOME,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-4 col-xs-11',
        "mRender": render_candidato_coluna
      },  {
          "sTitle": "<span class='hidden-xs' title="+TXT_COL_DATA+">D.C.</span>",
          'orderable': true,
          'searchable': true,
          'class': 'col-sm-1 hidden-xs text-center',
          "mRender": function(data, type, full) {
            return "<span value='"+ full["dt_candidatura_us"]+"'><br/>" +  full["dt_candidatura"] + '</span> '
          }
        },
      {
        "mData": TXT_COL_CURRICULO,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-1 hidden-xs text-center',
        "mRender": function(data, type, full) {
          return gerar_cv_link(full);
        }
      },
      {
        "sTitle": TXT_COL_TRABALHANDO,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 hidden-xs',
        "mRender": function(data, type, full) {
          return full["trabalhando"];
        }
      },
      {
        "sTitle":  TXT_COL_CIDADE_ESTADO,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 hidden-xs',
        "mRender": function(data, type, full) {
          return full["cand_cidade"] +" "+  full["cand_estado"] ;
        }
      },
      {
        "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-xs-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = '';
          HTML += "<span class='cursor_pointer' title='" + TXT_BTN_SELECIONAR + "' onclick='selecionar(\"" + full["fila_slug"] + "\")'> <i class='"+ ICON_SELECIONAR +"'></i> </span>";
          HTML += "<span class='cursor_pointer' title='" + TXT_BTN_DETALHES + "' onclick='ver_detalhes(\"" + full["cand_slug"] + "\")'> <i class='"+ ICON_DET +"'></i> </span> ";
          HTML += "<span class='cursor_pointer' title='" + TXT_BTN_REMOVER + "' onclick='remover(\"" + full["fila_slug"] + "\")'> <i class='"+ ICON_EXC +"'></i> </span> ";

          return HTML;
        }
      },
    ]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
  $("#datatable_fila_cand").show();
  $("#detalhes_fila_cand").hide().html("");
}


function ver_detalhes(slug_registro) {
  $.ajax({
    url: URL_DETALHES_COLAB,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro
    },
    success: function(dados) {
      $("#datatable_fila_cand").hide();
      $("#detalhes_fila_cand").html(dados["html"]).show();
      $("#id_btn_voltar").click(voltar_detalhes);
    }
  });
}

function voltar_detalhes() {
  $("#datatable_fila_cand").show();
  $("#detalhes_fila_cand").hide().html("");
}

function remover(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_ENCERRA, function() {
    $.ajax({
      url: URL_EXCLUIR_COLAB,
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

function selecionar(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_ADICIONAR, function() {
    $.ajax({
      url: URL_ADICIONAR_COLAB,
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
  $("#id_btn_filtrar").click(consultar);
  criar_fila_cand();

  set_cidades_do_estado('#id_estado', '#id_cidade');
  $(".collapse-icon:first").click();

  $("#id_funcoes").change(function() {
    if ($(this).val() != undefined) {
      $("#div_tempo_experiencia").show();
    } else {
      $("#div_tempo_experiencia").hide();
    }
  });
  $("#id_funcoes").change();

  injeta_src_candidato();
})
