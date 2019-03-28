function trocarDtnasc(e) {
	if (!e)
		return;
	mostrarCarregando("Calculando idade");
	$.ajax({
		async : false,
		url : URL_GERAR_IDADE,
		data : {
			dt_nasc : e
		},
		type : 'get',
		cache : false,
		success : function(retorno) {
			if (retorno["status"] == 'ok') {
				if ($('#id_idade').val() == retorno["idade"])
					return;
				$('#id_idade').val(retorno["idade"]);
			} else {
				/*jError(retorno["msg"], config_jnotify);*/
				$('#id_dt_nasc').val("");
			}
		},
		complete : esconderCarregando
	});
};

function trocarIdade(e) {
	if (!e)
		return;
	mostrarCarregando("Calculando Data de Nascimento");
	$.ajax({
		async : false,
		url : URL_GERAR_DTNASC,
		data : {
			idade : e
		},
		type : 'get',
		cache : false,
		success : function(retorno) {
			if (retorno["status"] == 'ok') {
				if ($('#id_dt_nasc').val() != '') {
					var ano = $("#id_dt_nasc").val().split("/")[2];
					if (ano == retorno["dt_nasc"].split("/")[2])
						return;
				}
				$('#id_dt_nasc').val(retorno["dt_nasc"]);
			} else {
				/*jError(retorno["msg"], config_jnotify);*/
				$('#id_idade').val("");
			}
		},
		complete : esconderCarregando
	});
};
