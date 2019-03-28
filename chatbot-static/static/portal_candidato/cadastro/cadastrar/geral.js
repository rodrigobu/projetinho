
var valida_tudo_primeiro_form = function() {
  if (!verificar_senha()) {
    return false;
  } else if (!verificar_confirm_senha()) {
    return false;
  } else if (!verificar_foto()) {
    return false;
  } else if (!valida_aceite()) {
    return false;
  } else if (!$('#form_dados').parsley().validate()) {
    esconderCarregando();
    return false;
  }
  return true;
}

var valida_tudo = function() {
  if (!verificar_senha()) {
    return false;
  } else if (!verificar_confirm_senha()) {
    return false;
  } else if (!verificar_cpf()) {
    return false;
  } else if (!verificar_foto()) {
    return false;
  } else if (!verificar_fotos()) {
    return false;
  } else if (CV_OBG && $("#id_tmp_file_cv").val() == "") {
    $.dialogs.error(TXT_CV_OBG);
    esconderCarregando();
    return false;
  } else if (!valida_aceite()) {
    return false;
  } else if (!$('#form_dados').parsley().validate()) {
    esconderCarregando();
    return false;
  }
  return true;
}

var limpar_fieldsets_vazios = function() {
  // Deleta fieldsets que estão vazios
  $.each($("fieldset"), function(idx, value) {
    if ($(value).hasClass('not_hide')) {
      return;
    }
    if ($(value).find(".control-label").length == 0 &&
      $(value).find(".btn").length == 0 &&
      $(value).find("textarea").length == 0) {
      $(value).hide();
    }
  });
};

var change_sem_experiencia = function() {
  if (!$(this).is(':checked')) {
    $("#div_cad_experiencias").show();
  } else {
    $("#div_cad_experiencias").hide();
    $("#div_experiencia").html('');
  }
}

var click_salvar = function() {
  mostrarCarregando();
  if (!valida_tudo()) {
    esconderCarregando();
    return false;
  } else {
    tratar_funcoes();
    tratar_idiomas();
    tratar_convivencias();
    tratar_experiencias();
    $('#form_dados').submit();
    return true;
  }
  return false;
}

var salvar_primeiro_form = function() {
  mostrarCarregando();
  if (!valida_tudo_primeiro_form()) {
    esconderCarregando();
    return false;
  } else {
    tratar_funcoes();
    mostrarCarregando();
    $.ajax({
      url: URL_CAND_PRE_CADASTRO,
      type: 'post',
      dataType: 'json',
      async: false,
      data: serializaForm('#form_dados'),
      success: function(dados) {
        if (dados["status"] == 'nok') {
          $.dialogs.error(dados["msg"]);
        } else {
          $.dialogs.success(dados["aviso"]);
          $('#id_codigo').val(dados["msg"]);
          $('#div_segundo_formulario').show();
          $('#salvar_primeiro_form').hide();
          $('#salvar_segundo_form').show();
        }
      },
      complete: esconderCarregando
    });

    return true;
  }
  return false;
}

var limpar_cv = function() {
  $('#id_tmp_file_cv').val('');
  $('#id_name_file_cv').val('');
  if (CV_OBG) {
    $("#id_cv").attr('required', true);
  }
  $("#div_btn_limpar_cv").hide();
}

var iniciar_cv = function() {

  if (FILE_CV_NAME) {
    $('#help_block_cv').html('<span class="text-success">' + FILE_CV_NAME + "</span>");
    $('#id_tmp_file_cv').val(FILE_CV_PATH);
    $('#id_name_file_cv').val(FILE_CV_NAME);
    if (CV_OBG) {
      $("#id_cv").removeAttr('required');
    }
  }

  $('#id_cv').fileupload({
    url: URL_VALIDA_CV,
    dataType: 'json',
    done: function(e, data) {
      if (data.result['status'] == 'ok') {
        $('#help_block_cv').html('<span class="text-success">' + data.result['file_name'] + "</span>");
        $('#id_tmp_file_cv').val(data.result['tmp_file']);
        $('#id_name_file_cv').val(data.result['file_name']);
        if (CV_OBG) {
          $("#id_cv").removeAttr('required');
        }
      } else {
        $('#help_block_cv').html('<span class="text-danger">' + data.result['tmp_file'] + "</span>");
        limpar_cv()
      }
    }
  });

}

var verificar_fotos = function() {
  var validas = true;
  if (MODULO_FOTOBOOK && FOTOBOOK_OBG) {
    $.each($('.fotobook'), function(idx, value) {
      if ($(value).val() == '') {
        validas = false;
      }
    });
  }
  if (!validas) {
    $.dialogs.error(TXT_FOTOBOOK_OBG);
  }
  return validas;
};


var fechar_termo = function(){
  $("#div_termo_responsabilidade").hide();
  $("#id_btn_fechar_termo").hide();
  $("#id_btn_abrir_termo").show();
}

var abrir_termo = function(){
  $("#div_termo_responsabilidade").show();
  $("#id_btn_fechar_termo").show();
  $("#id_btn_abrir_termo").hide();
}

$(function() {
  iniciar_dados();
  validar_funcoes_duplicadas();
  $("#id_password").change(verificar_senha);
  $("#id_confirm_password").change(verificar_confirm_senha);
  $("#id_aceita_termos").click();
  $("#id_btn_salvar_primeiro").click(salvar_primeiro_form);
  $("#id_btn_salvar").click(click_salvar);
  $("#id_deficiencias").val(DEFICIENCIAS_CAND).multiselect('refresh');
  INDICE_FUNCAO = $(".campo_funcao").length;
  INDICE_CONVIVENCIA = $(".campo_convivencia").length;
  INDICE_IDIOMA = $(".campo_idioma").length;
  INDICE_EXPERIENCIA = $(".campo_experiencia").length;
  $("#conteiner_pg_seguro").find('form').attr('target', "_blank");

  // Isso aqui garante que o parsley só vai validar os campos que estão visiveis
  Parsley.on('field:validated', function(fieldInstance){
      if (fieldInstance.$element.is(":hidden")) {
          fieldInstance._ui.$errorsWrapper.css('display', 'none');
          fieldInstance.validationResult = true;
          return true;
      } else {
          fieldInstance._ui.$errorsWrapper.css('display', 'block');
      }
  });


  $("#id_btn_abrir_termo").click(abrir_termo);
  $("#id_btn_fechar_termo").click(fechar_termo);

});
