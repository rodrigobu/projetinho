
var realizar_pesquisa = function(force_pesquisa) {
  //-- Faz a captação dos filtros e seleciona os candidatos
  var page = $('#lazyload_candidatos').attr('page'); // pagina atual
  $('#lazyload_candidatos').hide();
  // se for resetar a pesquisa (mudança de filtros ou ordenação), reseta a página
  if(force_pesquisa=='true'){
    page = '1';
    $('#lazyload_candidatos').attr('page','1');
    $('#lazyLoadFim_div').hide();
    $('#lazyLoadFim_total').html("");
    $('#candidatos_selecionados').html('<div class="col-md-12 col-sm-6 col-xs-12 conteiner_candidato text-center"> <div class="panel panel-default">' + TXT_SELECIONANDO_CANDS + '</div> </div>');
  }

  $.ajax({
    url: URL_SEARCH_CANDS,
    type: 'post',
    dataType: 'json',
    data: {
      'page': page,
      'estado': $("#id_estado").val(),
      'cidades': $("#id_cidade").val(),
      'escolaridades': $("#id_escolaridade").val(),
      'pessoas_com_deficiencia': $("#id_pessoas_com_deficiencia").is(":checked"),
      'palavra_chave': $("#id_palavra_chave").val(),
      'codigo': $("#id_codigo_nome").val(),
    },
    success: function(data) {
      if (data.has_next) {
          $('#lazyload_candidatos').attr('page', parseInt(page)+1);
          $('#lazyload_candidatos').show();
          $('#lazyload_candidatos_count').html('('+data['html_total']+')');
      } else {
        $('#lazyload_candidatos').hide();
        $('#lazyLoadFim_total').html(data['html_total']);
        $('#lazyLoadFim_div').show();
      }
      if(force_pesquisa=='true'){
        $('#candidatos_selecionados').html("");
      }
      $('#candidatos_selecionados').append(data.html);
      // Alerta senão tiver candidatos na pesquisa inicial
      if(force_pesquisa=='true' && data.html==''){
          $.dialogs.warning(TXT_SEM_COLABS)
      }
    }
  });

};

$(function(){
  $("#id_palavra_chave_dicas").insertAfter($("[for='palavra_chave']"));
  $("#id_palavra_chave_dicas").click(function() {
    jQuery('#id_dialog_dicas_pal_chave').modal('show', {
      backdrop: 'fade'
    });
  });
  set_cidades_do_estado('#id_estado', '#id_cidade');

  // Ajuste para que a seeção da base apareça no titulo da pagina
  $(".title-env").addClass("col-md-10");
  $("[for='base_de_dados']").parent().insertAfter($(".title-env") );
  $("[for='base_de_dados']").parent().removeClass("margin-bottom-10");
  $("#panel_vagas").hide();

  $("#id_filtrar").click(function() {
      realizar_pesquisa('true');
  });

  $('#lazyload_candidatos').click(function() {
    realizar_pesquisa('false');
  });

  $("#id_filtrar").click();

})
