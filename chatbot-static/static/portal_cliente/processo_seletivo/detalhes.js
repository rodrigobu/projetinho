var render_candidato_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    var HTML = "<span><b><br/>" + TXT_COL_ESCOLARIDADE + ":</b>&nbsp;" + full["escolaridade"] + "</span>" +
      "<span><b><br/>" + TXT_COL_FUNCOES + ":</b>&nbsp;" + full["funcoes"] + "</span>" +
      "<span class='hidden-md-up'><br/><b>" + TXT_COL_STATUS + ":</b><br/>" + gerar_status(full) + '</span> ';
    if (USA_FASE) {
      HTML += "<span class='hidden-md-up'><br/><b>" + TXT_COL_FASES + ":</b><br/>" + gerar_fases(full) + '</span> ';
    }
    return HTML;
  };
  return render_candidato_coluna_padrao(data, type, full, extra_render);
}

var gerar_status = function(full) {
  var HTML = '';
  HTML += '<span>' + full["aprovacao"] + '</span><br/>';

  if (full['usa_encaminhamento']) {
    HTML += '<span>' + full["encaminhamento"] + '</span> ';
  }
  return HTML;
}

var gerar_fases = function(full) {
  var HTML = '';
  if (full['usa_fase_proc_sel'] && full['fase_proc_sel']) {
    HTML += '<span>' + full["fase_proc_sel"] + '</span> ';
  }
  return HTML;
}

function criar_proc_sel() {

  colunas = [{
      "mData": TXT_COL_CANDIDATO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-6 col-xs-11',
      "mRender": render_candidato_coluna
    },
    {
      "mData": TXT_COL_STATUS,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-2 hidden-xs',
      "mRender": function(data, type, full) {
        return gerar_status(full);
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
  ]

  if (USA_FASE) {
    colunas.push({
      "mData": TXT_COL_FASES,
      'orderable': false,
      'searchable': false,
      'class': 'col-sm-2 hidden-xs',
      "mRender": function(data, type, full) {
        return gerar_fases(full);
      }
    })

  }

  colunas.push({
    "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
    'orderable': false,
    'searchable': false,
    'class': 'col-sm-1 text-center big_icons',
    "mRender": function(data, type, full) {
      var HTML = '';
      HTML += "<span class='cursor_pointer' title='" + TXT_BTN_DETALHES + "' onclick='ver_detalhes(\"" + full["cand_slug"] + "\")'> <i class='fa fa-eye'></i> </span> ";
      HTML += "<span class='cursor_pointer' title='" + TXT_BTN_LISTA_PARECER + "' onclick='listagem_parecer(\"" + full["cand_slug"] + "\",\"" + full["vaga_slug"] + "\")'> <i class='fa fa-list'></i> </span> ";

      if (full['usa_corporativo']) {
        HTML += "<span class='cursor_pointer' title='" + TXT_BTN_LANCAR_RESTRICAO + "' onclick='form_restricao(\"" + full["cand_slug"] + "\")'> <i class='fa fa-scissors'></i> </span> ";
      }

      if (full['usa_corporativo'] && !full['tem_restricao'] && !full['fechada']) {

        if (!full['aprovado']) {
          HTML += "<span class='text-success cursor_pointer' title='" + TXT_BTN_APROVAR + "' onclick='form_aprovacao(\"" + full["slug"] + "\")'> <i class='fa fa-check'></i> </span> ";
        } else {
          HTML += "<span class='text-danger cursor_pointer' title='" + TXT_BTN_DESAPROVAR + "' onclick='salvar_desaprovacao(\"" + full["slug"] + "\")'> <i class='fa fa-close'></i> </span> ";
        }

        if (full['usa_encaminhamento']) {
          if (!full['encaminhado']) {
            HTML += "<span class='text-success cursor_pointer' title='" + TXT_BTN_ENCAMINHAR + "' onclick='encaminhar(\"" + full["slug"] + "\")'> <i class='linecons-paper-plane'></i> </span> ";
          } else {
            HTML += "<span class='text-danger cursor_pointer' title='" + TXT_BTN_DESENCAMINHAR + "' onclick='desencaminhar(\"" + full["slug"] + "\")'> <i class='linecons-paper-plane'></i> </span> ";
          }
        }

      }

      return HTML;
    }
  })

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_PROC_SEL_JSON,
    container: "datatable_proc_sel",
    filterForm: '#filtro_consulta',
    aoColumns: colunas
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

function voltar_detalhes() {
  $("#datatable_proc_sel").show();
  $("#detalhes_proc_sel").hide().html("");
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
      $("#datatable_proc_sel").hide();
      $("#detalhes_proc_sel").html(dados["html"]).show();
      $("#id_btn_voltar").click(voltar_detalhes);
    }
  });
}

function listagem_parecer(slug_registro, slug_vaga) {
  window.location.href = URL_LISTAGEM_PARECER + slug_registro + '/b/' + slug_vaga + '/';
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  criar_proc_sel();
  injeta_src_candidato();
});
