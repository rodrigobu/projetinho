var render_cliente_coluna = function(data, type, full) {
  extra_render = function(data, type, full) {
    var HTML = "<span class='hidden-md-up'><b><br/>" + SOLICITANTE + ":</b>&nbsp;" + full["solicitante"] + "</span>";
    return HTML;
  };
  return render_cliente_coluna_padrao(data, type, full, extra_render);
}


function consultar() {

  var COLUNAS_TBL = [
      {
        "sTitle": "<span class='hidden-xs'>" + TITULO_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += gerar_link_edicao_cliente(full);
          HTML += '<a title="' + TITULO_DET + '" class="text-gray" href="' + URL_CADASTRAR + full["slug"] + '" ><i class="' + ICON_DET + '"></i> </a>';
          HTML += '<span title="' + TITULO_REJEITAR + '" class="text-danger" onclick="rejeitar(\'' + full["slug"] + '\')"><i class="' + ICON_REJEITAR + '"></i> </span>';
          return HTML;
        }
    },{
      "mData": TXT_COL_CLIENTE,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-4 col-xs-12',
      "mRender": render_cliente_coluna
    },
    {
      "mData": FUNCAO,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-4 hidden-xs',
      "mRender": function(data, type, full) {
        var HTML = full["funcao"];
        return HTML;
      }
    },
    {
      "mData": SOLICITANTE,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-3 hidden-xs',
      "mRender": function(data, type, full) {
        var HTML = ' 	<span>' + full["solicitante"] + '</span> ';
        return HTML;
      }
    }
  ];

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_consulta",
    filterForm: '#filtro_consulta',
    order: [
      [1, "asc"]
    ],
    aoColumns: COLUNAS_TBL
  });

}

function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}


function rejeitar(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_REJEITAR, function() {
    $.ajax({
      url: URL_REJEITAR,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro,
      },
      success: function(dados) {
        if (dados['status'] == 'ok') {
          $.dialogs.success(dados['msg']);
          recarrega_consultar();
        } else {
          $.dialogs.error(dados['msg']);
        }
      }
    });
  });
}


$(function() {
  consultar();
});
