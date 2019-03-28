var gerar_link_edicao_vaga = function(full) {
  /* Gera o link padrão de acesso ao cadastro do vaga */
  return '<a title="'+ TXT_ACESSA_VAGA +'" href="'+ URL_EDIT_VAGA + full["vaga_slug"] + '" target="_blank" class="text-gray"><i class="'+ ICONE_VAGA +'"></i></a> ';
}


var render_vaga_coluna_padrao = function(data, type, full, html_extra) {
  /* Gera o html padrão das vagas para a coluna, pode receber customização no html_extra */
  var HTML =
  '<span>' + full["vaga_desc"] + ' (' + TXT_COL_COD + "&nbsp;" + full["vaga_id"] + ') <br/></span>'+
  "<span><b>" + TXT_COL_FUNCAO + ":</b>&nbsp;" + full["vaga_funcao"] + "</span>";

  try{
      HTML += html_extra(data, type, full);
  } catch(e){}

  return HTML;
}
