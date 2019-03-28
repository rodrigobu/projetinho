$(function() {
    set_pesquisa_endereco('#id_cep', '#id_endereco', '#id_bairro', '#id_cidade', '#id_estado');
    set_cidades_do_estado('#id_estado', '#id_cidade');
    $('#id_estado').change();
    $("#id_cidade").val(CIDADE);
    if(READONLY){
      $("#id_cidade").attr('readonly', 'readonly');
    }

    //Processo de Disponivel e confidencial
	$("#id_confidencial").on("click", function() {
		if ($(this).is(':checked')) {
			$('#id_disp_internet').removeAttr("checked");
			$('#id_vaga_premium').removeAttr("checked");
		}
	});

	$("#id_disp_internet").on("click", function() {
		if ($("#id_confidencial").is(':checked')) {
			$('#id_disp_internet').removeAttr("checked");
		}
	});
	$("#id_vaga_premium").on("click", function() {
		if ($("#id_confidencial").is(':checked')) {
			$('#id_vaga_premium').removeAttr("checked");
		}
	});

	$("#id_recusa_candidatura").on("click", function() {
		if ($(this).is(':checked')) {
			$('#id_vaga_premium').removeAttr("checked");
		}
	});

	$("#id_vaga_premium").on("click", function() {
		if ($("#id_recusa_candidatura").is(':checked')) {
			$('#id_vaga_premium').removeAttr("checked");
		}
	});

    // Descriçao de contrato automática
    $("#id_funcao").on("change", function() {
         var optionSelected = $(this).find("option:selected");
         $('#id_descricao_contrato').val( optionSelected.text() );
    });
});
