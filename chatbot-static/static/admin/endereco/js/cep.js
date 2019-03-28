var REGEX_CEP = /^(\d{8,9})$/;
var REGEX_ESPACOS = /^(\s*)$/;
var HTML_PESQ_CEP = "<a target='_blank' class='pesq_cep botao' href='http://www.buscacep.correios.com.br/sistemas/buscacep/buscaCep.cfm' >Não sei meu CEP</a>";

var set_pesquisa_endereco = function(input_cep, input_logradouro, input_bairro, input_localidade, input_uf) {
	$(input_logradouro).add(input_bairro).add(input_localidade).add(input_uf);
	$(input_cep).after(HASH_CEP.URL_PESQ_CEP);
	$(input_cep).next('a.pesq_cep').addClass('link');
	$(input_cep).next('a.pesq_cep').css("margin-left", "5px");

	$(input_cep).change(function() {
		var cep = $(this).val();
		if (REGEX_ESPACOS.test(cep))
			return;

		cep = cep.replace("-","");
		$(input_cep).val(cep);
		if (REGEX_CEP.test(cep)){
				$.ajax({
					url : HASH_CEP.URL_PESQUISA_CEP + "?cep=" + cep,
					type : 'get',
					dataType : 'json',
					async : false,
					success : function(dados) {
						if (dados["nf"] == '1') {
							$.dialogs.error(HASH_CEP.MSG_CEP_NAO_ENCONTRADO);
							return;
						};
						$(input_uf).val(dados["uf"]);
						$(input_logradouro).val(dados["rua"]);
						$(input_bairro).val(dados["bairro"]);
						carrega_cidades_do_estado(dados["uf"], input_localidade);
						$(input_localidade).val(dados["cidade"]);
					},
				});
			//esconderCarregando();
		} else {
	     $.dialogs.error(HASH_CEP.MSG_CEP_INVALIDO);
	     $(input_cep).val("");
		}
	});
};
