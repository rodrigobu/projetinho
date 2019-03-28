var TABELA_CONSULTA_TAVA = undefined;

function listar_taxavaga() {
  TABELA_CONSULTA_TAVA = $.DataTableXenon({
    json: URL_CONS_TAVA,
    container: "datatable_taxavaga",
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
          HTML += '<a href="' + URL_DETALHES_TAVA + full["slug"] + '" title="' + TITULO_DETAL_TAVA + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';

          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_TAVA + full["slug"] + '" title="' + TITULO_EDIT_TAVA + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_TAVA + '" class="text-gray" style="cursor: pointer;" onclick="excluir_taxavaga(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_TIPO_VAGA,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['tipo_vaga'];
        }
      },
      {
        "mData": TITULO_RESPONS,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['responsavel'];
        }
      },
      {
        "mData": TITULO_VALOR,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2',
        "mRender": function(data, type, full) {
          return full['valor'];
        }
      },

    ]
  });
}

function consultar_taxavaga() {
  TABELA_CONSULTA_TAVA.reload();
}

function excluir_taxavaga(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_TAVA, function() {
    $.ajax({
      url: URL_EXC_TAVA,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_TAVA);
        consultar_taxavaga();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/taxas/)) {
    listar_taxavaga()
  };
  $("#aba_taxas").click(function(e) {
    listar_taxavaga();
  });
});
