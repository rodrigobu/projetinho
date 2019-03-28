var TABELA_CONSULTA_ANE = undefined;

function listar_anexo() {
  TABELA_CONSULTA_ANE = $.DataTableXenon({
    json: URL_CONS_ANE,
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
          HTML += '<a href="' + URL_DETALHES_ANE + full["slug"] + '" title="' + TITULO_DETAL_ANE + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';
          HTML += '<a href="' + URL_DOWN_ANE + full["slug"] + '" title="' + TITULO_DOWN_ANE + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_DOWN + '"></i></a>';
          if (!READONLY) {
            if (PERMITE_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_ANE + full["slug"] + '" title="' + TITULO_EDIT_ANE + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (PERMITE_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_ANE + '" class="text-gray" style="cursor: pointer;" onclick="excluir_anexo(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
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
        "mData": TITULO_HIST,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['historico'];
        }
      },
      {
        "mData": TITULO_OBS,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['obs'];
        }
      },
    ]
  });
}

function consultar_anexo() {
  TABELA_CONSULTA_ANE.reload();
}

function excluir_anexo(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_ANE, function() {
    $.ajax({
      url: URL_EXC_ANE,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_ANE);
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
