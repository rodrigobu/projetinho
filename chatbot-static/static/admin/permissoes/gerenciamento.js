var selecionar_usuarios = function(usuarios_id) {
  var usuarios = $("#id_usuarios").val();
  var grupos = $("#id_grupos").val();

  if (usuarios==undefined  && grupos==undefined) {
    $.dialogs.error("É necessário selecionar pelo menos um usuário e/ ou grupo.");
  } else if (usuarios!=undefined  && usuarios.length > 6) {
    $.dialogs.error("O limite de Usuários selecionados é 6.");
  } else if (grupos!=undefined  && grupos.length > 6) {
      $.dialogs.error("O limite de Grupos selecionados é 6.");
  } else {
      $.ajax({
        url: URL_LISTAGEM,
        dataType: 'json',
        type: 'post',
        data: {
          'usuarios': $("#id_usuarios").val(),
          'grupos': $("#id_grupos").val(),
          'grupos_permissoes': $("#id_grupos_permissoes").val()
        },
        success: function(retorno) {
          $("#body_usuarios").html(retorno['html']);
        }
      });
    }
}

var abrir_detalhes_permissao = function(prefixo, grupo_perm) {
  $("." + prefixo + "_icone_fechar").click();
  if (prefixo == 'user') {
    var usuarios = $("#id_usuarios").val();
    var grupos = [];
  } else {
    var grupos = $("#id_grupos").val();
    var usuarios = [];
  }

  $.ajax({
    url: URL_DETALHES,
    dataType: 'json',
    type: 'get',
    data: {
      grupo_perm: grupo_perm,
      usuarios: usuarios,
      grupos: grupos,
      prefixo: prefixo
    },
    success: function(retorno) {
      $("." + prefixo + "_line_grupo[grupo='" + grupo_perm + "']").after(retorno['html']);
      $("." + prefixo + "_icone_abrir[grupo='" + grupo_perm + "']").hide();
      $("." + prefixo + "_icone_fechar[grupo='" + grupo_perm + "']").show();
      $("." + prefixo + "_container_grupo[grupo='" + grupo_perm + "']").show();

      $.each($("." + prefixo + "_checkbox_macro_grupo[data_grupo_id='" + grupo_perm + "']"), function(idx, value) {
        var registro = $(value).attr("data_registro_id");

        // Verifica se seus checks estao todos marcados e se marca
        var qtde_perms = $("." + prefixo + '_checkbox_minor_grupo[data_grupo_id="' + grupo_perm + '"][data_registro_id="' + registro + '"]').length;
        var qtde_perms_checked = $("." + prefixo + '_checkbox_minor_grupo[data_grupo_id="' + grupo_perm + '"][data_registro_id="' + registro + '"]:checked').length;
        $("." + prefixo + '_checkbox_macro_grupo[data_grupo_id="' + grupo_perm + '"][data_registro_id="' + registro + '"]').prop("checked", qtde_perms_checked == qtde_perms);

        $(value).click(function() {
          var registro_id = $(this).attr("data_registro_id");
          var grupo = $(this).attr("data_grupo_id");
          $("." + prefixo + '_checkbox_minor_grupo[data_grupo_id="' + grupo + '"][data_registro_id="' + registro_id + '"]').prop("checked", $(this).is(":checked"));
        });
        $(value).show();

      });

      $("." + prefixo + "_checkbox_minor_grupo").click(function() {
        var grupo = $(this).attr("data_grupo_id");
        var registro_id = $(this).attr("data_registro_id");

        if ($(this).is(":checked")) {
          var qtde_perms = $("." + prefixo + '_checkbox_minor_grupo[data_grupo_id="' + grupo + '"][data_registro_id="' + registro_id + '"]').length;
          var qtde_perms_checked = $("." + prefixo + '_checkbox_minor_grupo[data_grupo_id="' + grupo + '"][data_registro_id="' + registro_id + '"]:checked').length;
          $("." + prefixo + '_checkbox_macro_grupo[data_grupo_id="' + grupo + '"][data_registro_id="' + registro_id + '"]').prop("checked", qtde_perms_checked == qtde_perms);
        } else {
          $("." + prefixo + '_checkbox_macro_grupo[data_grupo_id="' + grupo + '"][data_registro_id="' + registro_id + '"]').prop("checked", false);
        }

      });


    }
  });
}

var fechar_detalhes_permissao = function(prefixo, grupo_perm) {
  $("." + prefixo + "_container_grupo[grupo='" + grupo_perm + "']").remove();
  $("." + prefixo + "_container_grupo_salvar[grupo='" + grupo_perm + "']").remove();
  $("." + prefixo + "_icone_abrir[grupo='" + grupo_perm + "']").show();
  $("." + prefixo + "_icone_fechar[grupo='" + grupo_perm + "']").hide();
  $("." + prefixo + "_checkbox_macro_grupo[data_grupo_id='" + grupo_perm + "']").hide();
}

var salvar_permissoes_user = function(grupo_perm) {
  _salvar_permissoes(grupo_perm, 'user')
}

var salvar_permissoes_grupo = function(grupo_perm) {
  _salvar_permissoes(grupo_perm, 'grupo')
}

var _salvar_permissoes = function(grupo_perm, prefixo) {

  var selector = "." + prefixo + "_checkbox_minor_grupo[data_grupo_id='" + grupo_perm + "']";

  var ids_permissoes_select = [];
  $.each($(selector + ":checked"), function(idx, value) {
    ids_permissoes_select.push( $(value).attr("data_registro_id") + ":" + $(value).attr("data_perm_id") );
  });

  var ids_permissoes_nao_select = [];
  $.each($(selector + ":not(:checked)"), function(idx, value) {
    ids_permissoes_nao_select.push( $(value).attr("data_registro_id") + ":" + $(value).attr("data_perm_id") );
  });

  var dados = {
    ids_permissoes_select: ids_permissoes_select,
    ids_permissoes_nao_select: ids_permissoes_nao_select
  };
  dados["grupo_perm"] = grupo_perm;
  dados["tipo"] = prefixo;

  mostrarCarregando();
  $.ajax({
    url: URL_SALVAR,
    dataType: 'json',
    type: 'post',
    data: dados,
    success: function(retorno) {
      $.dialogs.success(MSG_SUCCESS);
    },
    complete: esconderCarregando
  });

}


$(function() {
  $("#id_btn_filtrar").click(selecionar_usuarios)
});
