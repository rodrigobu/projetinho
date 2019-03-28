var TABELA_CONSULTA_CONT = undefined;

function listar_contato() {
  TABELA_CONSULTA_CONT = $.DataTableXenon({
    json: URL_CONS_CONT,
    container: "datatable_contato",
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
          HTML += '<a href="' + URL_DETALHES_CONT + full["slug"] + '" title="' + TITULO_DETAL_CONT + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';

          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_CONT + full["slug"] + '" title="' + TITULO_EDIT_CONT + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_CONT + '" class="text-gray" style="cursor: pointer;" onclick="excluir_contato(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_NOME,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['nome'];
        }
      },
      {
        "mData": TITULO_DDD,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-1',
        "mRender": function(data, type, full) {
          return full['ddd'];
        }
      },
      {
        "mData": TITULO_TELEFONE,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2',
        "mRender": function(data, type, full) {
          return full['telefone'];
        }
      },
      {
        "mData": TITULO_EMAIL,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['email'];
        }
      }
    ]
  });
}

function consultar_contato() {
  TABELA_CONSULTA_CONT.reload();
}

function excluir_contato(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_CONT, function() {
    $.ajax({
      url: URL_EXC_CONT,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_CONT);
        consultar_contato();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/contato/)) {
    listar_contato();
  };
  $("#aba_contato").click(function(e) {
    listar_contato();
  });
});
