
$(function(){

	$("#id_base_de_dados").val(BASE_ATUAL)
	$("#id_base_de_dados").change(function(e){
		e.preventDefault();
		$.dialogs.confirm("", TXT_CONFIRM_TROCA_BASE, function(){
		  window.location.href = HASH_URL[$("#id_base_de_dados").val()];
		}, function(){
			$("#id_base_de_dados").val(BASE_ATUAL);
		});
	});

});
