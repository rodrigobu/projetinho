var renderizar_coluna_status = function(data, type, full) {
  var HTML = '';
  HTML += "<span><b>" + TXT_COL_STATUS + ":</b>&nbsp;" + full["status_desc"] + "<br/></span>";
  if (!full["fechada"]) {
    HTML += "<span><b>" + TXT_COL_DIAS_ABERTA + ":</b>&nbsp;</span><span style=' padding:5px; color:black; background-color:" + full["cor_dias_aberta"] + "'>" + full["dias_aberta"] + "</span><br/>";
  }
  HTML += '<span value="' + full["dt_abertura_us"] + '"><b>' + TXT_COL_DT_ABERTURA + ":</b>&nbsp;" + full["dt_abertura"] + '<br/></span>';
  if (full["fechada"]) {
    HTML += '<span value="' + full["dt_encerra_us"] + '"><b>' + TXT_COL_DT_FECHADA + ':</b>&nbsp;' + full["dt_encerra"] + '<br/></span>';
  }
  return HTML;
}


var renderizar_quantidades = function(data, type, full) {
  var HTML = "<span><b>" + TXT_COL_QNT_SOLICITADAS + ":</b>&nbsp;" + full["qtd_solicitada"] + "</span>" +
    "<span><b><br/>" + TXT_COL_QNT_FECHADAS + ":</b>&nbsp;" + full["qtd_fechada"] + "</span>" +
    "<span><b><br/>" + TXT_COL_QNT_PROC_SEL + ":</b>&nbsp;" + (full["qtd_proc_sel"] ? full["qtd_proc_sel"] : '0') + "</span>";
  if (full["encaminhamento"]) {
    HTML += "<span><b><br/>" + TXT_COL_QNT_ENCAMINHAMENTO + ":</b>&nbsp;" + (full["qtd_encaminhamento"] ? full["qtd_encaminhamento"] : '0') + "</span>"
  }
  return HTML;
}

var renderizar_escolaridade = function(data, type, full) {
  if (full["escolaridade_ini"])
    return full["escolaridade_ini"] + (full["nivel_ini"] ? " (" + full["nivel_ini"] + ") " : '');
  return "";
}

var renderizar_logradouro = function(data, type, full) {
  return (full["estado"] ? full["estado"] : '') +
    (full["cidade"] ? " - " + full["cidade"] : '') +
    (full["bairro"] ? " - " + full["bairro"] : '');
}

var COLUNAS = {
  'cliente': {
    "mData": TXT_COL_CLIENTE,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": render_cliente_coluna_padrao
  },
  'descricao_contrato': {
    "mData": TXT_COL_DESCCONT,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": render_vaga_coluna_padrao
  },
  'status_vaga': {
    "mData": TXT_COL_STATUS,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": renderizar_coluna_status
  },
  'quantidades': {
    "mData": TXT_COL_QUANTIDADES,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": renderizar_quantidades
  },
  'tipo_vaga': {
    "mData": TXT_COL_TIPO_VAGA,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full["tipo_vaga"];
    }
  },
  'resp_selecao': {
    "mData": TXT_COL_RESP_SELECAO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full["resp_selecao"];
    }
  },
  'escolaridade': {
    "mData": TXT_COL_ESCOLARIDADE,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": renderizar_escolaridade
  },
  'logradouro': {
    "mData": TXT_COL_LOGRADOURO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": renderizar_logradouro
  },

}



function consultar() {

  var COLUNAS_TBL = [{
    "mData": TXT_COL_ACOES,
    'orderable': false,
    'searchable': false,
    'class': 'text-center big_icons',
    "mRender": function(data, type, full) {
      var HTML = '';
      HTML += gerar_link_edicao_cliente(full);
      HTML += gerar_link_edicao_vaga(full);
      if (PERM_EXEC_SELECAO) {
        HTML += '<a class="text-gray" href="' + URL_SELECAO_CAND_VAGA + full["vaga_slug"] + '" title="' + TXT_COL_SELECAO + '" target="_blanc"><i class="' + ICONE_SELECAO_CAND + '"></i> </a> ';
      }
      return HTML;
    }
  }];

  $.each(COLUNAS_CONFIGURADAS, function(idx, value) {
    coluna = COLUNAS[value];
    if(coluna){
      COLUNAS_TBL.push(coluna);
    }
  });

  if (COLUNAS_TBL.length == 0) {
    COLUNAS_TBL.push(COLUNAS['descricao_contrato']);
  }


  var tamanho = ( 327.37 * COLUNAS_CONFIGURADAS.length ) + "px";
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_consulta",
    filterForm: '#filtro_consulta',
    aoColumns: COLUNAS_TBL,
    order: [
      [1, "desc"]
    ],
    custom_width: tamanho,
    complete: function(){
      $("#table_datatable_consulta").css("width", tamanho );
      $("#table_datatable_consulta").css("min-width", "100%" );
      $("#table_datatable_consulta").parent().remove("col-sm-12");
      $("#table_datatable_consulta").parent().css("overflow-x", "scroll");
    }
  });

}

function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  consultar();
  $("#id_minhas_vagas").change(recarrega_consultar)
});
