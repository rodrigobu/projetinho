
function consultar() {

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_JSON,
    container: "datatable_consulta",
    filterForm: '#filtro_consulta',
    order: [
      [1, "asc"]
    ],
    aoColumns: [{
        "sTitle": "<input class='center' name='selecionar-todas' type='checkbox'>",
        'sType': 'html',
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center',
        "mRender": function(data, type, full) {
          return "<input class='center checkbox_vaga' vaga='" + full["vaga_id"] + "' name='selecionar-vaga' type='checkbox'>";
        }
      }, {
        "mData": TXT_COL_CLIENTE,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-5',
        "mRender": render_cliente_coluna_padrao
      },
      {
        "mData": TXT_COL_DESCCONT,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-5',
        "mRender": render_vaga_coluna_padrao
      },
      {
        "mData": TXT_COL_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'text-center col-sm-1',
        "mRender": function(data, type, full) {
          var HTML = '';
          HTML += gerar_link_edicao_cliente(full);
          HTML += gerar_link_edicao_vaga(full);
          return HTML;
        }
      }
    ],
    complete: function(){
        $("[name='selecionar-todas']").change(function() {
          _selecionar_lote($(this).is(":checked"));
        });
    }
  });

}

function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}


var exportar = function() {
  mostrarCarregando();

  var ids_vaga = "";
  $.each($("[name='selecionar-vaga']:checked"), function(id, value) {
    ids_vaga += $(value).attr("vaga") + ',';
  });

  $.ajax({
    url: URL_GERAR_PLACA,
    type: 'post',
    dataType: 'json',
    async: false,
    data: {
      'ids_vaga': ids_vaga,
      'documento': $('#id_documento').val(),
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno["msg"], retorno["titulo"], function(resp) {
          if (resp) {
            window.open(get_base_path_windows() + retorno["url"], '_blank');
            $('#bt_filtrar').click();
          }
        });
      } else {
        $.dialogs.error(retorno["msg"]);
      }
    },
    complete: function() {
      esconderCarregando();
    }
  });

};



var _selecionar_lote = function(adicionar) {
  if (adicionar) {
    $(".checkbox_vaga").prop("checked", "checked");
  } else {
    $(".checkbox_vaga").removeAttr("checked");
  }
};

$(function() {
  consultar();
  $("#id_btn_filtrar").click(consultar);


  $("[name='selecionar-todas']").on("click", function() {
    _selecionar_lote($(this).is(":checked"));
  });

});
