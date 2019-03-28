var TABELA_CONSULTA_BEN = undefined;

function listar_beneficio() {
  TABELA_CONSULTA_BEN = $.DataTableXenon({
    json: URL_CONS_BEN,
    container: "datatable_beneficio",
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
          HTML += '<a href="' + URL_DETALHES_BEN + full["slug"] + '" title="' + TITULO_DETAL_BEN + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';
          if (!READONLY) {
            if (PERMITE_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_BEN + full["slug"] + '" title="' + TITULO_EDIT_BEN + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (PERMITE_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_BEN + '" class="text-gray" style="cursor: pointer;" onclick="excluir_beneficio(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_BENEFICIO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-6',
        "mRender": function(data, type, full) {
          return full['beneficio'];
        }
      },
      {
        "mData": TITULO_VALOR_BENF,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['val_benf'];
        }
      },
    ]
  });
}

function consultar_beneficio() {
  TABELA_CONSULTA_BEN.reload();
}

function excluir_beneficio(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_BEN, function() {
    $.ajax({
      url: URL_EXC_BEN,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_BEN);
        consultar_beneficio();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/beneficio/)) {
    listar_beneficio();
  };
  $("#aba_beneficio").click(function(e) {
    listar_beneficio();
  });
});
