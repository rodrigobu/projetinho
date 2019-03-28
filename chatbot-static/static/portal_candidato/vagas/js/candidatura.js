
var redirecionarParaLogin = function(){
  // Redireciona ou não para o Login
  $.dialogs.confirm(
    TXT_TITLE_LOGIN_REQ,
    TXT_MSG_LOGIN_REQ,
    function(param){
      window.location.href =  URL_CANDIDATURA_LOGIN;
    }
  );
};



var candidatar = function(vaga_slug){

    if(CAND_ID==''){
        redirecionarParaLogin(vaga_slug);
        return;
    }
    // CANDIDATURA
    $.ajax({
      url : URL_REALIZA_CANDIDATURA,
      type : 'get',
      cache : false,
      dataType : 'json',
      data : { id_vaga : vaga_slug },
      success : function(retorno) {
        if (retorno["status"]=='ok'){
          $.dialogs.success(
            retorno["msg"],
            function(){
                $("#btn_ja_candidatou").show();
                $("#btns_n_candidatou").hide();
                window.location.href = "";
            }
          );
        } else {
          if (retorno["status"]=='nok'){
            $.dialogs.error(retorno["msg"]);
            esconderCarregando();
          }
        }
      }
    });

};
