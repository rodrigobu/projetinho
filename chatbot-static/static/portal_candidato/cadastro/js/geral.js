var change_estrangeiro = function() {
  if ($(this).is(':checked')) {
    $("#div_dados_estrangeiro").show();
    return_obrigatorio('rne');
    return_obrigatorio('dt_entrada_pais');
    return_obrigatorio('dt_naturalizacao');
  } else {
    $("#div_dados_estrangeiro").hide();
    hide_obrigatorio('rne');
    hide_obrigatorio('dt_entrada_pais');
    hide_obrigatorio('dt_naturalizacao');
  }
}

var change_estudando = function() {
  if ($(this).is(':checked')) {
    $("#div_instituto_ensino").show();
    $("#id_instituto_ensino").val();
  } else {
    $("#div_instituto_ensino").hide();
    if (!$("#id_instituto_ensino").val()) {
      $("#id_instituto_ensino").val($("#id_instituto_ensino option:first").val());
    }
  }
}

var change_com_deficiencia = function() {
  if ($(this).is(':checked')) {
    $("#div_info_deficiencia").show();
  } else {
    $("#div_info_deficiencia").hide();
  }
}

var change_carro = function() {
  if ($(this).is(':checked')) {
    $("#div_modelo_carro").show();
    return_obrigatorio('modelo_carro');
  } else {
    $("#div_modelo_carro").hide();
    hide_obrigatorio('modelo_carro');
  }
}

var upload_cv = function(){
  $("#id_cv").click();
}

var iniciar_dados = function() {
  limpar_fieldsets_vazios();

  $("#id_cpf").change(verificar_cpf);
  $('#id_com_deficiencia').change(change_com_deficiencia);
  $('#id_com_deficiencia').change();

  set_troca_pais_simples('pais', 'estado', 'cidade');
  set_pesquisa_endereco('#id_cep', '#id_endereco', '#id_bairro', '#id_cidade', '#id_estado');

  set_cidades_do_estado('#id_estado', '#id_cidade');
  $('#id_estado').change();
  $("#id_cidade").val(CIDADE);

  set_cidades_do_estado('#id_uf_nasc', '#id_cidade_nasc');
  $('#id_uf_nasc').change();
  $("#id_cidade_nasc").val(CIDADE_NASC);

  $('#id_carro').change(change_carro);
  $('#id_carro').change();

  $('#id_estudando').change(change_estudando);
  $('#id_estudando').change();

  $('#id_estrangeiro').change(change_estrangeiro);
  $('#id_estrangeiro').change();

  $('#id_sem_experiencia').click(change_sem_experiencia);
  if (!$('#id_sem_experiencia').is(':checked')) {
    $("#div_cad_experiencias").show();
  }

  $("#id_cv, [for='cv']").hide();
  iniciar_cv();
}
