var INDICE_PRODUTO = 0;
var OLD_PRODUTO_PRODUTO_ATUAL = '';
var OLD_PRODUTO_CONSOME_ATUAL = '';

var cancelar_produto = function(id_campo) {
  // Cancela o novo produto
  $('#' + id_campo).remove();
}

var abrir_form_novo_produto = function() {
  // Monta o formuário para novo produto

  // Não deixa abrir novo formulario se o anterior estiver sem produto
  var vazia = false;
  $.each($(".campo_produto"), function(idx, value) {
    if (!$(value).val()) {
      vazia = true;
    }
  });
  if (vazia) {
    $.dialogs.error(TXT_ALERT_PRODUTO_N_PREENCHIDAS);
    return false;
  }

  $.ajax({
    url: URL_FORM_PRODUTO,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      cliente: CLIENTEID,
      indice: INDICE_PRODUTO,
    },
    success: function(retorno) {
      $("#div_produtos").append(retorno['html']);
      INDICE_PRODUTO += 1;
      validar_produtos_duplicados();
    }
  });
}

var validar_produtos_duplicados = function() {
  $(".campo_produto").off("change");
  $(".campo_produto").on("change", function() {

    var id = $(this).attr('id');
    var valor = $("#" + id).val();

    var achei = false;
    $.each($(".campo_produto"), function(idx, value) {
      if (!achei && ($(value).val() == valor) && ($(value).attr('id') != id)) {
        achei = true;
      }
    });

    if (achei) {
      $.dialogs.error(TXT_ALERT_PRODUTO_DUPLICADO);
      $(this).val("")
    }

  });
}

var tratar_produtos = function() {
  // -- Capta os formulários de produtos preenchidos e coloca em um campo texto escondido
  var produtos = [];
  $.each($(".campo_produto"), function(idx, value) {
    var id = $(value).attr('id');
    var indice = id.replace('id_produto_produto_', '');
    var id_consome = 'id_produto_consome_' + indice;
    if ($("#" + id).val()) {
      produtos.push($("#" + id).val() + ':' + $("#" + id_consome).val());
    }
  });
  $("#id_produtos").val(produtos.join("|"));
}


var remover_produto = function(indice) {
  $.dialogs.confirm('', TXT_CONFIRMAR_EXCLUIR_PRODUTO,
    function() {
      $.ajax({
        url: URL_DELETAR_PRODUTO,
        type: 'get',
        cache: false,
        dataType: 'json',
        data: {
          id: $("#id_id_cliproduto_" + indice).val()
        },
        success: function(retorno) {
          $.dialogs.success(TXT_SUCESSO_EXCLUIR_PRODUTO);
          $("#div_produto_" + indice).remove();
        }
      });
    }
  );
}

var editar_produto = function(indice) {
  // Abre a Edição da função e guarda o valor antigo para caso cancelamento
  OLD_PRODUTO_PRODUTO_ATUAL = $("#id_produto_produto_" + indice).val();
  OLD_PRODUTO_CONSOME_ATUAL = $("#id_produto_consome_" + indice).val();
  $("#id_produto_produto_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_produto_consome_" + indice).removeAttr('readonly').removeAttr('disabled');
  $("#id_editar_produto_" + indice).hide();
  $("#id_remover_produto_" + indice).hide();
  $("#id_salvar_produto_" + indice).show();
  $("#id_cancelar_produto_" + indice).show();
}

var cancelar_edicao_produto = function(indice) {
  // Cancela a Edição da função e retorna o valor antigo para os campos
  $("#id_produto_produto_" + indice).val(OLD_PRODUTO_PRODUTO_ATUAL);
  $("#id_produto_consome_" + indice).val(OLD_PRODUTO_CONSOME_ATUAL);
  OLD_PRODUTO_PRODUTO_ATUAL = "";
  OLD_PRODUTO_CONSOME_ATUAL = "";
  $("#id_produto_produto_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_produto_consome_" + indice).attr('readonly', true).attr('disabled', true);
  $("#id_editar_produto_" + indice).show();
  $("#id_remover_produto_" + indice).show();
  $("#id_salvar_produto_" + indice).hide();
  $("#id_cancelar_produto_" + indice).hide();
}

var salvar_produto = function(indice) {
  $.ajax({
    url: URL_SALVAR_PRODUTO,
    type: 'get',
    cache: false,
    dataType: 'json',
    data: {
      id_edicao: $("#id_id_cliproduto_" + indice).val(),
      produto: $("#id_produto_produto_" + indice).val(),
      consome: $("#id_produto_consome_" + indice).val(),
      cliente: CLIENTEID,
    },
    success: function(retorno) {
      if (retorno['status'] == 'ok') {
        $.dialogs.success(retorno['msg']);
        OLD_PRODUTO_PRODUTO_ATUAL = $("#id_produto_produto_" + indice).val();
        OLD_PRODUTO_CONSOME_ATUAL = $("#id_produto_consome_" + indice).val();
        cancelar_edicao_produto(indice);
        $("#id_cancelar_produto_" + indice).attr('onclick', 'cancelar_edicao_produto("' + indice + '")');
        $("#id_id_cliproduto_" + indice).val(retorno['codigo']);
      } else {
        $.dialogs.error(retorno['msg']);
      }
    }
  });
}

$(function() {
  INDICE_PRODUTO = $(".campo_produto").length;
  validar_produtos_duplicados();
})
