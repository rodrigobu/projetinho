var remover_funcao = function(cand_funcao_id) {
  $.dialogs.confirm(TXT_CONFIRMAR, TXT_CONFIRMAR_EXCLUIR_FUNCAO,
    function() {
      $.ajax({
        url: URL_DELETAR_FUNCAO,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: cand_funcao_id
        },
        success: function(retorno) {
          $.dialogs.success(TXT_SUCESSO_EXCLUIR_FUNCAO);
          recarregar_funcoes();
        }
      });
    }
  );
}

var abrir_form_nova_funcao = function(id_funcao) {
  $.ajax({
    url: URL_FORM_FUNCAO,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      funcao: id_funcao
    },
    success: function(retorno) {
      $("#id_cancelar_funcao").show();
      $("#id_nova_funcao").hide();
      //$("#datatable_funcao").hide();
      $("#form_funcao").html(retorno['html']);
    }
  });
}

var cancelar_funcao = function() {
  $('#form_funcao').html("");
  //$("#datatable_funcao").show();
  $("#id_nova_funcao").show();
  $("#id_cancelar_funcao").hide();
}

var salvar_funcoes = function() {

  $.ajax({
    url: URL_SALVAR_FUNCAO,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      id_edicao: $("#id_id_candfuncao").val(),
      funcao: $("#id_funcao_funcao_").val(),
      nivel: $("#id_funcao_nivel_").val(),
    },
    success: function(retorno) {
      if(retorno['status']=='ok'){
        $.dialogs.success(retorno['msg']);
        cancelar_funcao();
        recarregar_funcoes();
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

var listar_funcoes = function() {
  TABELA_FUNCOES = $.DataTableXenon({
    json: URL_LISTAGEM_FUNCAO,
    container: "datatable_funcao",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_FUNCAO,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-6 col-xs-11',
        "mRender": function(data, type, full) {
          var HTML = full["funcao_desc"];
          HTML += "<span class='hidden-md-up'><br/><b>" + TXT_COL_NIVEL + ":</b>&nbsp;" + full["nivel_desc"] + "</span>";
          return HTML;
        }
      },
      {
        "mData": TXT_COL_NIVEL,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-5 hidden-xs',
        "mRender": function(data, type, full) {
          return full["nivel_desc"];
        }
      },
      {
        "mData": TXT_COL_ACOES,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-1 text-center',
        "mRender": function(data, type, full) {
          return "<a onclick='remover_funcao(" + full["cand_funcao_id"] + ")' title='" + TITLE_DELETE + "'><i class='" + ICONE_DELETE + "'></i></a>";
        }
      },
    ]
  });
}

var recarregar_funcoes = function() {
  TABELA_FUNCOES.reload();
}

$(function() {
  listar_funcoes();
});
