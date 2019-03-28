var toggle_deficiencia = function() {
    if ($("#id_com_deficiencia").is(":checked")) {
        $("#div_id_info_deficiencia, #div_id_deficiencia").parent('div').show();
        return_obrigatorio('deficiencia');
    } else {
        $("#div_id_info_deficiencia, #div_id_deficiencia").parent('div').hide();
        hide_obrigatorio('deficiencia');
    }
};

var toggle_carro = function() {
    if ($("#id_carro").is(":checked")) {
        $("#div_id_modelo_carro").show();
        return_obrigatorio('modelo_carro');
    } else {
        $("#div_id_modelo_carro").hide();
        hide_obrigatorio('modelo_carro');
    }
};

var toggle_estrangeiro = function() {
  if ($('#id_estrangeiro').is(':checked')) {
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

var toggle_estudando = function() {
  if ($('#id_estudando').is(':checked')) {
    $("#div_instituto_ensino").show();
    $("#id_instituto_ensino").val();
    return_obrigatorio('instituto_ensino');
  } else {
    $("#div_instituto_ensino").hide();
    if (!$("#id_instituto_ensino").val()) {
      $("#id_instituto_ensino").val($("#id_instituto_ensino option:first").val());
      hide_obrigatorio('instituto_ensino');
    }
  }
}

$(function(){
    if($("#id_uf_nasc").is(":visible")){ /*não executa quando nao esta na tela */
        set_cidades_do_estado('#id_uf_nasc', '#id_cidade_nasc');
        $('#id_uf_nasc').change();
        $("#id_cidade_nasc").val(CIDADENASC);
        if(READONLY=='True'){
          $("#id_cidade_nasc").attr('readonly', 'readonly');
        }
    }

    if($("#id_com_deficiencia").is(":visible")){ /*não executa quando nao esta na tela */
        toggle_deficiencia();
        $("#id_com_deficiencia").on("click", toggle_deficiencia);
    }

    if($("#id_carro").is(":visible")){ /*não executa quando nao esta na tela */
        toggle_carro();
        $("#id_carro").on("click", toggle_carro);
    }

    if($("#id_estudando").is(":visible")){ /*não executa quando nao esta na tela */
        toggle_estudando();
        $("#id_estudando").on("click", toggle_estudando);
    }

    if($("#id_estrangeiro").is(":visible")){ /*não executa quando nao esta na tela */
        toggle_estrangeiro();
        $("#id_estrangeiro").on("click", toggle_estrangeiro);
    }

    $("#id_deficiencia").val(DEFICIENCIAS_CAND).multiselect('refresh');

});
