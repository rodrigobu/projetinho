var aplicar_filtros_sim = function(bloco) {
  //-- Aplica a visibilidade dos filtros e força a filtragem
   aplicar_filtros(bloco, 'true');
}

var aplicar_filtros = function(bloco, fazer_selecao) {
  //-- Aplica a visibilidade dos filtros
  $(".painel_block_" + bloco + " .filtro_selecao").addClass('hidden');
  $.each($("#gerenciar_filtros_" + bloco + "_modal_body [name^='filtros_selecao_']:checked"), function(idx, value) {
    var campo = $(value).attr("id").replace("id_filtros_selecao_", "");
    $("#block_" + campo).removeClass('hidden');
  });
  if(fazer_selecao=='true'){
     realizar_pesquisa('true');
  }
}

var iniciar_marcar_desmarcar = function(bloco){
  var total = $("#gerenciar_filtros_" + bloco + "_modal_body [name^='filtros_selecao_']").length
  var select = $("#gerenciar_filtros_" + bloco + "_modal_body [name^='filtros_selecao_']:checked").length
  $("#id_marcar_desmarcar_todos_" + bloco).prop(
      "checked", total==select
    )

}

var marcar_desmarcar_filtros = function(bloco, elm){
  $("#gerenciar_filtros_" + bloco + "_modal_body [name^='filtros_selecao_']").prop(
    "checked", $(elm).is(":checked")
  )
}

var gerenciar_filtros = function(bloco) {
  //-- Abre o gerenciamento dos filteos
  jQuery('#id_dialog_gerenciar_filtros_' + bloco).modal('show', {
    backdrop: 'fade'
  });
}

var captar_filtros = function(bloco) {
  // -- capta os filtros de um bloco
  var dados = {};
  $.each($("#gerenciar_filtros_" + bloco + "_modal_body [name^='filtros_selecao_']:checked"), function(idx, value) {
    var campo = $(value).attr("id").replace("id_filtros_selecao_", "");
    if(campo=='idiomas'){
      $.each($("[name^='idioma_']:visible"), function(sidx, svalue) {
        if($(svalue).val()){
          dados[$(svalue).attr("name")] = $(svalue).val() ? $(svalue).val() : "";
        }
      });
    } else {
        if($("#id_" + campo).val()){
          dados[campo] = $("#id_" + campo).val() ? $("#id_" + campo).val() : "";
        }
    }
  });
  return dados;
}

var captar_filtros_especiais = function(){
  var dados = {};
  // Capta os filtros especiais
  if( $("#block_idade").is(":visible") ){
      dados['idade_inicial'] = $("#id_idade_inicial").val();
      dados['idade_final'] = $("#id_idade_final").val();
  }
  if( $("#block_salario_desejado").is(":visible") ){
      dados['salario_desejado_inicial'] = $("#id_salario_desejado_inicial").val();
      dados['salario_desejado_final'] = $("#id_salario_desejado_final").val();
  }
  if( $("#block_tamanho_sapato").is(":visible") ){
      dados['tamanho_sapato_inicial'] = $("#id_tamanho_sapato_inicial").val();
      dados['tamanho_sapato_final'] = $("#id_tamanho_sapato_final").val();
  }
  if( $("#block_ultima_atualizacao").is(":visible") ){
      dados['ultima_atualizacao_inicial'] = $("#id_ultima_atualizacao_inicial").val();
      dados['ultima_atualizacao_final'] = $("#id_ultima_atualizacao_final").val();
  }
  return dados;
}

var realizar_pesquisa = function(force_pesquisa) {
  //-- Faz a captação dos filtros e seleciona os candidatos
  var page = $('#lazyload_candidatos').attr('page'); // pagina atual
  $('#lazyload_candidatos').hide();
  // se for resetar a pesquisa (mudança de filtros ou ordenação), reseta a página
  if(force_pesquisa=='true'){
    page = '1';
    $('#lazyload_candidatos').attr('page','1');
    $('#lazyLoadFim_div').hide();
    $('#lazyLoadFim_total').html("");
    $('#candidatos_selecionados').html('<div class="col-md-12 col-sm-6 col-xs-12 conteiner_candidato text-center"> <div class="panel panel-default">' + TXT_SELECIONANDO_CANDS + '</div> </div>');
  }
  // Capta os dados basicos
  var dados = {
    'page': page,
    'ordenar': $("#id_ordenar").val(),
    'force_pesquisa': force_pesquisa,
    'vaga':  $("#id_vaga").val(),
    'palavra_chave':  $("#id_palavra_chave").val(),
    'codigo':  $("#id_codigo_nome").val(),
    // idiomas (Para fazer)
  };
  // Capta os dados dos filtros
  dados = $.extend( dados, captar_filtros('um') );
  dados = $.extend( dados, captar_filtros('dois') );
  dados = $.extend( dados, captar_filtros_especiais() );

  $.ajax({
    url: URL_SEARCH_CANDS,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {
      // Acrescenta na paginação
      if (data.has_next) {
        $('#lazyload_candidatos').attr('page', parseInt(page) + 1);
        $('#lazyload_candidatos').show();
        $('#lazyload_candidatos_count').html('('+data['html_total']+')');
      } else {
        $('#lazyload_candidatos').hide();
        $('#lazyLoadFim_total').html(data['html_total']);
        $('#lazyLoadFim_div').show();
      }
      if(force_pesquisa=='true'){
        $('#candidatos_selecionados').html("");
      }
      $('#candidatos_selecionados').append(data.html);
      // Alerta senão tiver candidatos na pesquisa inicial
      /*if(force_pesquisa=='true' && data.html==''){
          $.dialogs.warning(TXT_SEM_COLABS)
      }*/

    }
  });

}

var refresh_filtros = function(){
    //-- Carrega os filtros com base no hash vindo da vaga/ seleção salva

    //-- Filtros base
    if(HASH_LISTS['ordenar']!=""){
        $("#id_ordenar").val(HASH_LISTS['ordenar']);
    }
    $("#id_codigo_nome").val(HASH_LISTS['codigo']);
    $("#id_palavra_chave").val(HASH_LISTS['palavra_chave']);

    //-- Primeiro Bloco
    $("#id_funcao").val(HASH_LISTS['funcao']).multiselect('refresh');
    $("#id_escolaridade").val(HASH_LISTS['escolaridade']).multiselect('refresh');
    $("#id_estudando").val(HASH_LISTS['estudando']);
    $("#id_pais").val(HASH_LISTS['pais']);
    $("#id_pais").change();

    $("#id_idade_inicial").val(HASH_LISTS['idade_inicial']);
    $("#id_idade_final").val(HASH_LISTS['idade_final']);
    $("#id_sexo").val(HASH_LISTS['sexo']);
    $("#id_salario_desejado_inicial").val(HASH_LISTS['salario_desejado_inicial']);
    $("#id_salario_desejado_final").val(HASH_LISTS['salario_desejado_final']);
    $("#id_nacionalidade").val(HASH_LISTS['nacionalidade']).multiselect('refresh');
    $("#id_tamanho_camisa").val(HASH_LISTS['tamanho_camisa']).multiselect('refresh');
    $("#id_tamanho_calsa").val(HASH_LISTS['tamanho_calsa']).multiselect('refresh');
    $("#id_tamanho_sapato_inicial").val(HASH_LISTS['tamanho_sapato_inicial']);
    $("#id_tamanho_sapato_final").val(HASH_LISTS['tamanho_sapato_final']);
    $("#id_deficiencias").val(HASH_LISTS['deficiencias']).multiselect('refresh');

    $.each( HASH_LISTS['idiomas'], function(idx, value){
        $("#id_idioma_"+idx).val(value)
    })

    // Fica no meio pra dar um tempo pro change de pais
    $("#id_estado").val(HASH_LISTS['estado']);
    $("#id_estado_txt").val(HASH_LISTS['estado']);
    $("#id_estado").change();

    //-- Segundo bloco
    $("#id_descendencia").val(HASH_LISTS['descendencia']).multiselect('refresh');
    $("#id_ramo_atividade").val(HASH_LISTS['ramo_atividade']).multiselect('refresh');
    $("#id_trabalhando").val(HASH_LISTS['trabalhando']);
    $("#id_sem_experiencia").val(HASH_LISTS['sem_experiencia']);
    $("#id_area_funcao").val(HASH_LISTS['area_funcao']).multiselect('refresh');
    $("#id_fotos_perfil").val(HASH_LISTS['fotos_perfil']);
    $("#id_fotos").val(HASH_LISTS['fotos']);
    $("#id_possui_carro").val(HASH_LISTS['possui_carro']);
    $("#id_possui_moto").val(HASH_LISTS['possui_moto']);
    $("#id_ultima_atualizacao_inicial").val(HASH_LISTS['ultima_atualizacao_inicial']);
    $("#id_ultima_atualizacao_final").val(HASH_LISTS['ultima_atualizacao_final']);
    $("#id_tipo_candidato").val(HASH_LISTS['tipo_candidato']).multiselect('refresh');
    $("#id_conceito_candidato").val(HASH_LISTS['conceito_candidato']).multiselect('refresh');
    $("#id_origem_candidato").val(HASH_LISTS['origem_candidato']).multiselect('refresh');
    $("#id_categoriacnh").val(HASH_LISTS['categoriacnh']).multiselect('refresh');

    // Deve estar por último par dar um "tempo" pro processo de carregar estados/cidade
    $("#id_cidade").val(HASH_LISTS['cidade']).multiselect('refresh');
    $("#id_cidade_txt").val(HASH_LISTS['cidade']);

    //-- Recarrega a pesquisa
    realizar_pesquisa('true');
}

var criar_eventos_change = function(){

    $.each($("[name^='filtros_selecao_']"), function(idx, value) {
      var campo = $(value).attr("id").replace("id_filtros_selecao_", "");
      if( $("#id_" + campo).attr('type') ){
        $("#id_" + campo).change(function() {
              realizar_pesquisa('true');
        });
      } else {
        $("#id_" + campo).change(function() {
              realizar_pesquisa('true');
        });
      }
    });
    $("#id_estado_txt, #id_cidade_txt").change(function() {
          realizar_pesquisa('true');
    });

}

$(function() {

  $("#id_palavra_chave_dicas").insertAfter($("[for='palavra_chave']"));
  $("#id_palavra_chave_dicas").click(function() {
    jQuery('#id_dialog_dicas_pal_chave').modal('show', {
      backdrop: 'fade'
    });
  });
  set_troca_pais_simples('pais', 'estado', 'cidade');
  set_cidades_do_estado('#id_estado', '#id_cidade');

  iniciar_marcar_desmarcar('um');
  aplicar_filtros('um', 'false');
  iniciar_marcar_desmarcar('dois');
  aplicar_filtros('dois', 'false');
  refresh_filtros();

  $("#id_filtrar").click(function() {
      realizar_pesquisa('true');
  });

  $("#id_ordenar").change(function() {
        realizar_pesquisa('true');
  });

  $('#lazyload_candidatos').click(function() {
    realizar_pesquisa('false');
  });



})
