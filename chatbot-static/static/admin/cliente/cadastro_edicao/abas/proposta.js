var TABELA_CONSULTA_PRO = undefined;

function listar_proposta() {
  TABELA_CONSULTA_PRO = $.DataTableXenon({
    json: URL_CONS_PRO,
    container: "datatable_proposta",
    filterForm: '#filtro_consulta',
    order: [
      [5, "asc"]
    ],
    complete: function() {
      $("#table_datatable_proposta").css("width", (180 * 10) + "px");
      $("#table_datatable_proposta").css("min-width", "100%");
      $("#table_datatable_proposta").parent().remove("col-sm-12");
      $("#table_datatable_proposta").parent().css("overflow-x", "scroll");
    },
    aoColumns: [{
        "mData": TITULO_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="' + URL_DETALHES_PRO + full["slug"] + '" title="' + TITULO_DETAL_PRO + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';

          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_PRO + full["slug"] + '" title="' + TITULO_EDIT_PRO + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_PRO + '" class="text-gray" style="cursor: pointer;" onclick="excluir_proposta(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
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
      }
    ]
  });
}

function consultar_proposta() {
  TABELA_CONSULTA_PRO.reload();
}

function excluir_proposta(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_PRO, function() {
    $.ajax({
      url: URL_EXC_PRO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_PRO);
        consultar_proposta();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/proposta_servico/)) {
    listar_proposta();
  };
  $("#aba_proposta_servico").click(function(e) {
    listar_proposta();
  });
});
