var listar_eventos = function(date) {
  /* Lista os eventos padrões cadastrados */
  $.ajax({
    url: URL_LISTA_EVENTOS,
    type: 'get',
    dataType: 'json',
    data: {
      'usuarios': $("#id_usuarios").val(),
    },
    success: function(dados) {
      $("#events-list").html(dados['html']);

      $('#events-list .list-header > span').each(function() {
        var eventObject = {
          id: $(this).attr("evento_id"),
          title: $.trim($(this).text()) // use the element's text as the event title
        };
        // store data so the calendar knows to render an event upon drop
        $(this).data('eventObject', eventObject);
        // make the event draggable using jQuery UI
        $(this).draggable({
          zIndex: 999,
          revert: true, // will cause the event to go back to its
          revertDuration: 0 //  original position after the drag
        });
      });

      $(".evento_excluir").click(function() {
        var id = $(this).attr("evento_id");
        excluir_evento(id);
      });

      $(".evento_abrir").click(function() {
        var id = $(this).attr("evento_id");
        abrir_novo_evento(id)
      });
    }
  });
};

var abrir_novo_evento = function(id) {

  var dados = serializaForm('#filtros_agenda', '');
  if (id != undefined) {
    dados['codigo'] = id;
  }

  $.ajax({
    url: URL_FORM_EVENTO,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {
      $("#cadastro_evento_modal_body").html(data["html"]);

      $("#btn_salvar_evento").show();
      $("#cadastro_evento_modal_title").html(TXT_TITULO_CAD_EVENTO);

      $("#id_enviar_notificacao").change(function() {
        if ($(this).is(":checked")) {
          $(".show_on_enviar_notificacao").show();
        } else {
          $(".show_on_enviar_notificacao").hide();
        }
      });
      $("#id_enviar_notificacao").change();

      // Prepara o conteiner dos selecionados
      $("[for='usuarios_evento']").parent().append("<span class='col-md-12 text-black'>Selecionados:</span>");
      $("[for='usuarios_evento']").parent().append("<span id='usuarios_evento_selecionados' class='col-md-12' style='max-height: 80px; overflow: auto;'></span>");
      // Popula o conteiner ao clicar em um usuario
      $("[name='usuarios_evento']").click(function() {
        nome_user = $(this).parent().find(".descricao_user:first").html();
        $("#usuarios_evento_selecionados").html("");
        $.each($("[name='usuarios_evento']:checked"), function(idx, value) {
          nome_user = $(value).parent().find(".descricao_user:first").html();
          $("#usuarios_evento_selecionados").append("<span nome_user_span='" + nome_user + "'>" + nome_user + "<br> </span>");
        });
      });
      //
      $.each($("[name='usuarios_evento']:checked"), function(idx, value) {
        nome_user = $(value).parent().find(".descricao_user:first").html();
        $("#usuarios_evento_selecionados").append("<span nome_user_span='" + nome_user + "'>" + nome_user + "<br> </span>");
      })

      $("#div_id_usuarios_evento > div > ul > li.multiselect-item.multiselect-all > a > label > input[type='checkbox']").click(function() {
        $("#usuarios_evento_selecionados").html("");
        if ($(this).is(":checked")) {
          $("#usuarios_evento_selecionados").append("<span nome_user_span='todos'>Todos<br> </span>");
        }
      })

      $(".show_on_agenda").hide();
      $(".hide_on_agenda").show();
      $(".hide_on_evento").hide();

    }
  });
}

var excluir_evento = function(id_comp) {
  $.dialogs.confirm(
    TXT_EXC,
    TXT_MSG_CONFIRMAR_EXCLUIR_EVENTO,
    function(resp) {
      if (resp) {
        $.ajax({
          url: URL_EXCLUIR_EVENTO,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            'id': id_comp
          },
          success: function(dados) {
            if (dados['status'] == 'ok') {
              $.dialogs.success(TXT_EXCLUIR_SUCESSO_EVENTO);
              listar_eventos();
            } else {
              $.dialogs.error(TXT_EXCLUIR_ERRO_EVENTO);
            }
          }
        });
      }
    }
  );
};

var salvar_evento = function() {

  disable_btn("form_agenda");
  if (!$('#form_agenda').parsley().validate()) {
    enable_btn("form_agenda");
    return false;
  }

  dados = serializaForm($('#form_agenda'));
  dados['usuarios_evento'] = $("#id_usuarios_evento").val().join("|");

  $.ajax({
    url: URL_SALVAR_EVENTO,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {
      // Acrescenta na paginação
      if (data['status'] == 'ok') {
        $.dialogs.success(data['msg']);
        listar_eventos();
        fechar_detalhes();
      } else {
        $.dialogs.error(data['msg']);
      }
    },
    error: function(data) {
      $.dialogs.error(data['responseText']);
      esconderCarregando();
    }
  });

}


$(function() {

  $("#btn_novo_evento").click(function() {
    abrir_novo_evento();
  });
  $("#btn_salvar_evento").click(salvar_evento);

})
