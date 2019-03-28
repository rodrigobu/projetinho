var render_candidato_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    return " <span class='hidden-md-up'><b><br/>" + TXT_COL_VALOR + ":</b>&nbsp;" +
    full['valor_faturamento'] + "</span>" +
    " <span class='hidden-md-up'><b><br/>" + TXT_COL_CLIENTE + ":</b>&nbsp;" +
    render_cliente_coluna_padrao(data, type, full) + "</span>" +
      " <span class='hidden-md-up'><br/><b>" + TXT_COL_VAGA + ":</b>&nbsp;" +
    render_vaga_coluna_padrao(data, type, full) + '</span> ';
  };
  return render_candidato_coluna_padrao(data, type, full, extra_render);
}

function consultar() {

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_consulta",
    filterForm: '#filtro_consulta',
    aoColumns: [
      {
          "mData": TXT_COL_CLIENTE,
          'orderable': true,
          'searchable': true,
          'class': 'col-md-3 hidden-xs',
          "mRender": render_cliente_coluna_padrao
        },
      {
        "mData": TXT_COL_CANDIDATO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-3 col-xs-8',
        "mRender": render_candidato_coluna
      }, {
        "mData": TXT_COL_VAGA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-3 hidden-xs',
        "mRender": render_vaga_coluna_padrao
      },{
        "mData": TXT_COL_VALOR,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 col-xs-2 text-center',
        "mRender":  function(data, type, full) {
          return full['valor_faturamento']
        }
      },{
        "mData": TXT_COL_FATURADO,
        'orderable': false,
        'searchable': false,
        'class': 'col-sm-1 col-xs-2 text-center',
        "mRender":  function(data, type, full) {
          var HTML = ''
          HTML += '<input type="checkbox" ' + (full['faturado'] ? 'checked' : '') + ' onclick="editar_faturado(\'' + full["proc_sel_slug"] + '\', this)">';
          return HTML;
        }
      },
    ]
  });

}


function editar_faturado(slug_registro, checkbox) {
  $.ajax({
    url: URL_EDITAR,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro,
      faturar: $(checkbox).is(":checked")
    },
    success: function(dados) {
      if (dados['status'] == 'ok') {
        $.dialogs.success(dados['msg']);
        recarrega_consultar();
      } else {
        $.dialogs.error(dados['msg']);
        recarrega_consultar();
      }
    }
  });
}


function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  consultar();

  datas_menor_e_maior("#id_dt_ini", "#id_dt_fin");
});
