
var abrir_nova_selecao = function() {
  //-- Abre a dialog de nova seleção
  jQuery('#id_dialog_nova_selecao').modal('show', {
    backdrop: 'fade'
  });
}


var realizar_salvamento = function(nova) {
  mostrarCarregando();
  if(nova){
    if (!$('#form_nova_selecao').parsley().validate()) {
        esconderCarregando();
        return false;
    }
  }

  // Capta os dados basicos
  var dados = {
    'ordenar': $("#id_ordenar").val(),
    'vaga':  $("#id_vaga").val(),
    'descricao_selecao':  $("#id_descricao_selecao").val(),
    'slug': SLUG_SELECAO,
    'palavra_chave':  $("#id_palavra_chave").val(),
    'codigo':  $("#id_codigo_nome").val(),
    // idiomas (Para fazer)
  };
  // Capta os dados dos filtros
  dados = $.extend( dados, captar_filtros('um') );
  dados = $.extend( dados, captar_filtros('dois') );
  dados = $.extend( dados, captar_filtros_especiais() );
  // Captar visibilidade
  visibilidade = [];
  $.each($("[name^='filtros_selecao_']:checked"), function(idx, value) {
    var campo = $(value).attr("id").replace("id_filtros_selecao_", "");
    visibilidade.push(campo);
  });
  dados['visibilidade'] = visibilidade;

  $.ajax({
    url: URL_SALVAR_SELECAO,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {
      // Acrescenta na paginação
      if (data['status']=='ok') {
          $.dialogs.success(data['msg'], function(){
    		     window.location.href = URL_SELECAO_SALVA + data['slug'];
          });
      } else {
        $.dialogs.error(data['msg']);
      }
    },
    complete: function(data) {
        esconderCarregando();
    }
  });

}


$(function(){

	$("#id_selecoes_salvas").val(SLUG_SELECAO)
	$("#id_selecoes_salvas").change(function(e){
		e.preventDefault();
		$.dialogs.confirm("", TXT_CONFIRM_TROCA_SELECAO, function(){
		  window.location.href = URL_SELECAO_SALVA + $("#id_selecoes_salvas").val();
		}, function(){
			$("#id_selecoes_salvas").val(SLUG_SELECAO);
		});
	});

});
