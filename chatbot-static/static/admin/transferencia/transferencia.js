
$(function() {

	$("#id_tipo").change(function(){
		$.ajax({
			url: URL_FORMULARIO,
			type: 'get',
			dataType: 'json',
			async: false,
			data: {
				tipo: $("#id_tipo").val()
			},
			success: function(dados) {
				$("#div_formulario").html(dados['html']);
				$("#id_btn_transferir").click(function(){
					tipo = $("#id_tipo").val();
					de = $("#id_de").val();
					para = $("#id_para").val();
					if(!tipo){
						$.dialogs.error(TXT_TIPO_INVAL);
					}
					else if(!de){
						$.dialogs.error(TXT_DE_INVAL);
					}
					else if(!para){
						$.dialogs.error(TXT_PARA_INVAL);
					}
					else{
						$.dialogs.confirm(TXT_CONFIRMAR, TXT_CONFIRMAR_MSG, function(){
							$("#form_transferencia").submit();
						});
					};
				});

			}
		});
	});
	$("#id_tipo").change();
});
