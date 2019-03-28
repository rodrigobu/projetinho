var mudar_status = function() {
  $.ajax({
    url: URL_FORM_STATUS,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
        vaga: VAGA_ID,
        status_vaga: $("#id_status_vaga").val()
    },
    success: function(retorno) {
        if($("#id_status_vaga").val() == 1 || $("#id_status_vaga").val() == 6){
          $("#data_encerramento").hide()
        } else {
          $("#data_encerramento").show()
        }
        // $("#div_status_form").html("");
        $("#div_status_form").html(retorno['html']);
    }
  });
}

function listar_historico() {
  TABELA_CONSULTA_HIST = $.DataTableXenon({
    json: URL_HISTORICO_JSON,
    container: "datatable_historico",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TITULO_DATA,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-1',
        "mRender": function(data, type, full) {
          return '<span val="' + full['data_hist'] + '" >' + full['data_hist'] + '</span>';
        }
      },
      {
        "mData": TITULO_USUARIO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2',
        "mRender": function(data, type, full) {
          return full['nome'];
        }
      },
      {
        "mData": TITULO_MOTIVO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-2',
        "mRender": function(data, type, full) {
          return full['motivo'];
        }
      },
      {
        "mData": TITULO_OBSERVACOES,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-7',
        "mRender": function(data, type, full) {
          return full['observacoes'];
        }
      }
    ]
  });
}

function consultar_historico() {
  TABELA_CONSULTA_HIST.reload();
}

$(function() {
  $("#id_status_vaga").change(mudar_status);
  listar_historico();
  listar_processo_seletivo();
  mudar_status();
});
