var render_cliente_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    var HTML = "<span  class='hidden-md-up'><br/><b>" + FUNCAO + ":</b>&nbsp;" + render_vaga_coluna_padrao(data, type, full) + "<br/></span>" +
      "<span class='hidden-md-up'>" + render_status(data, type, full) + "</span>" +
      "<span class='hidden-md-up'>" + render_datas(data, type, full) + "</span>" +
      "<span class='hidden-md-up'><b><br/>" + TXT_COL_QUANTIDADES + ":</b>" + render_quantidades(data, type, full) + '</span>';
    return HTML;
  };
  return render_cliente_coluna_padrao(data, type, full, extra_render);
}

var render_status = function(data, type, full) {
  var HTML = '';
  HTML += "<span><b>" + STATUS + ":</b>&nbsp;" + full["status_desc"] + "<br/></span>";
  return HTML;
}

var render_datas = function(data, type, full) {
  var HTML = '';
  HTML += '<span value="' + full["dt_abertura_us"] + '"><b>' + TXT_COL_DT_ABERTURA + ":</b>&nbsp;" + full["dt_abertura"] + '<br/></span>';
  if (full["dt_encerra"])
    HTML += '<span value="' + full["dt_encerra_us"] + '"><b>' + TXT_COL_DT_FECHADA + ':</b>&nbsp;' + full["dt_encerra"] + '<br/></span>';
  return HTML;
}

var render_quantidades = function(data, type, full) {
  var HTML = "<span><b>" + TXT_COL_QNT_SOLICITADAS + ":</b>&nbsp;" + full["qtd_solicitada"] + "</span>" +
    "<span><b><br/>" + TXT_COL_QNT_FECHADAS + ":</b>&nbsp;" + full["qtd_fechada"] + "</span>";
  if (full["encaminhamento"]) {
    HTML += "<span><b><br/>" + TXT_COL_QNT_ENCAMINHAMENTO + ":</b>&nbsp;" + full["qtd_encaminhamento"] + "</span>"
  }
  return HTML;
}

function consultar() {

  var COLUNAS_TBL = [
     {
        "mData": TXT_COL_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'text-center big_icons col-sm-1',
        "mRender": function(data, type, full) {
          var HTML = '';
          HTML += gerar_link_edicao_cliente(full);
          HTML += gerar_link_edicao_vaga(full);
          HTML += '<a title="'+ TXT_REALIZA_MANUTENCAO +'" href="'+
              URL_MANUTENCAO + full['vaga_slug']
              + '" target="_blank" class="text-gray"><i class="'+ ICONE_MANUTENCAO +'"></i></a> ';
          return HTML;
        }
    },
    {
      "mData": TXT_COL_VAGA,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3 hidden-xs',
      "mRender": render_vaga_coluna_padrao
    }, {
      "mData": TXT_COL_CLIENTE,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-4 col-xs-12',
      "mRender": render_cliente_coluna
    },
    {
      "mData": STATUS,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 hidden-xs',
      "mRender": render_status
    },
    {
      "mData": TXT_COL_DATAS,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2 hidden-xs',
      "mRender": render_datas
    }
  ];

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_vagas",
    filterForm: '#filtro_vagas',
    order: [[1, "asc"]],
    aoColumns: COLUNAS_TBL
  });

}

function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}



$(function() {

  $("#id_cliente").change(function() {
    if ($("#id_cliente").val() != '') {
      //$("#div_vagas_status").show();
      recarrega_consultar();
    } else {
      //$("#div_vagas_status").hide();
      recarrega_consultar();
    }
  });
  //$("#div_vagas_status").hide();
  $("#id_vagas_status").change(recarrega_consultar);
  $("#id_data_entrada").change(recarrega_consultar);
  consultar();
});
