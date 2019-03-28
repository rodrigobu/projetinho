var gerar_codigo_seguranca_ead = function() {
  $.ajax({
    url: URL_GERAR_CODIGO_EAD,
    type: 'GET',
    cache: false,
    async: false,
    data: {},
    success: function(retorno) {
      $('#id_codigo_acesso_ead').val(retorno["codigo"]);
    }
  });
};
