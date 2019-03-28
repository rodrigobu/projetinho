
var set_cidades_do_estado = function(select_estado, select_cidades, sem_opt_blank) {
   $(select_estado).off('change');
   $(select_estado).on('change', function(){
       carrega_cidades_do_estado($(this).val(), select_cidades, sem_opt_blank)
   })
}

var carrega_cidades_do_estado = function(str_sigla_estado, select_cidades, sem_opt_blank) {
	$(select_cidades).attr("disabled", "disabled");
	$.ajax({
		type : "GET",
		url : HASH_CIDADE.URL_CARREGA_CID_EST,
		dataType : "json",
		data : {
			"sigla_uf" : str_sigla_estado,
			"sem_opt_blank" : sem_opt_blank ? 'true' : ''
		},
		async : false,
		success : function(retorno) {
			$(select_cidades).html(retorno.select);
		},
		complete : function() {
			$(select_cidades).removeAttr("disabled");
      if ( $(select_cidades).attr('multiple') == 'multiple' ) {
        $(select_cidades).load()
    	}
			esconderCarregando();
		}
	});
  $(select_cidades).bind('multiselectcheckall', function(event, ui) {
		$(this).multiselect('uncheckAll');
		$(this).multiselect('close');
		$.dialogs.warning('Para trabalhar com todas as cidades de um estado, basta selecionar o estado e não selecionar nenhuma cidade.');
	});
};

var habilita_campo_endereco = function(id_campo){
	$("#change_for_"+id_campo).find("select:first")
	                          .parent().parent().show();

	$("#change_for_"+id_campo).find("[type='text']:first")
	                          .parent().parent().hide();

  //$(".multiselect-container li, .multiselect-container li >a").show()
};

var desabilita_campo_endereco = function(id_campo, tamanho, classe){
	var valor = $("#id_"+id_campo).val();

	$("#change_for_"+id_campo).find("select:first").parent().parent().hide();

	$("#change_for_"+id_campo).find("[type='text']:first").val(valor)
	                          .parent().parent().show();

};

var set_troca_pais_simples = function(select_pais, select_estado, select_cidades) {

  // Determinando o valor do Brasil
  var BRASIL_VALUE = '';
  $.each($('#id_'+select_pais+' option'), function(idx, value){
     if( $(value).html() == 'Brasil'){
         BRASIL_VALUE = $(value).val()
     }
  });

	// Configuração dos endereços
  if(!$('#id_'+select_pais).val()){
    $('#'+select_pais).val(BRASIL_VALUE)
  }

	$('#id_'+select_pais).change(function() {
		var pais = $(this).val();
		if (pais == BRASIL_VALUE) {
		    habilita_campo_endereco(select_cidades);
		    habilita_campo_endereco(select_estado);
        set_cidades_do_estado('#id_'+select_estado, '#id_'+select_cidades);
        $('.url_pesquisa_cep').show();
		} else {
		    desabilita_campo_endereco(select_cidades,'60','selectmedf');
		    desabilita_campo_endereco(select_estado,'2','textppp clear');
		    $('.url_pesquisa_cep').hide();
		}
	});
	$('#id_'+select_pais).change();

};
