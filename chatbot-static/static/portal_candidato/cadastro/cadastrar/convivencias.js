
var INDICE_CONVIVENCIA = 0;

var remover_convivencia = function(id_campo) {
  $('#' + id_campo).remove();
}

var abrir_form_nova_convivencia = function(){
  var vazia = false;
  $.each($(".campo_convivencia"), function(idx, value) {
    if (!$(value).val()) {
      vazia = true;
    }
  });
  if (vazia) {
    $.dialogs.error(TXT_ALERT_CONVIVENCIA_N_PREENCHIDAS);
    return false;
  }
  $.ajax({
    url: URL_FORM_CONVIVENCIA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      indice: INDICE_CONVIVENCIA
    },
    success: function(retorno) {
      $("#div_grupo_convivencia").append(retorno['html']);
      make_datepicker("#id_" + retorno['name_dt_nasc']);
      INDICE_CONVIVENCIA += 1;
    }
  });
}

var tratar_convivencias = function(){
  var convivencias = [];
  $.each($(".campo_convivencia"), function(idx, value) {
    var id = $(value).attr('id');
    var indice = id.replace('id_convivencia_nome_', '');
    var nome = $('#id_convivencia_nome_' + indice).val();
    var dt_nasc = $('#id_convivencia_dt_nasc_' + indice).val();
    var cpf = $('#id_convivencia_cpf_' + indice).val();
    var n_sus = $('#id_convivencia_n_sus_' + indice).val();
    var dependente = $('#id_convivencia_dependente_' + indice).is(':checked');
    var relacao = $('#id_convivencia_relacao_' + indice).val();

    if ($("#" + id).val()) {
      convivencias.push(nome + '|:|' + dt_nasc+ '|:|' + cpf + '|:|' + n_sus + '|:|' + dependente + '|:|' + relacao);
    }
  });
  $("#id_convivencias").val(convivencias.join("&&&"));

}
