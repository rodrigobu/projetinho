var captar_compromissos = function() {
  /* Lista os eventos da agenda */
  $(".tooltip").hide();
  return [{
    url: URL_FEED_EVENTS,
    type: 'GET',
    data: function() {
      dados = serializaForm('#filtros_agenda', '')
      usuarios = $("#id_usuarios").val();
      if(usuarios){
        dados['usuarios'] = usuarios.join("|");
      }
      return dados
    },
    cache: false,
    success: function() {
      // Fechar compromissos do dia
      $("#body_compromissos_dia").html("");
      $("#compromissos_do_dia").hide();
      fechar_detalhes();
    }
  }]
};

var recarregar_compromissos_do_dia = function() {
  if ($('#id_dia_selecionado').length != 0) {
    list_compromissos_dia($('#id_dia_selecionado').attr("valueus"));
  }
};

var list_compromissos_dia = function(date) {
  /* Lista os compromissos do dia. Acionado ao clicar no dia da agenda. */
  $.ajax({
    url: URL_LISTA_COMPROMISSO,
    type: 'get',
    dataType: 'json',
    data: {
      'date': date,
      'usuarios': $("#id_usuarios").val(),
    },
    success: function(dados) {
      $("#body_compromissos_dia").html(dados['html']);
      $("#compromissos_do_dia").show();

      $(".compromisso_excluir").click(function() {
        var id = $(this).attr("compromisso_id");
        excluir_compromisso(id);
      });

      $(".compromisso_abrir").click(function() {
        var id = $(this).attr("compromisso_id");
        abrir_novo_compromisso(id)
      });

    }
  });
};

var abrir_detalhes_compromisso = function(id) {
  abrir_novo_compromisso(id, true)
};

var abrir_novo_compromisso = function(id, modo_view) {

  var dados = serializaForm('#filtros_agenda', '');
  if (id != undefined) {
    dados['codigo'] = id;
  }
  if (modo_view != undefined) {
    dados['modo_view'] = modo_view;
  }

  $.ajax({
    url: URL_FORM_COMPROMISSO,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {
      $("#cadastro_compromisso_modal_body").html(data["html"]);

      if ($("#id_id_compromisso").length == 0) {
        $("#btn_salvar_compromisso").hide();
        $("#cadastro_compromisso_modal_title").html(TXT_TITULO_DET_COMP);

      } else {
        $("#btn_salvar_compromisso").show();
        $("#cadastro_compromisso_modal_title").html(TXT_TITULO_CAD_COMP);

        $("#id_dia_inteiro").change(function() {
          if ($(this).is(":checked")) {
            $(".hide_on_dia_inteiro").hide();
            $("#id_hora_inicio, #id_hora_termino, #id_data_termino").removeAttr('required');
            $("#id_hora_inicio").val('0:00');
            $("#id_hora_termino").val('23:59');
            $("#id_data_termino").val( $("#id_data_inicio").val() );
          } else {
            $(".hide_on_dia_inteiro").show();
            $("#id_hora_inicio, #id_hora_termino, #id_data_termino").attr('required',true);
          }
        });

        $("#id_data_inicio").change(function() {
          if ($("#id_dia_inteiro").is(":checked")) {
            $("#id_data_termino").val( $("#id_data_inicio").val() );
          }
        });

        $("#id_enviar_notificacao").change(function() {
          if ($(this).is(":checked")) {
            $(".show_on_enviar_notificacao").show();
          } else {
            $(".show_on_enviar_notificacao").hide();
          }
        });
        $("#id_enviar_notificacao").change();

        make_datepicker('#id_data_inicio');
        make_datepicker('#id_data_termino');

        if ($('#id_dia_selecionado').length != 0) {
          var dia_selecionado = $('#id_dia_selecionado').val();
          $('#id_data_inicio').val(dia_selecionado);
          $('#id_data_termino').val(dia_selecionado);
        }

        // Prepara o conteiner dos selecionados
        $("[for='usuarios_compromisso']").parent().append("<span class='col-md-12 text-black'>Selecionados:</span>");
        $("[for='usuarios_compromisso']").parent().append("<span id='usuarios_compromisso_selecionados' class='col-md-12' style='max-height: 80px; overflow: auto;'></span>");
        // Popula o conteiner ao clicar em um usuario
        $("[name='usuarios_compromisso']").click(function() {
          nome_user = $(this).parent().find(".descricao_user:first").html();
          $("#usuarios_compromisso_selecionados").html("");
          $.each($("[name='usuarios_compromisso']:checked"), function(idx, value) {
            nome_user = $(value).parent().find(".descricao_user:first").html();
            $("#usuarios_compromisso_selecionados").append("<span nome_user_span='" + nome_user + "'>" + nome_user + "<br> </span>");
          });
        });
        //
        $.each($("[name='usuarios_compromisso']:checked"), function(idx, value) {
          nome_user = $(value).parent().find(".descricao_user:first").html();
          $("#usuarios_compromisso_selecionados").append("<span nome_user_span='" + nome_user + "'>" + nome_user + "<br> </span>");
        });

        $("#div_id_usuarios_compromisso > div > ul > li.multiselect-item.multiselect-all > a > label > input[type='checkbox']").click(function() {
          $("#usuarios_compromisso_selecionados").html("");
          if ($(this).is(":checked")) {
            $("#usuarios_compromisso_selecionados").append("<span nome_user_span='todos'>Todos<br> </span>");
          }
        });

        var data_minima = new Date(Date.now());
        datas_menor_e_maior("#id_data_inicio", "#id_data_termino", data_minima);

      }

      $(".show_on_agenda").hide();
      $(".hide_on_agenda").show();
      $(".hide_on_compromisso").hide();

    }
  });
}

var excluir_compromisso = function(id_comp) {
  $.dialogs.confirm(
    TXT_EXC,
    TXT_MSG_CONFIRMAR_EXCLUIR_COMPROMISSO,
    function(resp) {
      if (resp) {
        $.ajax({
          url: URL_EXCLUIR_COMPROMISSO,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            'id': id_comp
          },
          success: function(dados) {
            if (dados['status'] == 'ok') {
              $.dialogs.success(TXT_EXCLUIR_SUCESSO);
              recarregar_agenda();
              recarregar_compromissos_do_dia();
              fechar_detalhes();
            } else {
              $.dialogs.error(TXT_EXCLUIR_ERRO);
            }
          }
        });
      }
    }
  );
};

var salvar_compromisso = function() {

  disable_btn("form_agenda");
  if (!$('#form_agenda').parsley().validate()) {
    enable_btn("form_agenda");
    return false;
  }

  var inicio = extrair_data("#id_data_inicio", "#id_hora_inicio");
  var fim = extrair_data("#id_data_termino", "#id_hora_termino");
  if (inicio >= fim) {
    $.dialogs.error(TXT_VAL_DATA);
    enable_btn("form_agenda");
    return false;
  }

  if (inicio == "Invalid Date" || fim == "Invalid Date") {
    $.dialogs.error(TXT_VAL_DATA);
    enable_btn("form_agenda");
    return false;
  }

  var data_minima = new Date(Date.now());
  if (data_minima >= fim || data_minima >= inicio) {
    $.dialogs.error(TXT_VAL_RETRO);
    enable_btn("form_agenda");
    return false;
  }

  dados = serializaForm($('#form_agenda'));
  dados['usuarios_compromisso'] = $("#id_usuarios_compromisso").val().join("|");

  $.ajax({
    url: URL_SALVAR_COMPROMISSO,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {
      // Acrescenta na paginação
      if (data['status'] == 'ok') {
        $.dialogs.success(data['msg']);
        recarregar_agenda();
        recarregar_compromissos_do_dia();
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

  $("#btn_novo_compromisso").click(function() {
    abrir_novo_compromisso();
  });
  $("#btn_salvar_compromisso").click(salvar_compromisso);
  fechar_detalhes();

})
