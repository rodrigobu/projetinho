var INDICE_FUNCAO = 1;
var OLD_FUNCAO_FUNCAO_ATUAL = '';
var OLD_FUNCAO_NIVEL_ATUAL = '';

var cancelar_funcao = function(id_campo) {
  // Cancela a nova funcao
  $('#' + id_campo).remove();
}

var abrir_form_nova_funcao = function() {
  // Monta o formuário para nova função

  // Não deixa abrir novo formulario se o anterior estiver sem função
  var vazia = false;
  $.each($(".campo_funcao"), function(idx, value) {
    if (!$(value).val()) {
      vazia = true;
    }
  });
  if (vazia) {
    $.dialogs.error(TXT_ALERT_FUNCAO_N_PREENCHIDAS);
    return false;
  }

  $.ajax({
    url: URL_FORM_FUNCAO,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      indice: INDICE_FUNCAO,
      candidato: CANDID,
    },
    success: function(retorno) {
      $("#div_funcoes").append(retorno['html']);
      INDICE_FUNCAO += 1;
      validar_funcoes_duplicadas();
    }
  });
}

var validar_funcoes_duplicadas = function() {
  $(".campo_funcao").off("change");
  $(".campo_funcao").on("change", function() {

    var id = $(this).attr('id');
    var valor = $("#" + id).val();

    var achei = false;
    $.each($(".campo_funcao"), function(idx, value) {
      if (!achei && ($(value).val() == valor) && ($(value).attr('id') != id)) {
        achei = true;
      }
    });

    if (achei) {
      $.dialogs.error(TXT_ALERT_FUNCAO_DUPLICADA);
      $(this).val("")
    }

  });
}

var tratar_funcoes = function() {
  // -- Capta os formulários de Funções preenchidos e coloca em um campo texto escondido
  var funcoes = [];
  $.each($(".campo_funcao"), function(idx, value) {
    var id = $(value).attr('id');
    var indice = id.replace('id_funcao_funcao_', '');
    var id_nivel = 'id_funcao_nivel_' + indice;
    if ($("#" + id).val()) {
      funcoes.push($("#" + id).val() + ':' + $("#" + id_nivel).val());
    }
  });
  $("#id_funcoes").val(funcoes.join("|"));
}


var remover_funcao = function(indice) {
  $.dialogs.confirm('', TXT_CONFIRMAR_EXCLUIR_FUNCAO,
    function() {
      $.ajax({
        url: URL_DELETAR_FUNCAO,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: $("#id_id_candfuncao_" + indice).val()
        },
        success: function(retorno) {
          $.dialogs.success(TXT_SUCESSO_EXCLUIR_FUNCAO);
          $("#div_funcao_" + indice).remove();
        }
      });
    }
  );
}

var editar_funcao = function(indice) {
  // Abre a Edição da função e guarda o valor antigo para caso cancelamento
  OLD_FUNCAO_FUNCAO_ATUAL = $("#id_funcao_funcao_" + indice).val();
  OLD_FUNCAO_NIVEL_ATUAL = $("#id_funcao_nivel_" + indice).val();
  $("#id_funcao_funcao_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_funcao_nivel_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_editar_funcao_" + indice).hide();
  $("#id_remover_funcao_" + indice).hide();
  $("#id_salvar_funcao_" + indice).show();
  $("#id_cancelar_funcao_" + indice).show();
}

var cancelar_edicao_funcao = function(indice) {
  // Cancela a Edição da função e retorna o valor antigo para os campos
  $("#id_funcao_funcao_" + indice).val(OLD_FUNCAO_FUNCAO_ATUAL);
  $("#id_funcao_nivel_" + indice).val(OLD_FUNCAO_NIVEL_ATUAL);
  OLD_FUNCAO_FUNCAO_ATUAL = "";
  OLD_FUNCAO_NIVEL_ATUAL = "";
  $("#id_funcao_funcao_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_funcao_nivel_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_editar_funcao_" + indice).show();
  $("#id_remover_funcao_" + indice).show();
  $("#id_salvar_funcao_" + indice).hide();
  $("#id_cancelar_funcao_" + indice).hide();
}

var salvar_funcao = function(indice) {
  $.ajax({
    url: URL_SALVAR_FUNCAO,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      id_edicao: $("#id_id_candfuncao_" + indice).val(),
      funcao: $("#id_funcao_funcao_" + indice).val(),
      nivel: $("#id_funcao_nivel_" + indice).val(),
      candidato: CANDID,
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno['msg']);
        OLD_FUNCAO_FUNCAO_ATUAL = $("#id_funcao_funcao_" + indice).val();
        OLD_FUNCAO_NIVEL_ATUAL = $("#id_funcao_nivel_" + indice).val();
        cancelar_edicao_funcao(indice);
        $("#id_cancelar_funcao_" + indice).attr('onclick', 'cancelar_edicao_funcao("' + indice + '")');
        $("#id_id_candfuncao_" + indice).val(retorno['codigo']);
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

$(function() {
  INDICE_FUNCAO = $(".campo_funcao").length;
  validar_funcoes_duplicadas();
})
