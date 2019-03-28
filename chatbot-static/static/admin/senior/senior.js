function marcar_ck_todos() {
  // - Atualiza o check de marcar todos de acordo com os cks marcados
  var todos_marcados = true;
  $.each($("[name=selecionar-cand]"), function(chk, idx) {
    if (!$(idx).is(":checked")) {
      todos_marcados = false;
    }
  });
  if (todos_marcados & $("[name=selecionar-cand]").length != 0) {
    $("[name=selecionar-todas]").attr("checked", "checked");
    $("[name=selecionar-todas]").prop("checked", "checked");
  } else {
    $("[name=selecionar-todas]").removeAttr("checked");
  }
};


function salvar_marcacao_checkbox(checkbox) {
  // - Seleciona o pdi e grava na lista (individual)
  marcado = $(checkbox).is(":checked");
  marcar_ck_todos();

  $.ajax({
    url: URL_MARCAR,
    type: 'get',
    dataType: 'json',
    data: {
      id_cand: $(checkbox).attr("id"),
      marcado: marcado
    },
    success: function(dados) {
      atualizar_qtde(dados["qtde"]);
    }
  });
};


function salvar_marcacao_todos() {
  // - Seleciona os pdis e grava na lista (em lote)
  if ($('[name=selecionar-cand]').length != 0) {

    marcado = $(this).is(":checked");
    if (marcado) {
      $("[name=selecionar-cand]").attr("checked", "checked");
      $("[name=selecionar-cand]").prop("checked", "checked");
    } else {
      $("[name=selecionar-cand]").removeAttr("checked");
    }

    var ids_pdis = $.map($("[name=selecionar-cand]"), function(chk, idx) {
      return $(chk).attr("id");
    }).join(',');

    $.ajax({
      url: URL_MARCAR,
      type: 'get',
      dataType: 'json',
      data: {
        'ids_cands': ids_cands,
        'marcado': marcado
      },
      success: function(dados) {
        atualizar_qtde(dados["qtde"]);
      }
    });
    return true;

  } else {
    $(this).removeAttr("checked");
    return false;

  }
}


function selecionar_nenhum() {
    mostrarCarregando();
    $.ajax({
      url: URL_DESMARCAR_TODOS,
      type: 'get',
      data: {},
      dataType: 'json',
      success: function() {
        $("[name='selecionar-cand']").removeAttr("checked");
        $("[name='selecionar-todas']").removeAttr("checked");
        atualizar_qtde(0);

      },
      complete: esconderCarregando
    });
};


function selecionar_marcados() {
  // Seleciona os ids marcados que estão na página
  $.ajax({
    url: URL_GET_MARCADOS,
    type: 'get',
    cache: false,
    dataType: 'json',
    async: false,
    success: function(retorno) {
      $.each(retorno["ids"], function(idx, value) {
        if (value != "") {
          $("input#" + value).attr("checked", "checked");
        }
      });
      atualizar_qtde(retorno["ids"].length);
      marcar_ck_todos();
    }
  });
};


function atualizar_qtde(qtde) {
  //-- Atualiza a quantidade de PDI's marcados
  QTDE = parseInt(qtde);
};

function exportar_cands() {
  if (QTDE == 0) {
    $.dialogs.error(INVALID_SELECT_ONE);
    esconderCarregando();
    return;
  }
  $.ajax({
    url: URL_EXPORTAR,
    type: 'post',
    dataType: 'json',
    async: false,
    data: {},
    success: function(retorno) {
      if (retorno["laudo"] == 'true') {
        msg = TXT_CONFIRMAR_MSG_LAUDO;
        titulo = TXT_CONFIRMAR_LAUDO;
      } else {
        msg = TXT_CONFIRMAR_MSG;
        titulo = TXT_CONFIRMAR;
      }
      $.dialogs.success(titulo, msg, function() {
          window.open(get_base_path_windows() + "/media/tmp/" + retorno["arquivo"], '_blank');
          selecionar_nenhum();
      });
    }
  });
};



function criar() {
  //-- Criação e configuração da listagem
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA,
    container: "datatable",
    filterForm: '#filtro_consulta',
    order: [
      [1, "asc"]
    ],
    aoColumns: [{
      "sTitle": "<input class='center' name='selecionar-todas' type='checkbox'>",
      'sType': 'html',
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 text-center',
      "mRender": function(data, type, full) {
        return "<input class='center checkbox_colab' id='" + full["id"] + "' name='selecionar-cand' type='checkbox'>";
      }
    }, {
      "mData": TXT_COLUMN_CODIGO,
      'orderable': false,
      'searchable': false,
      'class': 'col-md-1 center',
      "mRender": function(data, type, full) {
        return full["id"];
      }
    }, {
      "mData": TXT_COLUMN_NOME,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-10',
      "mRender": function(data, type, full) {
        return full["nome"];
      }
    }, ],
    complete: function() {
      selecionar_marcados();
      //-- Cria a ação de selecionar todos os colaboradores da pagina
      $("[name=selecionar-todas]").change(salvar_marcacao_todos);
      $("[name=selecionar-cand]").change(function() {
        salvar_marcacao_checkbox(this);
      });
    }
  });
  selecionar_marcados();
}

function consultar() {
  //-- Reload na listagem
  TABELA_CONSULTA.reload();
};


$(function() {
  criar();

  $("#id_btn_filtrar").click(function(e) {
    e.preventDefault();
    consultar();
  });


  $('#selecionar_nenhum').click(selecionar_nenhum);
  $('#id_btn_exportar').click(exportar_cands);


});
