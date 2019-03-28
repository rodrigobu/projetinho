var INDICE_IDIOMA = 0;

var remover_idioma = function(id_campo) {
  $('#' + id_campo).remove();
}

var abrir_form_novo_idioma = function() {
  // Não deixa abrir novo formulario se o anterior estiver sem função
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
      indice: INDICE_IDIOMA
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
