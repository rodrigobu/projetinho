var reabrir_modal_compromissos = function() {
  jQuery('#id_dialog_compromisso_notificacao').modal('show');
};

var fechar_modal_compromissos = function() {
  try {
    jQuery('#id_dialog_compromisso_notificacao').modal('hide');
    $(".modal-backdrop").remove();
  } catch (e) {}
}

var montar_modal_compromissos = function(data) {
  if (data["status"] == "ok") {
    $("#compromisso_notificacao_modal_body").html(data["html"]);
    reabrir_modal_compromissos();
  } else {
    jQuery('#id_dialog_compromisso_notificacao').modal('hide');
  }
};

var verificar_compromissos = function() {
  if ($('#id_dialog_compromisso_notificacao').is(":visible")) {
    return;
  }

  $("#compromisso_notificacao_modal_body").html("");
  $.ajax({
    cache: false,
    type: 'GET',
    url: URL_LISTAR_COMPROMISSOS_DE_AGORA,
    data: {},
    global: false,
    dataType: 'json',
    success: montar_modal_compromissos,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
};


var descartar_aviso_compromissos = function(codigo) {
  fechar_modal_compromissos();

  $.dialogs.confirm(TXT_DESATIVAR_COMPROMISSO_TITULO,
    TXT_DESATIVAR_COMPROMISSO_CONFIRM,
    function() {
      $.ajax({
        type: 'GET',
        url: URL_DESLIGAR_NOTIF_COMPROMISSO,
        async: false,
        data: {
          id_compromisso: codigo
        },
        success: function(retorno) {
          $.dialogs.success(TXT_DESATIVAR_COMPROMISSO_SUCESSO, function() {
            verificar_compromissos();
          });
        },
        error: function() {
          $.dialogs.error(TXT_DESATIVAR_COMPROMISSO_ERRO, function() {
            verificar_compromissos();
          });
        }
      });
    },
    function() {
      reabrir_modal_compromissos();
    }
  );
};

var adiar_aviso_compromissos = function(codigo) {
  var tempo_adiado = $("#form_adiar_"+codigo).find("[name='aviso_minutos_antec']").val();

  fechar_modal_compromissos();

  $.dialogs.confirm(TXT_ADIAR_COMPROMISSO_TITULO,
    TXT_ADIAR_COMPROMISSO_CONFIRM,
    function() {
      $.ajax({
        type: 'GET',
        url: URL_ADIAR_COMPROMISSO,
        async: false,
        data: {
          id_compromisso: codigo,
          tempo_adiado: tempo_adiado
        },
        success: function(retorno) {
          $.dialogs.success(TXT_ADIAR_COMPROMISSO_SUCESSO, function() {
            verificar_compromissos();
          });
        },
        error: function() {
          $.dialogs.error(TXT_ADIAR_COMPROMISSO_ERRO, function() {
            verificar_compromissos();
          });
        }
      });
    },
    function() {
      reabrir_modal_compromissos();
      $("#form_adiar_"+codigo).hide();
    }
  );
};

var form_adiar_aviso_compromissos = function(codigo) {
   $("#form_adiar_"+codigo).toggle();
};

$(function() {

  var verificador_compromisso = null;
  verificador_compromisso = setInterval(
    verificar_compromissos,
    FREQUENCIA_ATUALIZ_NOTIF_COMPOMISSOS
  );
  verificar_compromissos();

});
