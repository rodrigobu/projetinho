function checarCpf(e) {
	if (!e)
		return;

	candidato = $('#id_codigo').val()
	$.ajax({
		url : URL_CAND_CHECAR_CPF,
		type : 'get',
		dataType : 'json',
		data : {
			candidato_id : candidato,
			cpf : e
		},
		success : function(dados) {
			if (dados["link"] != '') {
				$.dialogs.confirm(dados["title"], dados["msg"], function() {
					window.location = dados["link"]
				},function() {
					$("#id_cpf").val("");
				});
			}

		},

	});
};
