var abrir_form_trocar_senha = function() {
  $.ajax({
    url: URL_FORM_TROCAR_SENHA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {},
    success: function(retorno) {
      $("#id_cancelar_trocar_senha").show();
      $("#id_trocar_senha").hide();
      $("#div_troca_senha").html(retorno['html']);
    }
  });
}

var cancelar_trocar_senha = function() {
  $("#id_cancelar_trocar_senha").hide();
  $("#id_trocar_senha").show();
  $("#div_troca_senha").html('<input type="hidden" name="sem_senha" value="1" />');
}

var salvar_troca_senha = function() {
  $.ajax({
    url: URL_SALVAR_SENHA,
    type: 'post',
    cache: false,
    dataType: 'json',
    data: {
      id: USER_ID,
      password: $("#id_password").val(),
      novo_password: $("#id_novo_password").val(),
      confirm_password: $("#id_confirm_password").val(),
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno['msg']);
        cancelar_trocar_senha();
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

$(function() {

  $("#id_grupos").val(LISTA_GRUPOS).multiselect('refresh');
  $("#id_filiais").val(LISTA_FILIAIS).multiselect('refresh');

});
