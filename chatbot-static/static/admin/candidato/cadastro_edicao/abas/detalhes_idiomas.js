var INDICE_IDIOMA = 0;
var OLD_IDIOMA_IDIOMA_ATUAL = '';
var OLD_IDIOMA_NIVEL_ATUAL = '';

var cancelar_idioma = function(id_campo) {
  // Cancela o novo idioma
  $('#' + id_campo).remove();
}

var abrir_form_novo_idioma = function() {
  // Monta o formuário para novo idioma

  // Não deixa abrir novo formulario se o anterior estiver sem idioma
  var vazia = false;
  $.each($(".campo_idioma"), function(idx, value) {
    if (!$(value).val()) {
      vazia = true;
    }
  });
  if (vazia) {
    $.dialogs.error(TXT_ALERT_IDIOMA_N_PREENCHIDAS);
    return false;
  }

  $.ajax({
    url: URL_FORM_IDIOMA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      indice: INDICE_IDIOMA,
      candidato: CANDID,
    },
    success: function(retorno) {
      $("#div_idiomas").append(retorno['html']);
      INDICE_IDIOMA += 1;
      validar_idiomas_duplicados();
    }
  });
}

var validar_idiomas_duplicados = function() {
  $(".campo_idioma").off("change");
  $(".campo_idioma").on("change", function() {

    var id = $(this).attr('id');
    var valor = $("#" + id).val();

    var achei = false;
    $.each($(".campo_idioma"), function(idx, value) {
      if (!achei && ($(value).val() == valor) && ($(value).attr('id') != id)) {
        achei = true;
      }
    });

    if (achei) {
      $.dialogs.error(TXT_ALERT_IDIOMA_DUPLICADO);
      $(this).val("")
    }

  });
}

var tratar_idiomas = function() {
  // -- Capta os formulários de Idiomas preenchidos e coloca em um campo texto escondido
  var idiomas = [];
  $.each($(".campo_idioma"), function(idx, value) {
    var id = $(value).attr('id');
    var indice = id.replace('id_idioma_idioma_', '');
    var id_nivel = 'id_idioma_nivel_' + indice;
    if ($("#" + id).val()) {
      idiomas.push($("#" + id).val() + ':' + $("#" + id_nivel).val());
    }
  });
  $("#id_idiomas").val(idiomas.join("|"));
}


var remover_idioma = function(indice) {
  $.dialogs.confirm('', TXT_CONFIRMAR_EXCLUIR_IDIOMA,
    function() {
      $.ajax({
        url: URL_DELETAR_IDIOMA,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: $("#id_id_candidioma_" + indice).val()
        },
        success: function(retorno) {
          $.dialogs.success(TXT_SUCESSO_EXCLUIR_IDIOMA);
          $("#div_idioma_" + indice).remove();
        }
      });
    }
  );
}

var editar_idioma = function(indice) {
  // Abre a Edição da função e guarda o valor antigo para caso cancelamento
  OLD_IDIOMA_IDIOMA_ATUAL = $("#id_idioma_idioma_" + indice).val();
  OLD_IDIOMA_NIVEL_ATUAL = $("#id_idioma_nivel_" + indice).val();
  $("#id_idioma_idioma_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_idioma_nivel_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_editar_idioma_" + indice).hide();
  $("#id_remover_idioma_" + indice).hide();
  $("#id_salvar_idioma_" + indice).show();
  $("#id_cancelar_idioma_" + indice).show();
}

var cancelar_edicao_idioma = function(indice) {
  // Cancela a Edição da função e retorna o valor antigo para os campos
  $("#id_idioma_idioma_" + indice).val(OLD_IDIOMA_IDIOMA_ATUAL);
  $("#id_idioma_nivel_" + indice).val(OLD_IDIOMA_NIVEL_ATUAL);
  OLD_IDIOMA_IDIOMA_ATUAL = "";
  OLD_IDIOMA_NIVEL_ATUAL = "";
  $("#id_idioma_idioma_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_idioma_nivel_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_editar_idioma_" + indice).show();
  $("#id_remover_idioma_" + indice).show();
  $("#id_salvar_idioma_" + indice).hide();
  $("#id_cancelar_idioma_" + indice).hide();
}

var salvar_idioma = function(indice) {
  $.ajax({
    url: URL_SALVAR_IDIOMA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      id_edicao: $("#id_id_candidioma_" + indice).val(),
      idioma: $("#id_idioma_idioma_" + indice).val(),
      nivel: $("#id_idioma_nivel_" + indice).val(),
      candidato: CANDID,
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno['msg']);
        OLD_IDIOMA_IDIOMA_ATUAL = $("#id_idioma_idioma_" + indice).val();
        OLD_IDIOMA_NIVEL_ATUAL = $("#id_idioma_nivel_" + indice).val();
        cancelar_edicao_idioma(indice);
        $("#id_cancelar_idioma_" + indice).attr('onclick', 'cancelar_edicao_idioma("' + indice + '")');
        $("#id_id_candidioma_" + indice).val(retorno['codigo']);
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

$(function() {
  INDICE_IDIOMA = $(".campo_idioma").length;
  validar_idiomas_duplicados();
})
