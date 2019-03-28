function criar_listagem() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA,
    container: "datatable_usuario",
    filterForm: '#filtro_consulta',
    order: [[1, "asc"]],
    aoColumns: [
      {
          "mData": TITULO_ACOES,
          'orderable': false,
          'searchable': false,
          'class': 'col-md-1 text-center big_icons',
          "mRender": function(data, type, full) {
            var HTML = ''
            if (full['proibir_edicao']) {
              HTML += '<span title="' + TITULO_EDITNO + '"><i class="' + ICON_INFO + '"></i><span>';
            } else {
              HTML += '<a href="' + URL_EDICAO + full["slug"] + '" title="' + TITULO_EDIT + '" class="text-gray "><i class="' + ICON_EDIT + '"></i> </a>';
              HTML += '<a href="#" title="' + TITULO_EXC + '" class="text-gray " onclick="excluir_registro(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            };
            return HTML;
          }
      },
      {
        "mData": TITULO_NOME,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-6',
        "mRender": function(data, type, full) {
          return full['name'];
        }
      },
      {
        "mData": TITULO_EMAIL,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-3',
        "mRender": function(data, type, full) {
          return full['email'];
        }
      },
      {
        "mData": TITULO_ATIV,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2 text-center',
        "mRender": function(data, type, full) {
          var HTML = ''

          if (full.ativo === 'Sim') {
            texto = TITULO_PARTSI;
          } else {
            texto = TITULO_PARTNO;
          }
          HTML += `<p>${texto}</p>`;
          return HTML;
        }
      },
    ]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

function excluir_registro(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC, function() {
    $.ajax({
      url: URL_EXCLUSAO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC);
        consultar();
      }
    });
  });
}

$(function() {
  criar_listagem();
});
