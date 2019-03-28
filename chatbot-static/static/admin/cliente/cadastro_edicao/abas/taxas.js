var TABELA_CONSULTA_TA = undefined;

function listar_taxa() {
  TABELA_CONSULTA_TA = $.DataTableXenon({
    json: URL_CONS_TA,
    container: "datatable_taxa",
    filterForm: '#filtro_consulta',
    order: [
      [1, "desc"]
    ],
    aoColumns: [{
        "mData": TITULO_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'col-md-2 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="' + URL_DETALHES_TA + full["slug"] + '" title="' + TITULO_DETAL_TA + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';

          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_TA + full["slug"] + '" title="' + TITULO_EDIT_TA + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_TA + '" class="text-gray" style="cursor: pointer;" onclick="excluir_taxa(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_DATA,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2',
        "mRender": function(data, type, full) {
          return full['data'];
        }
      },
      {
        "mData": TITULO_PRODUTO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['produto'];
        }
      },
      {
        "mData": TITULO_PROMOTOR,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['promotor'];
        }
      },
    ]
  });
}

function consultar_taxa() {
  TABELA_CONSULTA_TA.reload();
}

function excluir_taxa(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_TA, function() {
    $.ajax({
      url: URL_EXC_TA,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_TA);
        consultar_taxa();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/taxas/)) {
    listar_taxa();
  };
  $("#aba_taxas").click(function(e) {
    listar_taxa();
  });
});
