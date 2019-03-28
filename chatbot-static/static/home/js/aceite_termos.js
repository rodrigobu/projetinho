var fechar_termo = function() {
  $("#div_termo_responsabilidade").hide();
  $("#id_btn_fechar_termo").hide();
  $("#id_btn_abrir_termo").show();
}

var abrir_termo = function() {
  $("#div_termo_responsabilidade").show();
  $("#id_btn_fechar_termo").show();
  $("#id_btn_abrir_termo").hide();
}

var aceitar_termo = function() {
  $.ajax({
    url: URL_ACEITA_TERMOS,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {},
    success: function(dados) {
      if (dados["status"] == 'nok') {
        $.dialogs.error(dados["msg"]);
      } else {
        $.dialogs.success(dados["msg"]);
        $('#painel_aceite_termos').remove();
      }
    },
    complete: esconderCarregando
  });
}
