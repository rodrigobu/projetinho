var TABELA_CONSULTA_SER = undefined;

function listar_servico() {
  TABELA_CONSULTA_SER = $.DataTableXenon({
    json: URL_CONS_SER,
    container: "datatable_servico",
    filterForm: '#filtro_consulta',
    order: [
      [5, "asc"]
    ],
    complete: function() {
      $("#table_datatable_servico").css("width", (180 * 10) + "px");
      $("#table_datatable_servico").css("min-width", "100%");
      $("#table_datatable_servico").parent().remove("col-sm-12");
      $("#table_datatable_servico").parent().css("overflow-x", "scroll");
    },
    aoColumns: [{
        "mData": TITULO_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="' + URL_DETALHES_SER + full["slug"] + '" title="' + TITULO_DETAL_SER + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';

          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_SER + full["slug"] + '" title="' + TITULO_EDIT_SER + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_SER + '" class="text-gray" style="cursor: pointer;" onclick="excluir_servico(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      },
      {
        "mData": TITULO_CODIGO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['num'];
        }
      },
      {
        "mData": TITULO_CODIGO_PROPOSTA,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['cod_proposta'];
        }
      },
      {
        "mData": TITULO_EMISSAO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['dt_emissao'];
        }
      },
      {
        "mData": TITULO_DESCRICAO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['descricao'];
        }
      },
      {
        "mData": TITULO_PRODUTO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['produto'];
        }
      },
      {
        "mData": TITULO_PROMOTOR,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['promotor'];
        }
      },
      {
        "mData": TITULO_VALOR,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['valor'];
        }
      },
      {
        "mData": TITULO_STATUS,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['status'];
        }
      },
      {
        "mData": TITULO_FATURADO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['faturado'];
        }
      },
    ]
  });
}

function consultar_servico() {
  TABELA_CONSULTA_SER.reload();
}

function excluir_servico(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_SER, function() {
    $.ajax({
      url: URL_EXC_SER,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_SER);
        consultar_servico();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/proposta_servico/)) {
    listar_servico();
  };
  $("#aba_proposta_servico").click(function(e) {
    listar_servico();
  });
});
