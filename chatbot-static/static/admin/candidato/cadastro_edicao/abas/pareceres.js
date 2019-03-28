var TABELA_CONSULTA_PAR = undefined;

function listar_parecer(meus_pareceres = false) {
  if (meus_pareceres) {
    URL_CONS_PAR1 = URL_CONS_PAR + '?mp=t';
  } else {
    URL_CONS_PAR1 = URL_CONS_PAR;
  }
  TABELA_CONSULTA_PAR = $.DataTableXenon({
    json: URL_CONS_PAR1,
    container: "datatable_parecer",
    filterForm: '#filtro_consulta',
    order: [
      [1, "desc"]
    ],
    complete: function() {
      $("#table_datatable_parecer").css("width", (180 * 10) + "px");
      $("#table_datatable_parecer").css("min-width", "100%");
      $("#table_datatable_parecer").parent().remove("col-sm-12");
      $("#table_datatable_parecer").parent().css("overflow-x", "scroll");
    },
    aoColumns: [{
        "mData": TITULO_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="' + URL_DETALHES_PAR + full["slug"] + '" title="' + TITULO_DETAL_PAR + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';
          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_PAR + full["slug"] + '" title="' + TITULO_EDIT_PAR + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_PAR + '" class="text-gray" style="cursor: pointer;" onclick="excluir_parecer(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_VAGA,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['vaga'];
        }
      },
      {
        "mData": TITULO_SELEC,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['selecionador'];
        }
      },
      {
        "mData": TITULO_DATA,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['data'];
        }
      },
      {
        "mData": TITULO_PARECER,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['parecer'];
        }
      },
      {
        "mData": TITULO_PAR_CLI,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['parecer_cli'];
        }
      }
    ]
  });
}

function consultar_parecer() {
  TABELA_CONSULTA_PAR.reload();
}

function excluir_parecer(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_PAR, function() {
    $.ajax({
      url: URL_EXC_PAR,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_PAR);
        consultar_parecer();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/parecer/)) {
    listar_parecer();
  };
  $("#aba_parecer").click(function(e) {
    listar_parecer();
  });
  $("#id_apenas_meus_pareceres").click(function(e) {
    if ($(this).is(":checked")) {
      listar_parecer(meus_pareceres = true);
    } else {
      listar_parecer();
    };
  });
});
