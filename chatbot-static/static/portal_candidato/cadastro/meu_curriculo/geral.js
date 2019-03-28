var valida_tudo = function(aba) {
  if (!verificar_cpf()) {
    return false;
  } else if (!verificar_foto()) {
     return false;
  } else if ((CV_OBG && $("#id_tmp_file_cv").val() == "") && !TEM_CV) {
    $.dialogs.error(TXT_CV_OBG);
    esconderCarregando();
    return false;
  } else if (!$('#form_' + aba).parsley().validate()) {
    esconderCarregando();
    return false;
  }
  return true;
}

var limpar_fieldsets_vazios = function() {
  mostrarCarregando();
  // Deleta fieldsets que estão vazios
  $.each($("fieldset"), function(idx, value) {
    if ($(value).find(".control-label").length == 0 &&
      $(value).find(".btn:not(btn-salvar)").length == 0 &&
      $(value).find("textarea").length == 0) {
      $(value).remove();
    }
  });
  $.each($(".tab-pane"), function(idx, value) {
    if ($(value).find(".container-fluid fieldset").length == 0) {
      $(value).hide();
      $("#aba_" + $(value).attr('id')).parent().hide();
    } else {
      ativa_hash_location($(value).attr('id'));
    }
  });
  $.each($(".number_aba:visible"), function(idx, value) {
    $(value).html(idx + 1);
  });
  esconderCarregando();
};

var salvar = function(aba) {
  mostrarCarregando();
  if (!valida_tudo(aba)) {
    esconderCarregando();
    return false;
  } else {
    $('#form_' + aba).submit();
  }
  return false;
}

var iniciar_cv = function() {
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
        $('#id_tmp_file_cv').val('');
        $('#id_name_file_cv').val('');
        if (CV_OBG && !TEM_CV) {
          $("#id_cv").attr('required', true);
        }
        //$("#div_control_cv").hide();
      }
    }
  });
}

var excluir_cv = function(candidato_slug) {
  if (!CV_OBG) {
    $.dialogs.confirm(TXT_CONFIRMAR_EXCLUSAO_CV,
      function() {
        $.ajax({
          url: URL_EXCLUI_CV + candidato_slug,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {},
          success: function(dados) {
            if (dados["status"] == 'nok') {
              $.dialogs.error(dados["msg"]);
            } else {
              $.dialogs.success(dados["msg"]);
              $("#div_control_cv").hide();
              if (CV_OBG) {
                $("#id_cv").removeAttr('required');
              }
              TEM_CV = false;
            }
          },
        });
      })
  }
}

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
  $("#div_troca_senha").html('');
}

var salvar_troca_senha = function() {
  $.ajax({
    url: URL_SALVAR_SENHA,
    type: 'post',
    cache: false,
    dataType: 'json',
    data: {
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
  iniciar_dados();
  $("#id_deficiencias").val(DEFICIENCIAS_CAND).multiselect('refresh');
});
