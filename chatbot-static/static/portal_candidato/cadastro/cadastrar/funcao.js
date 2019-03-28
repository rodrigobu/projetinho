var INDICE_FUNCAO = 1;

var remover_funcao = function(id_campo) {
  $('#' + id_campo).remove();
}

var abrir_form_nova_funcao = function() {
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
      indice: INDICE_FUNCAO
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
