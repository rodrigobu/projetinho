var TABELA_CONSULTA_ANEX = undefined;

function listar_anexo() {
  TABELA_CONSULTA_ANEX = $.DataTableXenon({
    json: URL_CONS_ANEX,
    container: "datatable_anexo",
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
          HTML += '<a href="' + URL_DETALHES_ANEX + full["slug"] + '" title="' + TITULO_DETAL_ANEX + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';
          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_DOWN_ANEX + full["slug"] + '" title="' + TITULO_DOWN_ANEX + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_DOWN + '"></i></a>';
              HTML += '<a href="' + URL_EDI_ANEX + full["slug"] + '" title="' + TITULO_EDIT_ANEX + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_ANEX + '" class="text-gray" style="cursor: pointer;" onclick="excluir_anexo(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_TIPODOC,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['tipo'];
        }
      },
      {
        "mData": TITULO_OBS,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-6',
        "mRender": function(data, type, full) {
          return full['obs'];
        }
      },
    ]
  });
}

function consultar_anexo() {
  TABELA_CONSULTA_ANEX.reload();
}

function excluir_anexo(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_ANEX, function() {
    $.ajax({
      url: URL_EXC_ANEX,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_ANEX);
        consultar_anexo();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/anexo/)) {
    listar_anexo();
  };
  $("#aba_anexo").click(function(e) {
    listar_anexo();
  });
});
