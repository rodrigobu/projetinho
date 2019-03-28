var gerar_link_edicao_cliente = function(full) {
  /* Gera o link padrão de acesso ao cadastro do vaga */
  return '<a title="'+ TXT_ACESSA_CLIENTE +'" href="'+ URL_EDIT_CLIENTE + full["cliente_slug"] + '" target="_blank" class="text-gray"><i class="'+ ICONE_CLIENTE +'"></i></a> ';
}


var render_cliente_coluna_padrao = function(data, type, full, html_extra) {
  /* Gera o html padrão das vagas para a coluna, pode receber customização no html_extra */
  var HTML = "<span>" + full["nome_fantasia"] + " (" + TXT_COL_COD + "&nbsp;" + full["cliente_id"] + ")<br/></span>";
  HTML += "<span><b>" + TXT_COL_RAZAO_SOCIAL + ":</b>&nbsp;" + full["razao_social"] + "<br/></span>";
  HTML += "<span><b>" + TXT_COL_CNPJ + ":</b>&nbsp;" + ( full["cnpj"] ? full["cnpj"] : '' ) + "<br/></span>";

  try{
      HTML += html_extra(data, type, full);
  } catch(e){}

  return HTML;
}
