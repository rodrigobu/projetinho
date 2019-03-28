
var validar_cores = function() {
	// VERIFICAR SE TEM CORES REPETIDAS
	var cores = $('.color_picker').map(function(i, elem) {
		return $(elem).val();
	}).toArray();
	var qtd_cores = cores.length;
	if ($.unique(cores).length != qtd_cores) {
		$.dialogs.error(TXT_VAL_CORES);
		return false;
	}
	return true;
};

var validar_intervalo = function() {
	var linhas = $('#tbl_intervalo_cores tr');
  var to_return = true;
	$.each(linhas, function(idx, linha) {
		// VERIFICAR SE TEM ALGUM INTERVALO COM DIA INICIAL MAIOR QUE O DIA FINAL
		var ini = $(linha).find('input.fila_dia_ini').val();
		var fim = $(linha).find('input.fila_dia_fim').val();
		if (parseInt(ini) > parseInt(fim)) {
			$.dialogs.error(TXT_VAL_DIA_INI);
      to_return = false;
			return false;
		} else {
			// VERIFICAR SE TEM INTERVALOS QUE SE INTERSECTAM (ver se o início de um intervalo vem antes do final do intervalo anterior)
			if (idx == 0)
				return true;
			var ini_atual = parseInt($(linha).find('input.fila_dia_ini').val());
			var fim_anterior = parseInt($(linhas[idx - 1]).find('input.fila_dia_fim').val());
			if (fim_anterior >= ini_atual) {
				$.dialogs.error(TXT_VAL_INTERVALOS);
        to_return = false;
				return false;
			}
		}
	});
  if (to_return){
	    return validar_cores();
  } else {
     return to_return;
  }
};

var enviar_email_teste = function() {
    mostrarCarregando('Enviando e-mail de teste...');
    $.ajax({
        url: URL_ENVIAR_EMAIL_TESTE,
        type: 'GET',
        dataType: 'json',
        cache: false,
        async: false,
        data: {
            'email_teste': $("#id_email_teste").val(),
            'email_origem': $("#id_email").val(),
            'email_host': $("#id_email_host").val(),
            'email_host_user': $("#id_email_host_user").val(),
            'email_host_password': $("#id_email_host_password").val(),
            'email_port': $("#id_email_port").val()
        },
        success: function(retorno) {
					if (retorno["status"] == 'ok') {
						$.dialogs.success(TXT_VAL_EMAIL_TESTE_SUCCESS);
            $("#id_btn_teste_email_cancel").click();
					} else {
						$.dialogs.error(retorno["msg"]);
					}
        }
    });
};

var validar_email_conf = function() {
	if(!$("#id_email_envio_habilitado").is(":checked")){
	   return true;
  } else {
  	var to_return = true;
  	$.ajax({
  	    url: URL_VALIDAR_EMAIL,
  			type: 'GET',
        dataType: 'json',
  			cache: false,
  			async: false,
  			data: {
          'email_origem': $("#id_email").val(),
          'email_host': $("#id_email_host").val(),
          'email_host_user': $("#id_email_host_user").val(),
          'email_host_password': $("#id_email_host_password").val(),
          'email_port': $("#id_email_port").val()
  			},
  			success: function(retorno) {
  				if (retorno["status"] == 'ok') {
  					to_return = true;
  				} else {
  					to_return = false;
  					$.dialogs.error(retorno["msg"]);
  				}
  			}
  	});
  	return to_return;
  }
};

var validacaoFormConfiguracao = function(){
	
	if($("#id_hora_inicial_util").length!=0){
		if(!compararHora(
			$("#id_hora_inicial_util").val(),
			$("#id_hora_final_util").val()
		)){
			 $.dialogs.error("O campo Horário Comercial Inicial deve ser menor que o campo Horário Comercial Final.");
			 return false;
		}
	}

  if(!validar_intervalo()){
     return false;
  }

  if(!validar_email_conf()){
     return false;
  }
	return true;

}

$(function(){

    $('#tbl_intervalo_cores').find('input[type=text]').on('change', function(){
       if(!validar_intervalo()){
          $(this).val("");
       }
    });

    $("#id_email_envio_habilitado").on('change', function() {
      if($(this).is(":checked")){
       $("#div_config_email").show()
      } else {
       $("#div_config_email").hide()
      }
    });
    $("#id_email_envio_habilitado").change();

    $("#id_email_limite_hora").on("change", function() {
        if ($(this).val() != '') {
          if( parseInt($("#id_email_limite_hora").val()) == 0){
            $.dialogs.error(TXT_VAL_LIMTE_EMAIL);
            $(this).val('');
          }
        }
    });

    $("#id_btn_teste_email").on("click", function() {
        $("#div_teste_email").show();
        $("#div_btn_teste_email").hide();
    });

    $("#id_btn_teste_email_cancel").on("click", function() {
        $("#div_teste_email").hide();
        $("#div_btn_teste_email").show();
    });

    $("#id_btn_teste_email_teste").on("click", function() {
        enviar_email_teste();
    });

    $("#id_email_host").on("change", function(){
        if ($(this).val() == 'smtp1.minas.com.br'){
    	      $("#id_email_limite_hora").val("50");
    	      $("#id_email_limite_hora").attr("readonly","readonly");
        }else{
    	      $("#id_email_limite_hora").removeAttr("readonly");
        }
    });
    $("#id_email_host").change();


	  $("#button-id-bt_salvar_configuracoes").click(function(e){
		  	if(validacaoFormConfiguracao()){
	          $("#form_configuracoes").submit();
				}
	  })
});
