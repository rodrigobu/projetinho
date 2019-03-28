var TABELA_CONSULTA_COMP = undefined;

function listar_competencia() {
  var COLUNAS = [];
  if (!READONLY) {
    COLUNAS.push({
      "mData": TITULO_ACOES,
      'orderable': false,
      'searchable': false,
      'class': 'col-md-2 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = ''
        if (!READONLY) {
          if (VAL_ICONEDIT == 'True') {
            HTML += '<a href="' + URL_EDI_COMP + full["slug"] + '" title="' + TITULO_EDIT_COMP + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
          }
          if (VAL_ICONDELETE == 'True') {
            HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_COMP + '" class="text-gray" style="cursor: pointer;" onclick="excluir_competencia(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
          }
        }
        return HTML;
      }
    })
  }

  COLUNAS.push({
    "mData": TITULO_COMPETENCIA,
    'orderable': true,
    'searchable': true,
    'class': 'col-md-6',
    "mRender": function(data, type, full) {
      return full['ct'];
    }
  })

  COLUNAS.push({
    "mData": TITULO_NIVEL,
    'orderable': true,
    'searchable': true,
    'class': 'col-md-4',
    "mRender": function(data, type, full) {
      return full['nivel'];
    }
  })

  TABELA_CONSULTA_COMP = $.DataTableXenon({
    json: URL_CONS_COMP,
    container: "datatable_competencia",
    filterForm: '#filtro_consulta',
    order: [
      [1, "desc"]
    ],
    aoColumns: COLUNAS
  });
}

function consultar_competencia() {
  TABELA_CONSULTA_COMP.reload();
}

function excluir_competencia(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_COMP, function() {
    $.ajax({
      url: URL_EXC_COMP,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_COMP);
        consultar_competencia();
      }
    });
  });
}

$(function() {
  if (document.URL.match(/competencia/)) {
    listar_competencia();
  };
  $("#aba_competencia").click(function(e) {
    listar_competencia();
  });
});
