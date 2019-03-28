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
    order: [
      [2, "asc"]
    ],
    aoColumns: [{
      "sTitle": "<input class='center' name='selecionar-todas' type='checkbox'>",
      'sType': 'html',
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center',
      "mRender": function(data, type, full) {
        return "<input class='center checkbox_colab' id='" + full["cand_id"] + "' name='selecionar-cand' type='checkbox'>";
      }
    }, {
      "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
      'orderable': false,
      'searchable': false,
      'class': 'col-xs-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = '';
        HTML += gerar_link_edicao_candidato(full);
        HTML += "<a title='" + TXT_BTN_SELECIONAR + "' onclick='selecionar(\"" + full["fila_slug"] + "\")' class='text-gray'> <i class='"+ ICON_SELECIONAR +"'></i></span> ";
        HTML += "<a title='" + TITULO_DET + "' onclick='ver_detalhes(\"" + full["cand_slug"] + "\")' class='text-gray'> <i class='"+ ICON_DET +"'></i></span> ";
        HTML += "<a title='" + TXT_BTN_REMOVER + "' onclick='remover(\"" + full["fila_slug"] + "\")' class='text-gray'> <i class='"+ ICON_EXC +"'></i></span> ";

        return HTML;
      }
  }, {
      "mData": TXT_COL_NOME,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-4 col-xs-11',
      "mRender": render_candidato_coluna
    }, {
      "sTitle": "<span class='hidden-xs' title=" + TXT_COL_DATA + ">D.C.</span>",
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-1 hidden-xs text-center',
      "mRender": function(data, type, full) {
        return "<span value='" + full["dt_candidatura_us"] + "'><br/>" + full["dt_candidatura"] + '</span> '
      }
    }, {
      "mData": TXT_COL_CURRICULO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-1 hidden-xs text-center',
      "mRender": function(data, type, full) {
        return gerar_cv_link(full);
      }
    }, {
      "sTitle": TXT_COL_TRABALHANDO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-2 hidden-xs',
      "mRender": function(data, type, full) {
        return full["trabalhando"];
      }
    }, {
      "sTitle": TXT_COL_CIDADE_ESTADO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-1 hidden-xs',
      "mRender": function(data, type, full) {
        return full["cand_cidade"] + " " + full["cand_estado"];
      }
    }],
    complete: function() {
      $("[name='selecionar-todas']").click(_selecionar_lote);
      $("[name='selecionar-cand']").click(_selecionar_geral);

      if ($("[name=selecionar-cand]").length != 0) {
        $("#div_gerar_cv_padrao").show();
      } else {
        $("#div_gerar_cv_padrao").hide();
      }
    }
  });
}

var _selecionar_lote = function(adicionar) {
  if ($(this).is(":checked")) {
    $(".checkbox_colab").prop("checked", "checked");
  } else {
    $(".checkbox_colab").removeAttr("checked");
  }
  if ($(this).is(":checked") & $("[name=selecionar-cand]").length == 0) {
    $(this).removeAttr("checked");
  }
};

var _selecionar_geral = function() {
  if ($("[name=selecionar-cand]").length == $("[name=selecionar-cand]:checked").length) {
    $("[name='selecionar-todas']").prop("checked", "checked");
  } else {
    $("[name='selecionar-todas']").removeAttr("checked");
  }
};

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
      $("#div_gerar_cv_padrao").hide();
    }
  });
}

function voltar_detalhes() {
  $("#datatable_fila_cand").show();
  $("#detalhes_fila_cand").hide().html("");
  $("#div_gerar_cv_padrao").show();
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

function gerar_cv_padrao() {
  if ($("[name=selecionar-cand]:checked").length != 0) {
    var ids_cands = $.map($("[name=selecionar-cand]:checked"), function(chk, idx) {
      return $(chk).attr("id");
    }).join(',');
    window.open(URL_CV_PADRAO + ids_cands, '_blank');
  } else {
    $.dialogs.error(TXT_SELECIONE_UM);
  }
}

function selecionar(slug_registro) {
  //window.open(URL_ADICIONAR_COLAB + slug_registro + '/', '_blank');
  window.location.href = URL_ADICIONAR_COLAB + slug_registro + '/';
}

$(function() {
  //$("#id_btn_filtrar").click(consultar);
  $("#id_vaga").change(consultar);
  criar_fila_cand();
  injeta_src_candidato();
})
