var realizar_pesquisa = function(force_pesquisa) {
  //-- Faz a captação dos filtros e seleciona os vagas
  var page = $('#lazyload_vagas').attr('page'); // pagina atual
  $('#lazyload_vagas').hide();
  // se for resetar a pesquisa (mudança de filtros ou ordenação), reseta a página
  if (force_pesquisa == 'true') {
    page = '1';
    $('#lazyload_vagas').attr('page', '1');
    $('#lazyLoadFim_div').hide();
    $('#lazyLoadFim_total').html("");
    $('#vagas_selecionadas').html('<div class="col-md-12 col-sm-6 col-xs-12 conteiner_vaga text-center"> <div class="panel panel-default">' + TXT_SELECIONANDO_VAGAS + '</div> </div>');
  }
  // Capta os dados basicos
  var dados = {
    'page': page,
    'force_pesquisa': force_pesquisa,
    'empresa': $('#id_empresa').val(),
    'tipo': $('#id_tipo').val(),
    'portal': $('#id_portal').val(),
    'funcao': $('#id_funcao').val(),
    'escolaridade': $('#id_escolaridade').val(),
    'estado': $('#id_estado').val(),
    'cidade': $('#id_cidade').val(),
    'deficiencia': $('#id_deficiencia').val(),
  };
  // Capta os dados dos filtros

  $.ajax({
    url: URL_SEARCH_VAGAS,
    type: 'get',
    dataType: 'json',
    data: dados,
    success: function(data) {
      // Acrescenta na paginação
      if (data.has_next) {
        $('#lazyload_vagas').attr('page', parseInt(page) + 1);
        $('#lazyload_vagas').show();
        $('#lazyload_vagas_count').html('(' + data['html_total'] + ')');
      } else {
        $('#lazyload_vagas').hide();
        $('#lazyLoadFim_total').html(data['html_total']);
        $('#lazyLoadFim_div').show();
      }
      if (force_pesquisa == 'true') {
        $('#vagas_selecionadas').html("");
      }
      $('#vagas_selecionadas').append(data.html);

    }
  });

}

var ver_vaga = function(slug, portal){
  window.open(URL_VER_VAGA + slug);
}

var remover_filtro = function(id_field){
  $('#'+id_field).val("");
  $('#div_'+id_field).hide();
  $("#id_filtrar").click();
}

$(function() {
  $(".nav_busca_vaga").hide();
  set_cidades_do_estado('#id_estado', '#id_cidade');
  $('#id_estado').change();

  $("#id_filtrar").click(function() {
    realizar_pesquisa('true');
  });

  $('#lazyload_vagas').click(function() {
    realizar_pesquisa('false');
  });

  $('#id_cidade').val([AUTO_CIDADE]).multiselect('refresh')

  realizar_pesquisa('true');

})
