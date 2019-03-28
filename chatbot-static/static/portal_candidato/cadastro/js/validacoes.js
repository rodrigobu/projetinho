var verificar_cpf = function() {

  if ($("#id_cpf").val() == '') {
    return true;
  }

  var to_return = true;
  mostrarCarregando();

  $.ajax({
    url: URL_CAND_CHECAR_CPF,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      cpf: $("#id_cpf").val(),
      codigo: $("#id_codigo").val(),
    },
    success: function(dados) {
      if (dados["status"] == 'nok') {
        $.dialogs.error(dados["msg"]);
        $("#id_cpf").val("");
        to_return = false;
      }
    },
    error: function() {
      to_return = false;
    },
    complete: esconderCarregando
  });

  return to_return;
};

var verificar_senha = function() {
  if (RegExp("^[A-Za-z0-9]*$").exec($("#id_password").val()) == undefined) {
    $.dialogs.error(TXT_SENHA_INVALIDA);
    $("#id_nova_senha").val("");
    return false;
  } else {
    return true;
  }
};

var verificar_confirm_senha = function() {
  if (($("#id_confirm_password").val() != '') &&
    ($("#id_password").val() != $("#id_confirm_password").val())) {
    $.dialogs.error(TXT_SENHA_N_CONFERE);
    $("#id_confirm_password").val("");
    return false;
  } else {
    return true;
  }
};

var verificar_foto = function() {
  // Validação de Foto obrigatória
  if (OBG_IMG) {
    if (!TEM_FOTO) {
      esconderCarregando();
      $.dialogs.error(TXT_IMG_OBG);
      return false;
    }
  }
  return true;
}

var valida_aceite = function() {
  if (!$("#id_aceita_termos").is(":checked")) {
    $.dialogs.success(TERMO_RESPONSABILIDADE_ALERTA);
    return false;
  } else {
    return true;
  }
};
