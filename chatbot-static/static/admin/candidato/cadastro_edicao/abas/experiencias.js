var TABELA_CONSULTA_EXP = undefined;

function listar_experiencia() {
  TABELA_CONSULTA_EXP = $.DataTableXenon({
    json: URL_CONS_EXP,
    container: "datatable_experiencia",
    filterForm: '#filtro_consulta',
    order: [
      [1, "desc"]
    ],
    complete: function() {
      $("#table_datatable_experiencia").css("width", (150 * 10) + "px");
      $("#table_datatable_experiencia").css("min-width", "100%");
      $("#table_datatable_experiencia").parent().remove("col-sm-12");
      $("#table_datatable_experiencia").parent().css("overflow-x", "scroll");
    },
    aoColumns: [{
        "mData": TITULO_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="' + URL_DETALHES_EXP + full["slug"] + '" title="' + TITULO_DETAL_EXP + '" class="text-gray "><i class="' + ICON_DETALHE + '"></i> </a>';
          if (!READONLY) {
            if (VAL_ICONEDIT == 'True') {
              HTML += '<a href="' + URL_EDI_EXP + full["slug"] + '" title="' + TITULO_EDIT_EXP + '" class="text-gray" style="cursor: pointer;"> <i class="' + ICON_EDIT + '"></i></a>';
            }
            if (VAL_ICONDELETE == 'True') {
              HTML += '<a href="javascript:void(0);" title="' + TITULO_EXC_EXP + '" class="text-gray" style="cursor: pointer;" onclick="excluir_experiencia(\'' + full["slug"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
            }
          }
          return HTML;
        }
      }, {
        "mData": TITULO_EMP,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['empresa'];
        }
      },
      {
        "mData": TITULO_FI,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['funcao_ini'];
        }
      },
      {
        "mData": TITULO_FF,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['funcao_fim'];
        }
      },
      {
        "mData": TITULO_DTADM,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['dt_admissao'];
        }
      },
      {
        "mData": TITULO_DTDEM,
        'orderable': true,
        'searchable': true,
        'class': '',
        "mRender": function(data, type, full) {
          return full['dt_demissao'];
        }
      }
    ]
  });
}

function consultar_experiencia() {
  TABELA_CONSULTA_EXP.reload();
}

function excluir_experiencia(slug_registro) {
  $.dialogs.confirm('', ALERTA_EXC_EXP, function() {
    $.ajax({
      url: URL_EXC_EXP,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        num: slug_registro
      },
      success: function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC_EXP);
        consultar_experiencia();
      }
    });
  });
}

function limpar_experiencias() {
  $.ajax({
    url: URL_LIMPAR_EXPERIENCIA,
    type: 'get',
    cache: false,
    dataType: 'json',
    assync: false,
    data: {},
    success: function(retorno) {
      consultar_experiencia();
      $("#div_cad_experiencias").hide();
    }
  });
}

$(function() {
  if (document.URL.match(/experiencia/)) {
    listar_experiencia();
  };
  $("#aba_experiencia").click(function(e) {
    listar_experiencia();
  });

  if ($('#id_sem_experiencia').is(":checked")) {
    $('#div_tb_datatable_experiencia').hide();
  };

  $("#id_sem_experiencia").click(function(e) {
    if ($(this).is(":checked") && $('#table_datatable_experiencia .dataTables_empty').length == 0) {
      $.dialogs.confirm('', ALERTA_EXCALL_EXP, function() {
        $('#div_tb_datatable_experiencia').hide();
        limpar_experiencias();
      });
    } else {
      $('#div_tb_datatable_experiencia').show();
      $("#id_sem_experiencia").attr('checked', false).change();
    };

  });

});
