function listar_ips() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA,
    container: "datatable_controle_ip",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TITULO_EDIT,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-11',
        "mRender": function(data, type, full) {
          return full['ip'];
        }
      },
      {
        "mData": TITULO_ACOES,
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = ''
          HTML += '<a href="#" title="' + TITULO_EXC + '" class="text-gray ip_delete_icon" onclick="excluir_registro(\'' + full["ip"] + '\')"> <i class="' + ICON_DELETE + '"></i></a>';
          return HTML;
        }
      },
    ]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

function excluir_registro(id) {
  $.dialogs.confirm('', ALERTA_EXC, function() {
    $.ajax({
      url: URL_EXCLUSAO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        ip: id
      },
      success: function(dados) {
        $.dialogs.success(dados['msg']);
        consultar();
      }
    });
  });
}


function salvar_registro() {
    $.ajax({
      url: URL_CADASTRO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        ip: $("#id_ip").val()
      },
      success: function(dados) {
        if(dados['status']=='ok'){
           $.dialogs.success(ALERTA_SUC_EDT);
           consultar();
           $("#id_btn_cancelar_controle_ip").click();
        } else {
           $.dialogs.error(dados['msg']);
        }
      }
    });
}

$(function() {

  $("#id_controle_ip_ativar").change(function(e) {
    e.preventDefault()
    var to_return;
    if ($(this).is(":checked")) {
      $(".show_on_controle_ip").show();
      listar_ips()
      to_return = true;
    } else {
        if($(".ip_delete_icon").length!=0){
          $.dialogs.confirm('', ALERTA_DESABILTA, function() {
            $.ajax({
              url: URL_DESABILITAR,
              type: 'get',
              dataType: 'json',
              async: false,
              data: { },
              success: function(dados) {
                $.dialogs.success(ALERTA_SUC_DEL);
                consultar();
                $(".show_on_controle_ip").hide();
                to_return = true;
              }
            });
          }, function(){
            $("#id_controle_ip_ativar").click();
            to_return = false;
          });
        } else {
          $(".show_on_controle_ip").hide();
          to_return = true;
        }
        return to_return;
    }
  });
  $("#id_controle_ip_ativar").change();

  $("#id_btn_novo_controle_ip").click(function(){
      $("#id_btn_novo_controle_ip").hide();
      $("#id_btn_cancelar_controle_ip, #form_controle_ip").show();
      $("#id_ip").val("");
  });

  $("#id_btn_cancelar_controle_ip").click(function(){
      $("#id_btn_novo_controle_ip").show();
      $("#id_btn_cancelar_controle_ip, #form_controle_ip").hide();
      $("#id_ip").val("");
  });

});
