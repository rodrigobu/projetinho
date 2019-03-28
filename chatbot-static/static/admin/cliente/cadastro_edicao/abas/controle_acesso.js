var TABELA_CONSULTA_ACESSO = undefined;

function listar_controle_acesso() {
  TABELA_CONSULTA_ACESSO = $.DataTableXenon({
    json: URL_CONS_ACESSO,
    container: "datatable_controle_acesso",
    filterForm: '#filtro_consulta',
    aoColumns: [{
      "mData": TITULO_USUARIO,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-6',
      "mRender": function(data, type, full) {
        return full['usuario'];
      },
      {
        "mData": TITULO_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'col-md-2 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="' + URL_DETALHES_ACESSO + full["slug"] + '" title="' + TITULO_DETAL_ACESSO + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';
          HTML += '<a href="' + URL_EDI_ACESSO + full["slug"] + '" title="' + TITULO_EDIT_ACESSO + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
          HTML += '<a title="' + TITULO_EXC_ACESSO + '" class="text-gray" style="cursor: pointer;" onclick="excluir_controle_acesso(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
          return HTML;
        }
      }
    }]
  });
}

function consultar_controle_acesso() {
  TABELA_CONSULTA_ACESSO.reload();
}

function excluir_controle_acesso(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_ACESSO, function() {
    $.ajax({
      url: URL_EXC_ACESSO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_ACESSO);
        consultar_controle_acesso();
      }
    });
  });
}

function salvar_controlar_acesso(ligar) {
  $.ajax({
    url: URL_SALVAR_ACESSO,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      ligar: ligar
    },
    success: function(dados) {
      $.dialogs.success(dados['msg']);
      toggle_controlar_acesso();
    }
  });

}

function toggle_controlar_acesso() {
  if ($("#id_controlar_acesso").is(":checked")) {
    consultar_controle_acesso();
    $(".show_on_controlar_acesso").show();
  } else {
    $(".show_on_controlar_acesso").hide();
  }
}

$(function() {

  $("#id_controlar_acesso").click(function() {
    if ($("#id_controlar_acesso").is(":checked")) {
      salvar_controlar_acesso('true');
    } else {
      // TODO: colocar confirmação
      salvar_controlar_acesso('false');
    }
  });
  toggle_controlar_acesso();

})
