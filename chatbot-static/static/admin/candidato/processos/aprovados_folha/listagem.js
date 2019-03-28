

var render_candidato_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    var html_exportado = full['exportado_gi'] ? '<span><b><br/>Já Exportado</b>&nbsp;</span>' : '';

    return  html_exportado +
    " <span class='hidden-md-up'><b><br/>" + TXT_COL_CLIENTE + ":</b>&nbsp;" +
    render_cliente_coluna(data, type, full) + "</span>" +
    " <span class='hidden-md-up'><br/><b>" + TXT_COL_VAGA + ":</b>&nbsp;" +
    render_vaga_coluna(data, type, full) + '</span> ';
  };
  return render_candidato_coluna_padrao(data, type, full, extra_render);
}

var render_vaga_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    return "<span><br/><b>" + TXT_COL_SELECIONADOR + ":</b>&nbsp;" + full["selecionador"] + "</span>";
  };
  return render_vaga_coluna_padrao(data, type, full, extra_render);
}

var render_cliente_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    return "<span><b>" + TXT_COL_PROMOTOR + ":</b>&nbsp;" + full["promotor"] + "<br/></span>";
  };
  return render_cliente_coluna_padrao(data, type, full, extra_render);
}


function consultar() {


  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_consulta",
    filterForm: '#filtro_consulta',
    order: [
      [1, "asc"]
    ],
    aoColumns: [{
        "sTitle": "<input class='center' name='selecionar-todos' type='checkbox'>",
        'sType': 'html',
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center',
        "mRender": function(data, type, full) {
          return "<input class='center checkbox_colab' cand='" + full["cand_id"] + "' value='" + full["proc_sel_id"] + "' name='selecionar-cand' type='checkbox'>";
        }
      },
      {
        "mData": TXT_COL_CANDIDATO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-5 col-xs-8',
        "mRender": render_candidato_coluna
      },
      {
        "mData": TXT_COL_CLIENTE,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-3 hidden-xs',
        "mRender": render_cliente_coluna
      }, {
        "mData": TXT_COL_VAGA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-3 hidden-xs',
        "mRender": render_vaga_coluna
      },
    ],
    complete: function(){
        $("[name='selecionar-todos']").change(function() {
          _selecionar_lote($(this).is(":checked"));
        });
    }
  });

}


var exportar = function() {
  mostrarCarregando("Exportando ... ");

  var ids_candidatos = "";
  var ids_procsel = "";
  $.each($("[name='selecionar-cand']:checked"), function(id, value) {
    ids_candidatos += $(value).attr("cand") + ',';
    ids_procsel += $(value).attr("value") + ',';
  });

  $.ajax({
    url: URL_EXPORTAR_CANDS,
    type: 'post',
    dataType: 'json',
    async: false,
    data: {
      'ids_candidatos': ids_candidatos,
      'ids_procsel': ids_procsel
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno["msg"], retorno["titulo"], function(resp) {
          if (resp) {
            window.open(get_base_path_windows() + retorno["url"], '_blank');
            recarrega_consultar();
          }
        });
      } else {
        $.dialogs.error(retorno["msg"]);
      }
    },
    complete: function() {
      esconderCarregando();
    }
  });

};


var _selecionar_lote = function(adicionar) {
  if (adicionar) {
    $(".checkbox_colab").prop("checked", "checked");
  } else {
    $(".checkbox_colab").removeAttr("checked");
  }
};

function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  consultar();
  datas_menor_e_maior("#id_dt_ini", "#id_dt_fin");

  $("[name='selecionar-todos']").on("click", function() {
    _selecionar_lote($(this).is(":checked"));
  });

});
