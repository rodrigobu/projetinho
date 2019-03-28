var TABELA_CONSULTA_VAGA = undefined;

function listar_vaga() {
  TABELA_CONSULTA_VAGA = $.DataTableXenon({
    json: URL_CONS_VAGA,
    container: "datatable_vaga",
    filterForm: '#filtro_consulta',
    order: [
      [1, "desc"]
    ],
    complete: function() {
      $("#table_datatable_vaga").css("width", (180 * 7) + "px");
      $("#table_datatable_vaga").css("min-width", "100%");
      $("#table_datatable_vaga").parent().remove("col-sm-12");
      $("#table_datatable_vaga").parent().css("overflow-x", "scroll");
    },
    aoColumns: [{
        "mData": TITULO_ACOES_VAGA,
        'orderable': false,
        'searchable': false,
        'class': 'text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="' + URL_EDI_VAGA + full["slug"] + '" target="_blank" title="' + TITULO_EDIT_VAGA + '" class="text-gray "><i class="' + ICON_EDIT + '"></i> </a>';
          return HTML;
        }
      },
      {
        "mData": TITULO_NUMERO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['id'];
        }
      },
      {
        "mData": TITULO_CONTRATO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['desc_contrato'];
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
        "mData": TITULO_TIPO,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['tipo_vaga'];
        }
      },
      {
        "mData": TITULO_QTDVAGA,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['qtd_solicitada'];
        }
      },
      {
        "mData": TITULO_QTDFECH,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['qtd_fechada'];
        }
      }
    ]
  });
}

$(function() {
  if (document.URL.match(/vaga/)) {
    listar_vaga();
  };
  $("#aba_vaga").click(function(e) {
    listar_vaga();
  });
});
