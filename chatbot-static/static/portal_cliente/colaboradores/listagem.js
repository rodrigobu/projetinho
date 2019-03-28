var render_candidato_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    return "<span><b><br/>" + TXT_COLUMN_FUNCAO + ":</b>&nbsp;" + full["funcao_ini"] + "</span>" +
      "<span><b><br/>" + TXT_COLUMN_DTAD + ":</b>&nbsp;" + (!full["dt_admissao"] ? "" : full["dt_admissao"]) + "</span>";
  };
  return render_candidato_coluna_padrao(data, type, full, extra_render);
}


function criar_colaboradores() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_PROC_SEL_JSON,
    container: "datatable_colaboradores",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COLUMN_NOME,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-11 col-xs-11',
        "mRender": render_candidato_coluna
      },
      {
        "sTitle": "<span class='text-center hidden-xs'>" + TXT_COLUMN_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = '';
          HTML += "<span title='" + TXT_BTN_DETALHES + "' class='detalhes_lista_colab cursor_pointer' onclick='detalhes_colab(\"" + full["cand_slug"] + "\")'> <i class='"+ICON_DETALHES+"'></i> </span> ";
          HTML += "<span title='" + TXT_BTN_ENCERRAR + "' class='encerrar_contrato cursor_pointer' onclick='form_encerrar_contrato(\"" + full["cand_slug"] + "\")'> <i class='"+ICON_ENCERRAR+"'></i> </span> ";
          HTML += "<span title='" + TXT_BTN_MOVIMENTA + "' class='movimentacao_funcional cursor_pointer' onclick='form_mov_funcional(\"" + full["cand_slug"] + "\")'> <i class='"+ICON_MOV_FUNC+"'></i> </span> ";
          return HTML;
        }
      },
    ]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
  $("#datatable_colaboradores").show();
  $("#detalhes_colaboradores").hide().html("");
}


function detalhes_colab(slug_registro) {
  $.ajax({
    url: URL_DETALHES_COLAB,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro
    },
    success: function(dados) {
      $("#datatable_colaboradores").hide();
      $("#detalhes_colaboradores").html(dados["html"]).show();
      $("#id_btn_voltar").click(voltar_detalhes_colab);
    }
  });
}

function voltar_detalhes_colab() {
  $("#datatable_colaboradores").show();
  $("#detalhes_colaboradores").hide().html("");
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  criar_colaboradores();
  injeta_src_candidato();
});
