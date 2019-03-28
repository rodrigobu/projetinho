$(function(){

   $("#id_vaga").change(function(){
     mostrarCarregando();
		 $.ajax({
			 url: URL_DETALHES_VAGA,
			 type: 'get',
			 dataType: 'json',
			 data: {
				 codigo: $("#id_vaga").val()
			 },
			 success: function(dados) {
				 $("#span_vaga_cliente").html(dados["cliente"]);
				 $("#span_vaga_responsavel_selecao").html(dados["responsavel_selecao"]);
         $("#span_vaga_vaga_funcao").html(dados["vaga_funcao"]);

         HASH_LISTS = dados["filtros_vaga"]
         refresh_filtros();

         /*if($("#id_vaga").val()){
           $("#id_funcao").parent().parent().hide();
         } else {
           $("#id_funcao").parent().parent().show();
         }*/
			 },
       complete: function(dados){
           esconderCarregando();
       }
		 });

	 });

});
