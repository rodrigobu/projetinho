var gerar_link_edicao_candidato = function(full) {
  /* Gera o link padrão de acesso ao cadastro do candidato */
  return '<a title="'+ TXT_ACESSA_CANDIDATO +'" href="'+ URL_EDIT_CAND + full["cand_slug"] + '" target="_blank" class="text-gray"><i class="'+ ICONE_CAND +'"></i></a> ';
}

var gerar_cv_link = function(full){
  /* Gera o link padrão de acesso para a geração do cv padrao do candidato */
  return !full['tem_cv'] ? '' : '<a class="baixar_cv_cand" title="' +
    TXT_BTN_CV + '" href="' +
    URL_CAND_CV + full['cand_slug'] + '"><i class="' +
    ICONE_BTN_CV + '"></i></a> ';
}

var injeta_src_candidato = function(){
  /* Injeta a quary viva para ativar render de imagem para listagens */
   $('.img_cand:visible').livequery(function() {
      if(!$(this).attr("src")){
        $(this).attr("src", URL_VER_FOTO + $(this).attr('cand_slug') )
      }
   });
}

var render_candidato_coluna_padrao = function(data, type, full, html_extra) {
  /* Gera o html padrão dos candidatos para a coluna, pode receber customização no html_extra */
  var IMG = '';
  if(full['tem_foto']){
    IMG =  '<span class="profile-picture center"> <img cand_slug="' + full["cand_slug"] + '" class="img-circle img-inline userpic-52 img_cand" width="52" height="72"> </span>';
  } else {
    //IMG = '<span class="foto_cand_nome_container profile-picture center"> <span class="foto_cand_nome">' + full["cand_iniciais"] + '</span>  </span>';
    IMG = '  <div class="foto_cand_nome_circle_little" > '+
      '  <div class="foto_cand_nome_circle_little__inner">'+
      '    <div class="foto_cand_nome_circle_little__wrapper">'+
      '      <div class="foto_cand_nome_circle_little__content">' + full["cand_iniciais"] + '</div>'+
      '    </div>'+
      '    </div>'+
      '  </div>';
  }
  var HTML =
    '<div class="row" data="' + full["cand_nome"] + '">' +
    '   <div class="col-xs-12 col-md-2 text-center" ' + ( !full['tem_foto'] ? 'style="min-width: 50px;"' : '' ) + '>' +
    '      <div class="center"> ' + IMG +' </div> '+
    '   </div>'+
    '   <div class="col-xs-12 col-md-10 user-name">' +
    ' 	    <span class="text-primary">' + full["cand_nome"] + " (" + TXT_COL_COD + "&nbsp;" + full["cand_id"] + ')</span> ' +
    " 	    <span><br/><b>" + TXT_COL_CAND_DTNASC + ":</b>&nbsp;" + ( full["dt_nasc"] ? full["dt_nasc"] : '' ) + "</span>" +
    " 	    <span><br/><b>" + TXT_COL_CAND_CPF + ":</b>&nbsp;" + ( full["cpf"] ? full["cpf"] : '' ) + "</span>";

  try{
      HTML += html_extra(data, type, full);
  } catch(e){}

  HTML +=
    '   </div>'+
    '</div>';
  return HTML;
}

$(function() {
  injeta_src_candidato();
});
