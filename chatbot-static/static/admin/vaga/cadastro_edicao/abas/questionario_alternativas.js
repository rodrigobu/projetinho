var INDICE_ALTERNATIVA = 0;
var OLD_ALTERNATIVA_DESCRICAO_ATUAL = '';
var OLD_ALTERNATIVA_RESPOSTA_CORRETA_ATUAL = '';

var cancelar_alternativa = function(id_campo) {
  // Cancela o novo alternativa
  $('#' + id_campo).remove();
}

var abrir_form_nova_alternativa = function() {
  // Monta o formuário para novo alternativa

  // Não deixa abrir novo formulario se o anterior estiver sem alternativa
  var vazia = false;
  $.each($(".campo_alternativa"), function(idx, value) {
    if (!$(value).val()) {
      vazia = true;
    }
  });
  if (vazia) {
    $.dialogs.error(TXT_ALERT_ALTERNATIVA_N_PREENCHIDAS);
    return false;
  }

  $.ajax({
    url: URL_FORM_ALTERNATIVA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      indice: INDICE_ALTERNATIVA,
      vagaentrevista: VAGAENTREVISTAID,
    },
    success: function(retorno) {
      $("#div_alternativas").append(retorno['html']);
      INDICE_ALTERNATIVA += 1;
      validar_alternativas_duplicadas();
    }
  });
}

var validar_alternativas_duplicadas = function() {
  $(".campo_alternativa").off("change");
  $(".campo_alternativa").on("change", function() {

    var id = $(this).attr('id');
    var valor = $("#" + id).val();

    var achei = false;
    $.each($(".campo_alternativa"), function(idx, value) {
      if (!achei && ($(value).val() == valor) && ($(value).attr('id') != id)) {
        achei = true;
      }
    });

    if (achei) {
      $.dialogs.error(TXT_ALERT_ALTERNATIVA_DUPLICADO);
      $(this).val("")
    }

  });
}

var tratar_alternativas = function() {
  // -- Capta os formulários de Idiomas preenchidos e coloca em um campo texto escondido
  var alternativas = [];
  $.each($(".campo_alternativa"), function(idx, value) {
    var id = $(value).attr('id');
    var indice = id.replace('id_vaga_entrevista_descricao_', '');
    var resposta_correta = 'id_vaga_entrevista_resposta_correta_' + indice;
    if ($("#" + id).val()) {
      alternativas.push($("#" + id).val() + ':' + $("#" + resposta_correta).is(':checked'));
    }
  });
  $("#id_alternativas").val(alternativas.join("|"));
}

var remover_alternativa = function(indice) {
  $.dialogs.confirm('', TXT_CONFIRMAR_EXCLUIR_ALTERNATIVA,
    function() {
      $.ajax({
        url: URL_DELETAR_ALTERNATIVA,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: $("#id_id_alternativa_" + indice).val()
        },
        success: function(retorno) {
          $.dialogs.success(TXT_SUCESSO_EXCLUIR_ALTERNATIVA);
          $("#div_alternativa_" + indice).remove();
        }
      });
    }
  );
}

var editar_alternativa = function(indice) {
  // Abre a Edição da função e guarda o valor antigo para caso cancelamento
  OLD_ALTERNATIVA_DESCRICAO_ATUAL = $("#id_vaga_entrevista_descricao_" + indice).val();
  OLD_ALTERNATIVA_RESPOSTA_CORRETA_ATUAL = $("#id_vaga_entrevista_resposta_correta_" + indice).val();
  $("#id_vaga_entrevista_descricao_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_vaga_entrevista_resposta_correta_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_editar_alternativa_" + indice).hide();
  $("#id_remover_alternativa_" + indice).hide();
  $("#id_salvar_alternativa_" + indice).show();
  $("#id_cancelar_alternativa_" + indice).show();
}

var cancelar_edicao_alternativa = function(indice) {
  // Cancela a Edição da função e retorna o valor antigo para os campos
  $("#id_vaga_entrevista_descricao_" + indice).val(OLD_ALTERNATIVA_DESCRICAO_ATUAL);
  $("#id_vaga_entrevista_resposta_correta_" + indice).val(OLD_ALTERNATIVA_RESPOSTA_CORRETA_ATUAL);
  OLD_ALTERNATIVA_DESCRICAO_ATUAL = "";
  OLD_ALTERNATIVA_RESPOSTA_CORRETA_ATUAL = "";
  $("#id_vaga_entrevista_descricao_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_vaga_entrevista_resposta_correta_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_editar_alternativa_" + indice).show();
  $("#id_remover_alternativa_" + indice).show();
  $("#id_salvar_alternativa_" + indice).hide();
  $("#id_cancelar_alternativa_" + indice).hide();
}

var salvar_alternativa = function(indice) {
  $.ajax({
    url: URL_SALVAR_ALTERNATIVA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      id_edicao: $("#id_id_alternativa_" + indice).val(),
      alternativa: $("#id_vaga_entrevista_descricao_" + indice).val(),
      resposta_correta: $("#id_vaga_entrevista_resposta_correta_" + indice).is(':checked'),
      vagaentrevista: VAGAENTREVISTAID,
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno['msg']);
        OLD_ALTERNATIVA_DESCRICAO_ATUAL = $("#id_vaga_entrevista_descricao_" + indice).val();
        OLD_ALTERNATIVA_RESPOSTA_CORRETA_ATUAL = $("#id_vaga_entrevista_resposta_correta_" + indice).val();
        cancelar_edicao_alternativa(indice);
        $("#id_cancelar_alternativa_" + indice).attr('onclick', 'cancelar_edicao_alternativa("' + indice + '")');
        $("#id_id_alternativa_" + indice).val(retorno['codigo']);
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

$(function() {
  INDICE_ALTERNATIVA = $(".campo_alternativa").length;
  validar_alternativas_duplicadas();
})
