var gerar_codigo_seguranca_xml = function() {
  $.ajax({
    url: URL_GERAR_CODIGO_SEG,
    type: 'GET',
    cache: false,
    async: false,
    data: {},
    success: function(retorno) {
      $('#id_codigo_xml_vagas').val(retorno["codigo"]);
    }
  });
};

var remover_banner = function(id_banner) {
  $.dialogs.confirm(TXT_CONFIRMA, TXT_TITLE_EXCLUIR_BANNER, function(r) {
    if (r) {
      $.ajax({
        url: URL_EXCLUIR_BANNER_PREMIUM,
        type: 'get',
        dataType: 'json',
        cache: true,
        data: {
          banner_pagseguro: id_banner
        },
        success: function(dados) {
          window.location.href = window.location.href;
          window.location.reload();
        }
      });
    }
  });
}

var gerar_apikey_bne = function() {
  var cpf = $('#id_bne_cpf_user')[0].value.replace(/[^0-9]/g, "");
  var guid = $('#id_bne_key_sistema')[0].value;
  var dn = "";
  if ($('#id_bne_data_nasc')[0] != "") {
    var split = $('#id_bne_data_nasc')[0].value.split("/");
    if (split.length == 3) {
      dn = split[2] + "-" + split[1] + "-" + split[0];
    }
  }
  var info = {
    "CPF": parseInt(cpf),
    "DataNascimento": dn,
    "Sistema": guid
  };
  var key = Base64.encode(JSON.stringify(info));
  if (key && key.trim() != "") {
    console.log("added key " + key);
  }
  $('#id_bne_apikey').val(key);
};

$(function() {

  $("#id_sms_servico").on("change", function() {
    if ($("#id_sms_servico").val() == '' || $("#id_sms_servico").val() == 'lemeconsultoria') {
      $("#div_sms_config").hide();
      $("#id_sms_login").val("-");
      $("#id_sms_senha").val("-");
    } else {
      $("#div_sms_config").show();
      $("#id_sms_login").val("");
      $("#id_sms_senha").val("");
    }
  });

  if ($("#id_sms_servico").val() == '' || $("#id_sms_servico").val() == 'lemeconsultoria') {
    $("#div_sms_config").hide();
  } else {
    $("#div_sms_config").show();
  }

  $(".img_del_banner_premium").on("click", remover_banner);

  $("#id_bne_habilitada").on("change", function() {
    if ($(this).is(":checked")) {
      $("#div_campos_bne").show();
      make_obrigatorio('bne_key_sistema');
      make_obrigatorio('bne_cpf_user');
      make_obrigatorio('bne_data_nasc');
    } else {
      $("#div_campos_bne").hide();
      remove_obrigatorio('bne_key_sistema');
      remove_obrigatorio('bne_cpf_user');
      remove_obrigatorio('bne_data_nasc');
    }
  });
  $("#id_bne_habilitada").change();

  $('#id_bne_cpf_user, #id_bne_key_sistema, #id_bne_data_nasc').on("change", function() {
    gerar_apikey_bne();
  });

  $("#id_link_ead_pme").change(function(){
     if($(this).val()!='' && $("#id_codigo_acesso_ead").val()==''){
         gerar_codigo_seguranca_ead()
     }
  });

  $("#button-id-bt_salvar_integracoes").click(function(e){
    //  if(validacaoFormIntegracao()){
          $("#form_integracoes").submit();
    //  }
  })

});
