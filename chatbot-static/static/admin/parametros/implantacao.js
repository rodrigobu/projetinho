
var BASE_MSG_VALIDA = 'Os campos do módulo "{0}" precisam ser preenchidos para efetuar a ativação do módulo.';

var submit_formulario = function(){

    if( $("#id_usa_fotos").is(":checked") ){
       if( $("#id_qtde_fotos_sistema").val()=="" ||
           $("#id_qtde_fotos_portal").val()=="" ||
           $("#id_limite_storage_fotos").val()==""){
          $("#id_qtde_fotos_sistema").focus();
          $.dialogs.error( format(BASE_MSG_VALIDA, LBL_FOTOS) );
          return false;
       }
    }

    if( $("#id_usa_integracao_catho").is(":checked") ){
       if( $("#id_catho_app_token").val()=="" ||
           $("#id_catho_auth_token").val()=="" ){
          $("#id_catho_app_token").focus();
          $.dialogs.error( format(BASE_MSG_VALIDA, LBL_CATHO) );
          return false;
       }
    }

    if( $("#id_usa_integracao_facebook").is(":checked") ){
        if( $("#id_facebook_application_id").val()=="" ||
            $("#id_facebook_secret_key").val()=="" ||
            $("#id_facebook_namespace").val()=="" ){
          $("#id_facebook_application_id").focus();
          $.dialogs.error( format(BASE_MSG_VALIDA, LBL_TESTES) );
          return false;
       }
    }

    if( $("#id_usa_linkedin").is(":checked") ){
        if( $("#id_linkedin_api_key").val()=="" ){
          $("#id_linkedin_api_key").focus();
          $.dialogs.error( format(BASE_MSG_VALIDA, LBL_LINKEDIN) );
          return false;
        }
    }

    if( $("#id_usa_multiportais").is(":checked") ){
        if( $("#id_qtde_multiportais").val()=="" ){
          $("#id_qtde_multiportais").focus();
          $.dialogs.error( format(BASE_MSG_VALIDA, LBL_MULTIPORTAIS) );
          return false;
        }
    }

  return true;

}

$(function(){

  $("#form_dados_implantacao").submit(submit_formulario);

  $("#id_usa_integracao_facebook").change(function(){
     if($(this).is(":checked")){
         $("#div_usa_integracao_facebook").show();
         $("#container_usa_integracao_facebook").addClass("col-md-6");
         $("#container_usa_integracao_facebook").removeClass("col-md-2");
         $("#id_facebook_application_id").focus();
     } else {
         $("#div_usa_integracao_facebook").hide();
         $("#container_usa_integracao_facebook").removeClass("col-md-6");
         $("#container_usa_integracao_facebook").addClass("col-md-2");
     }
  });

  $("#id_usa_integracao_catho").change(function(){
     if($(this).is(":checked")){
         $("#div_usa_integracao_catho").show();
         $("#container_usa_integracao_catho").addClass("col-md-6");
         $("#container_usa_integracao_catho").removeClass("col-md-2");
     } else {
         $("#div_usa_integracao_catho").hide();
         $("#container_usa_integracao_catho").removeClass("col-md-6");
         $("#container_usa_integracao_catho").addClass("col-md-2");
     }
  });

  $("#id_usa_fotos").change(function(){
     if($(this).is(":checked")){
         $("#div_usa_fotos").show();
         $("#container_usa_fotos").addClass("col-md-6");
         $("#container_usa_fotos").removeClass("col-md-2");
         $("#id_qtde_fotos_sistema").focus();
     } else {
         $("#div_usa_fotos").hide();
         $("#container_usa_fotos").removeClass("col-md-6");
         $("#container_usa_fotos").addClass("col-md-2");
     }
  });

  $("#id_usa_multiportais").change(function(){
      if($(this).is(":checked")){
         $("#div_usa_multiportais").show();
           $("#id_qtde_multiportais").focus();
      } else {
          $("#div_usa_multiportais").hide();
     }
  });

  $("#id_usa_testes").change(function(){
     if($(this).is(":checked")){
         $("#div_usa_testes").show();
         $("#container_usa_testes").addClass("col-md-4");
         $("#container_usa_testes").removeClass("col-md-2");
     } else {
         $("#div_usa_testes").hide();
         $("#container_usa_testes").removeClass("col-md-4");
         $("#container_usa_testes").addClass("col-md-2");
     }
  });


  $("#id_usa_questionario_selecao").change(function(){
     if($(this).is(":checked")){
         $("#div_usa_questionario_selecao").show();
         $("#container_usa_questionario_selecao").addClass("col-md-3");
         $("#container_usa_questionario_selecao").removeClass("col-md-2");
     } else {
         $("#div_usa_questionario_selecao").hide();
         $("#container_usa_questionario_selecao").removeClass("col-md-3");
         $("#container_usa_questionario_selecao").addClass("col-md-2");
     }
  });

  $("#id_usa_etalent").change(function(){
     if($(this).is(":checked")){
         $("#id_usa_testes").prop('checked', true);
         $("#id_usa_testes").change();
     }
  });

  $("#id_usa_linkedin").change(function(){
     if($(this).is(":checked")){
         $("#div_usa_linkedin").show();
         $("#container_usa_linkedin").addClass("col-md-4");
         $("#container_usa_linkedin").removeClass("col-md-2");
         $("#id_linkedin_api_key").focus();
     } else {
         $("#div_usa_linkedin").hide();
         $("#container_usa_linkedin").removeClass("col-md-4");
         $("#container_usa_linkedins").addClass("col-md-2");
     }
  });

});
