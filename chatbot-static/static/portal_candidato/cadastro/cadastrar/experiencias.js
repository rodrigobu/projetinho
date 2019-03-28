
var INDICE_EXPERIENCIA = 0;

var remover_experiencia = function(id_campo) {
  $('#' + id_campo).remove();
}

var abrir_form_nova_experiencia = function(execute_after){
  var vazia = false;
  $.each($(".campo_experiencia"), function(idx, value) {
    if (!$(value).val()) {
      vazia = true;
    }
  });
  if (vazia) {
    $.dialogs.error(TXT_ALERT_EXPERIENCIA_N_PREENCHIDAS);
    return false;
  }
  $.ajax({
    url: URL_FORM_EXPERIENCIA,
    type: 'get',
    cache: false,
    dataType: 'json',
    async: false,
    data: {
      indice: INDICE_EXPERIENCIA
    },
    success: function(retorno) {
      $("#div_experiencias").append(retorno['html']);
      INDICE_EXPERIENCIA += 1;
      make_datepicker("#id_" + retorno['name_dt_admissao']);
      make_datepicker("#id_" + retorno['name_dt_demissao']);
      try{
        execute_after()
      }catch(e){}
    }
  });
}


var tratar_experiencias = function(){
  var experiencias = [];
  $.each($(".campo_experiencia"), function(idx, value) {
    var id = $(value).attr('id');
    var indice = id.replace('id_experiencia_empresa_', '');
    var empresa = $('#id_experiencia_empresa_' + indice).val();
    var ramo_atividade = $('#id_experiencia_ramo_atividade_' + indice).val();
    var funcao_ini = $('#id_experiencia_funcao_ini_' + indice).val();
    var funcao_fim = $('#id_experiencia_funcao_fim_' + indice).val();
    var dt_admissao = $('#id_experiencia_dt_admissao_' + indice).val();
    var dt_demissao = $('#id_experiencia_dt_demissao_' + indice).val();
    var ult_sal = $('#id_experiencia_ult_sal_' + indice).val();
    var mot_saida = $('#id_experiencia_mot_saida_' + indice).val();
    var realizacao = $('#id_experiencia_realizacao_' + indice).val();

    if ($("#" + id).val()) {
      experiencias.push(
        empresa + '|:|' + ramo_atividade + '|:|' + funcao_ini + '|:|' + funcao_fim
        + '|:|' + dt_admissao + '|:|' + dt_demissao
        + '|:|' + ult_sal + '|:|' + mot_saida + '|:|' + realizacao);
    }
  });
  $("#id_experiencias").val(experiencias.join("&&&"));

}
