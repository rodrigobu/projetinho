var TABELA_CONSULTA_OCO = undefined;

function listar_ocorrencia() {
  TABELA_CONSULTA_OCO = $.DataTableXenon({
    json: URL_CONS_OCO,
    container: "datatable_ocorrencia",
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
          HTML += '<a href="' + URL_DETALHES_OCO + full["slug"] + '" title="' + TITULO_DETAL_OCO + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';
          if (!full['n_pode_excluir'] && !READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_OCO + full["slug"] + '" title="' + TITULO_EDIT_OCO + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_OCO + '" class="text-gray" style="cursor: pointer;" onclick="excluir_ocorrencia(\'' + full["num"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
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
          return full['dt_ocorrencia'];
        }
      },
      {
        "mData": TITULO_RESPONSAVEL,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['responsavel'];
        }
      },
      {
        "mData": TITULO_HISTORICO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['historico'];
        }
      }
    ]
  });
}

function consultar_ocorrencia() {
  TABELA_CONSULTA_OCO.reload();
}

function excluir_ocorrencia(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_OCO, function() {
    $.ajax({
      url: URL_EXC_OCO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        id: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_OCO);
        consultar_ocorrencia();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/ocorrencia/)) {
    listar_ocorrencia();
  };
  $("#aba_ocorrencia").click(function(e) {
    listar_ocorrencia();
  });
});
