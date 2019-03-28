var render_vaga_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    var HTML = "<span class='hidden-md-up'><br/>" + renderizar_coluna_status(data, type, full) + "</span>";
    HTML += "<span class='hidden-md-up'><br/>" + renderizar_coluna_quantidades(data, type, full) + "</span>";
    HTML += "<span class='hidden-md-up'><br/><span><b>" + TXT_COL_CONTATO + ":</b>&nbsp;" + renderizar_coluna_contato(data, type, full) + "</span>";
    return HTML;
  };
  return render_vaga_coluna_padrao(data, type, full, extra_render);
}

var renderizar_coluna_contato = function(data, type, full) {
  return !full['contato'] ? TXT_COL_N_INFO : full['contato'];
}

var renderizar_coluna_status = function(data, type, full) {
  var HTML = '';
  HTML += "<span><b>" + TXT_COL_STATUS + ":</b>&nbsp;" + full["status_desc"] + "<br/></span>" +
    "<span>" + TXT_COL_DT_ABERTURA + ":</b>&nbsp;" + full["dt_cadastro"] + "<br/></span>";
  if(full['dt_encerra'] && full['fechada']){
    HTML += "<span>" + TXT_COL_DT_FECHADA + ":</b>&nbsp;" + full['dt_encerra'] + "<br/></span>";
  }
  return HTML;
}

var renderizar_coluna_quantidades = function(data, type, full) {
  var HTML = '';
  HTML += "<span><b>" + TXT_COL_QUANTIDADES + ":</b></span>" +
    "<span><b><br/>-" + TXT_COL_QNT_SOLICITADAS + ":</b>&nbsp;" + full["qtd_solicitada"] + "</span>" +
    "<span><b><br/>-" + TXT_COL_QNT_FECHADAS + ":</b>&nbsp;" + full["qtd_fechada"] + "</span>";
  if (full["encaminhamento"]) {
    HTML += "<span class='hidden-md-up'><b><br/>-" + TXT_COL_QNT_ENCAMINHAMENTO + ":</b>&nbsp;" + full["qtd_encaminhamento"] + "</span>";
  }
  return HTML;
}

function criar_proc_sel() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_PROC_SEL_JSON,
    container: "datatable_proc_sel",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_FUNCAO,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-4 col-xs-11',
        "mRender": render_vaga_coluna
      },
      {
        "mData": TXT_COL_STATUS,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-3 hidden-xs',
        "mRender": renderizar_coluna_status
      },
      {
        "mData": TXT_COL_CONTATO,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 hidden-xs',
        "mRender": renderizar_coluna_contato
      },
      {
        "mData": TXT_COL_QUANTIDADES,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 hidden-xs',
        "mRender": renderizar_coluna_quantidades
      },
      {
        "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-sm-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = '';
          if (full['proc_sel']) {
            HTML += "<span class='cursor_pointer' title='" + TXT_BTN_DETALHES + "' onclick='ver_detalhes(\"" + full["vaga_slug"] + "\")'> <i class='fa fa-eye'></i> </span>";
          }
          if (!full['fechada'] && full['corporativo']) {
            HTML += "<span class='cursor_pointer' title='" + TXT_BTN_SELECAO + "'onclick='selecao_auto(\"" + full["vaga_slug"] + "\")'> <i class='fa fa-user-plus'></i> </span> ";
            if(full['candidaturas']){
              HTML += "<span class='cursor_pointer' title='" + TXT_BTN_FILA_CAND + "' onclick='ver_candidatura(\"" + full["vaga_slug"] + "\")'> <i class='fa fa-users'></i> </span> ";
            }
          }
          return HTML;
        }
      },
    ]
  });
}

function selecao_auto(slug_registro) {
  window.location.href = URL_SELECAO + slug_registro + '/';
}

function ver_candidatura(slug_registro) {
  window.location.href = URL_FILA_CAND + slug_registro + '/';
}

function ver_detalhes(slug_registro) {
  window.location.href = URL_DETALHES + slug_registro + '/';
}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  criar_proc_sel();
});
