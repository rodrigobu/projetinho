
var deletar_banner = function(id_banner){

  $.dialogs.confirm(TXT_CONFIRMA, TXT_TITLE_EXCLUIR_BANNER,
    function() {
      $.ajax({
        url: URL_EXCLUIR_BANNER,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          banner: id_banner
        },
        success: function(retorno) {
          window.location.href = window.location.href;
          window.location.reload();
        }
      });
    }
  );

}

var check_field = function(c) {
	c_id = $(c).attr('id').replace('_disp','');
	if (!$(c).is(":checked")){
		$('#' + c_id + '_obr').prop('checked',false);
		$('#' + c_id + '_obr').prop('disabled',true);
	} else {
		$('#' + c_id + '_obr').prop('disabled',false);
	}
};

$(function() {

	$('.vMarcar').on("click", function() {
		$(this).parent().parent().parent().parent().find('input[type=checkbox]').each(function() {
			$(this).prop("checked", true);
		});
		$(this).parent().parent().parent().parent().find('.selector_obrigatorio').each(function() {
			$(this).prop('disabled', false);
		});
	});

	$('.vDesmarcar').on("click", function() {
		$(this).parent().parent().parent().parent().find('input[type=checkbox]').each(function() {
			$(this).prop("checked", false);
		});
		$(this).parent().parent().parent().parent().find('.selector_obrigatorio').each(function() {
			$(this).prop('disabled', 'disabled');
		});
	});

	var lista_checkboxes = ['deficiencia', 'oculos', 'fumante', 'casa_prop',
	'possui_moto', 'carro', 'estudando', 'idioma', 'nome_filho', 'trabalhando',
	'aceita_turno', 'disp_viagem', 'disp_extra', 'aceita_temp', 'casado_brasileiro',
	'filhos_com_brasileiro', 'estrangeiro'];
	$.each(lista_checkboxes, function(idx, value){
	    $("#id_cand_portal_"+value+"_obr").hide();
	    $("#id_cand_portal_edicao_"+value+"_obr").hide();
	});

});
