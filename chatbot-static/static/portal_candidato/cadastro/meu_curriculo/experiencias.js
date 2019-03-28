var remover_experiencia = function(cand_experiencia_id) {
  $.dialogs.confirm(TXT_CONFIRMAR, TXT_CONFIRMAR_EXCLUIR_EXPERIENCIA,
    function() {
      $.ajax({
        url: URL_DELETAR_EXPERIENCIA,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: cand_experiencia_id
        },
        success: function(retorno) {
          $.dialogs.success(TXT_SUCESSO_EXCLUIR_EXPERIENCIA);
          recarregar_experiencias()
        }
      });
    }
  );
}

var abrir_form_nova_experiencia = function(id_experiencia) {
  $.ajax({
    url: URL_FORM_EXPERIENCIA,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      experiencia: id_experiencia
    },
    success: function(retorno) {
      $("#id_cancelar_experiencia").show();
      $("#id_nova_experiencia").hide();
      //$("#datatable_experiencias").hide();
      $("#div_form_experiencia").html(retorno['html']);
      make_datepicker("#id_" + retorno['name_dt_admissao']);
      make_datepicker("#id_" + retorno['name_dt_demissao']);
    }
  });
}

var cancelar_experiencia = function() {
  $('#div_form_experiencia').html("");
  //$("#datatable_experiencias").show();
  $("#id_nova_experiencia").show();
  $("#id_cancelar_experiencia").hide();
}

var salvar_experiencia = function() {
  $.ajax({
    url: URL_SALVAR_EXPERIENCIA,
    type: 'post',
    cache: false,
    dataType: 'json',
    data: {
      id_edicao: $("#id_id_candexperiencia").val(),
      empresa: $("#id_experiencia_empresa_").val(),
      ramo_atividade: $("#id_experiencia_ramo_atividade_").val(),
      funcao_ini: $("#id_experiencia_funcao_ini_").val(),
      funcao_fim: $("#id_experiencia_funcao_fim_").val(),
      dt_admissao: $("#id_experiencia_dt_admissao_").val(),
      dt_demissao: $("#id_experiencia_dt_demissao_").val(),
      ult_sal: $("#id_experiencia_ult_sal_").val(),
      mot_saida: $("#id_experiencia_mot_saida_").val(),
      realizacao: $("#id_experiencia_realizacao_").val(),
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno['msg']);
        cancelar_experiencia();
        recarregar_experiencias();
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

var listar_experiencias = function() {
  TABELA_EXPERIENCIAS = $.DataTableXenon({
    json: URL_LISTAGEM_EXPERIENCIA,
    container: "datatable_experiencias",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_EMPRESA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-11 col-xs-11',
        "mRender": function(data, type, full) {
          var HTML = "<span class='tr_experiencia'>" + full["empresa"] + "</span>";
          HTML += "<span><br/><b>" + TXT_COL_FUNCAO + ":</b>&nbsp;" + full["funcao_ini"] + " - " + full["funcao_fim"] + "</span>";
          HTML += "<span><br/><b>" + TXT_COL_DT_ADMISSAO + ":</b>&nbsp;" + (full["dt_admissao"] ? full["dt_admissao"] : '') + "</span>";
          if (full["dt_demissao"]) {
            HTML += "<span><br/><b>" + TXT_COL_DT_DEMISSAO + ":</b>&nbsp;" + full["dt_demissao"] + "</span>";
          }
          return HTML;
        }
      },
      {
        "mData": TXT_COL_ACOES,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-1 text-center',
        "mRender": function(data, type, full) {
          return "<a onclick='abrir_form_nova_experiencia(" + full["cand_exp_id"] + ")' title='" + TITLE_EDIT + "'><i class='" + ICONE_EDIT + "'></i> </a> " +
            "<a onclick='remover_experiencia(" + full["cand_exp_id"] + ")' title='" + TITLE_DELETE + "'><i class='" + ICONE_DELETE + "'></i></a>";
        }
      },
    ]
  });
}

var recarregar_experiencias = function() {
  TABELA_EXPERIENCIAS.reload();
}

var change_sem_experiencia = function() {
  if (!$(this).is(':checked')) {
    $("#div_cad_experiencias").show();
    return true;
  } else {
    if ($(".tr_experiencia").length != 0) {
      $.dialogs.confirm(TXT_CONFIRMAR, TXT_CONFIRMAR_LIMPEZA_EXPERIENCIA,
        function() {
          $.ajax({
            url: URL_LIMPAR_EXPERIENCIA,
            type: 'get',
            cache: false,
            dataType: 'json',
            assync: false,
            data: {},
            success: function(retorno) {
              recarregar_experiencias();
              $("#div_cad_experiencias").hide();
            }
          });
        },
        function() {
          $('#id_sem_experiencia').attr('checked', false);
        });
    } else {
      $("#div_cad_experiencias").hide();
      return true;
    }
  }
}

$(function() {
  listar_experiencias();
});
