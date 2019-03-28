var remover_idioma = function(cand_idioma_id) {
  $.dialogs.confirm(TXT_CONFIRMAR, TXT_CONFIRMAR_EXCLUIR_IDIOMA,
    function() {
      $.ajax({
        url: URL_DELETAR_IDIOMA,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: cand_idioma_id
        },
        success: function(retorno) {
          $.dialogs.success(TXT_SUCESSO_EXCLUIR_IDIOMA);
          recarregar_idiomas();
        }
      });
    }
  );
}

var abrir_form_novo_idioma = function(id_idioma) {
  $.ajax({
    url: URL_FORM_IDIOMA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      idioma: id_idioma
    },
    success: function(retorno) {
      $("#id_cancelar_idioma").show();
      $("#id_novo_idioma").hide();
      //$("#datatable_idiomas").hide();
      $("#form_idioma").html(retorno['html']);
    }
  });
}

var cancelar_idioma = function() {
  $('#form_idioma').html("");
  //$("#datatable_idiomas").show();
  $("#id_novo_idioma").show();
  $("#id_cancelar_idioma").hide();
}

var salvar_idioma = function() {
  $.ajax({
    url: URL_SALVAR_IDIOMA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      id_edicao: $("#id_id_candfuncao").val(),
      idioma: $("#id_idioma_idioma_").val(),
      nivel: $("#id_idioma_nivel_").val(),
    },
    success: function(retorno) {
      if(retorno['status']=='ok'){
        $.dialogs.success(retorno['msg']);
        cancelar_idioma();
        listar_idiomas();
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

var listar_idiomas = function() {
  TABELA_IDIOMAS = $.DataTableXenon({
    json: URL_LISTAGEM_IDIOMA,
    container: "datatable_idiomas",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_IDIOMA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-6 col-xs-11',
        "mRender": function(data, type, full) {
          var HTML = full["idioma_desc"];
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
          return "<a onclick='remover_idioma(" + full["cand_idioma_id"] + ")' title='" + TITLE_DELETE + "'><i class='" + ICONE_DELETE + "'></i></a>";
        }
      },
    ]
  });
}

var recarregar_idiomas = function() {
  TABELA_IDIOMAS.reload();
}


$(function() {
  listar_idiomas();
});
