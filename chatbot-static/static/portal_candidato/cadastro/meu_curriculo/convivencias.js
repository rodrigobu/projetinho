
var remover_convivencia = function(cand_convivencia_id) {
  $.dialogs.confirm(TXT_CONFIRMAR, TXT_CONFIRMAR_EXCLUIR_CONVIVENCIA,
    function() {
      $.ajax({
        url: URL_DELETAR_CONVIVENCIA,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: cand_convivencia_id
        },
        success: function(retorno) {
           $.dialogs.success(TXT_SUCESSO_EXCLUIR_CONVIVENCIA);
           recarregar_convivencias()
        }
      });
    }
  );
}

var abrir_form_nova_convivencia = function(id_convivencia){
  $.ajax({
    url: URL_FORM_CONVIVENCIA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      convivencia: id_convivencia
    },
    success: function(retorno) {
      $("#id_cancelar_convivencia").show();
      $("#id_nova_convivencia").hide();
      //$("#datatable_convivencias").hide();
      $("#div_form_convivencia").html(retorno['html']);
      make_datepicker("#id_" + retorno['name_dt_nasc']);
    }
  });
}

var cancelar_convivencia = function() {
  $('#div_form_convivencia').html("");
  //$("#datatable_convivencias").show();
  $("#id_nova_convivencia").show();
  $("#id_cancelar_convivencia").hide();
}

var salvar_convivencias = function(){

    $.ajax({
      url: URL_SALVAR_CONVIVENCIA,
      type: 'post',
      cache: false,
      dataType: 'json',
      data: {
        id_edicao: $("#id_id_candconvivencia").val(),
        nome: $("#id_convivencia_nome_").val(),
        dt_nasc: $("#id_convivencia_dt_nasc_").val(),
        cpf: $("#id_convivencia_cpf_").val(),
        n_sus: $("#id_convivencia_n_sus_").val(),
        relacao: $("#id_convivencia_relacao_").val(),
        dependente: $("#id_convivencia_dependente_").is(':checked'),
      },
      success: function(retorno) {
        if(retorno['status']=='ok'){
          $.dialogs.success(retorno['msg']);
          cancelar_convivencia();
          recarregar_convivencias();
        } else {
          $.dialogs.error(retorno['msg']);
        }
      }
    });
}

var listar_convivencias = function(){
    TABELA_CONVIVENCIAS = $.DataTableXenon({
      json: URL_LISTAGEM_CONVIVENCIA,
      container: "datatable_convivencias",
      filterForm: '#filtro_consulta',
      aoColumns: [{
          "mData": TXT_COL_NOME,
          'orderable': true,
          'searchable': true,
          'class': 'col-sm-11 col-xs-11',
          "mRender": function(data, type, full) {
            var HTML = full["nome"];
            HTML += "<span><br/><b>" + TXT_COL_DATA_NASC + ":</b>&nbsp;" + full["dt_nasc"] + "</span>";
            HTML += "<span><br/><b>" + TXT_COL_RELACAO + ":</b>&nbsp;" + full["relacao_desc"] + "</span>";
            return HTML;
          }
        },
        {
          "mData": TXT_COL_ACOES,
          'orderable': true,
          'searchable': true,
          'class': 'col-sm-1 text-center',
          "mRender": function(data, type, full) {
            return "<a onclick='abrir_form_nova_convivencia("+full["cand_convivencia_id"]+")' title='"+TITLE_EDIT+"'><i class='"+ICONE_EDIT+"'></i> </a> "+
            "<a onclick='remover_convivencia("+full["cand_convivencia_id"]+")' title='"+TITLE_DELETE+"'><i class='"+ICONE_DELETE+"'></i></a>";
          }
        },
      ]
    });

}

var recarregar_convivencias = function(){
   TABELA_CONVIVENCIAS.reload();
}


$(function() {
  listar_convivencias();
});
