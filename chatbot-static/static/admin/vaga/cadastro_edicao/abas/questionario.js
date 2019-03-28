var TABELA_CONSULTA_QUEST = undefined;

function listar_questionario() {
  TABELA_CONSULTA_QUEST = $.DataTableXenon({
    json: URL_CONS_QUEST,
    container: "datatable_questionario",
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
          HTML += '<a href="' + URL_DETALHES_QUEST + full["slug"] + '" title="' + TITULO_DETALHES + '" class="text-gray "><i class="' + ICON_DETALHES + '"></i> </a>';
          if (!READONLY) {
            if (PERMITE_EDIT_QUEST == 'True') {
              HTML += '<a href="' + URL_EDI_QUEST + full["slug"] + '" title="' + TITULO_EDIT_QUEST + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (PERMITE_DELET_QUEST == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_QUEST + '" class="text-gray" style="cursor: pointer;" onclick="excluir_questionario(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_PERG,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-6',
        "mRender": function(data, type, full) {
          if (full['pergunta'].length > 100) {
            return "<span title='" + full['pergunta'] + "'>" + full['pergunta_abr'] + "</span>";
          }
          return full['pergunta'];
        }
      },
      {
        "mData": TITULO_TIPO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-4',
        "mRender": function(data, type, full) {
          return full['tipo'];
        }
      },

    ]
  });
}

function consultar_questionario() {
  TABELA_CONSULTA_QUEST.reload();
}

function excluir_questionario(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_QUEST, function() {
    $.ajax({
      url: URL_EXC_QUEST,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_QUEST);
        consultar_questionario();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/questionario/)) {
    listar_questionario();
  };
  $("#aba_questionario").click(function(e) {
    listar_questionario();
  });
});
