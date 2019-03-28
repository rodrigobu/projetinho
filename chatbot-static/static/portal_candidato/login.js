var logar = function() {
  var username = $("#username").val();
  if(APPLY_SCRIPT){
      var passwd = md5($("#passwd").val());
  } else {
      var passwd = $("#passwd").val();
  }
  var token = makeKey(passwd, '{ "usuario" : "' + username + '" }');
  $("#token").val(token);
  $("#login").submit();
};

var abrir_recuperacao = function(){
  $('#container_login').hide();
  $('#container_recuperacao_senha').show();
};

var fechar_recuperacao = function(){
  $('#container_login').show();
  $('#container_recuperacao_senha').hide();
};

var recuperar_senha = function(){

    $.ajax({
      url: URL_RECUPERAR_SENHA,
      type: 'post',
      dataType: 'json',
      data: {
        'cpf': $('#username_recupera_senha').val()
      },
      success: function(data) {
        // Acrescenta na paginação
        if (data.status=='ok') {
          $.dialogs.success(data.msg);
          fechar_recuperacao();
          $('#username_recupera_senha').val("");
        } else {
          $.dialogs.error(data.msg);
        }
      }
    });

};

$(function() {

  $("#btn_submit").click(logar);
  $("#login input").keypress(function(e) {
    if (e.which == 13) {
      logar()
    }
  });

  $("#btn_recupera_senha").click(recuperar_senha);
  $("#recuperacao_senha input").keypress(function(e) {
    if (e.which == 13) {
      recuperar_senha()
    }
  });


});
