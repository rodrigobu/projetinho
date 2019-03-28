var render_candidato_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    return "<span class='hidden-md-up'><br/><b>" + TXT_COL_DATA_HORA + ":</b>&nbsp;" + full["data_hora"] + '</span> ' +
    "<span class='hidden-md-up'><br/><b>" + TXT_COL_VAGA + ":</b>&nbsp;" + render_vaga_coluna(data, type, full) + '</span> ' +
    "<span class='hidden-md-up'><br/><b>" + TXT_COL_OBSERVACOES + ":</b>&nbsp;" + full["observacao"] + '</span> ';
  };
  return render_candidato_coluna_padrao(data, type, full, extra_render);
}

var render_vaga_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    return "<span><br/><b>" + TXT_COL_SELEC + ":</b>&nbsp;" + full["selecionador_nome"] + '</span> ';
  };
  return render_vaga_coluna_padrao(data, type, full, extra_render);
}

function criar_fila_selecao() {


  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_consulta",
    filterForm: '#filtro_consulta',
    order: [[2, "asc"]],
    aoColumns:  [
    {
      "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
      'orderable': false,
      'searchable': false,
      'class': 'col-xs-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = '';
        HTML += gerar_link_edicao_candidato(full);
        HTML += gerar_link_edicao_vaga(full);
        HTML += "<span class='cursor_pointer' title='" + TXT_BTN_REMOVER + "' onclick='remover(\"" + full["fila_slug"] + "\")'> <i class='"+ICON_EXC+"'></i> </span> ";
        return HTML;
      }
    }, {
      "mData": TXT_COL_DATA_HORA,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-1 hidden-xs text-center',
      "mRender": function(data, type, full) {
        return  '<span value="' + full["data_hora_us"] + '">' + full["data_hora"] + '</span> ';
      }
    }, {
      "mData": TXT_COL_CANDIDATO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-3 col-xs-11',
      "mRender": render_candidato_coluna
    },  {
      "mData": TXT_COL_VAGA,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-4 hidden-xs',
      "mRender": render_vaga_coluna
    },{
      "mData": TXT_COL_OBSERVACOES,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-3 hidden-xs',
      "mRender": function(data, type, full) {
        return full["observacao"];
      }
    },]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
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

$(function() {
  $("#id_minha_fila_selecao").click(consultar)
  $("#id_btn_filtrar").click(consultar);
  criar_fila_selecao();
  injeta_src_candidato();
})
