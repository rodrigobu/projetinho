var fechar_detalhes = function() {
  $(".hide_on_agenda").hide();
  $(".show_on_agenda").show();
}

var onclick_dia = function(date, allDay, jsEvent, view) {
  // Evento de clique no dia
  $(".tooltip").hide();
  list_compromissos_dia(date.format())
  $('.fc-dia-selected').removeClass('fc-dia-selected');
  $("[data-date='" + date.format() + "']").addClass('fc-dia-selected');
  return true;
};

var onclick_compromisso = function(calEvent, jsEvent, view) {
  $(".tooltip").hide();
  abrir_novo_compromisso(calEvent.id)
}

var resize_compromisso = function(event, delta, revertFunc, jsEvent, ui, view) {
  /* Executa mudança de datas e horario do compromisso */
  $(".tooltip").hide();
  $.dialogs.confirm(
    TXT_CONFIRM_ALTER_DATA_TITULO,
    TXT_CONFIRM_ALTER_DATA_MSG,
    function() {

      dados = {
        'id_compromisso': event.id,
        'start': event.start._d,
        'end': event.end._d,
        'allDay': event.allDay,
        'view': $('#calendar').fullCalendar('getView').name
      };

      $.ajax({
        url: URL_ALT_DATA_COMPROMISSO,
        type: 'get',
        dataType: 'json',
        async: false,
        data: dados,
        success: function(dados) {
          if (dados["status"] == "ok") {
            $.dialogs.success(dados["msg"]);
            recarregar_agenda();
            recarregar_compromissos_do_dia();
          } else {
            revertFunc();
            $.dialogs.error(dados["msg"]);
          }
        },
        error: function(xhr, text, error) {
          alerta_erros_js(xhr, text, error);
          revertFunc();
        },
      });
    },
    function(resp) {
      revertFunc();
    });
};

var recarregar_agenda = function() {
  $('#calendar').fullCalendar('refetchEvents');
  fechar_detalhes();
};

var renderizar_view = function() {
  var lastViewName;
  return function(view) {
    var view = $('#calendar').fullCalendar('getView');
    if (view.name == 'agendaDay' || view.name == 'listWeek' || view.name == 'agendaWeek') {
      $('.vt-goto-date, .fc-today-button').show();
      $('.vt-goto-msyear').hide();
    } else {
      $('.vt-goto-msyear').show();
      $('.vt-goto-date, .fc-today-button').hide();
    }
  }
};

var renderizar_evento = function(eventObj, $el) {
  $el.attr("title", eventObj.description);
  $el.tooltip({
    'html': true,
    'placement': "left",
    container: 'body'
  });
};

var soltar_evento = function(date, jsEvent, ui, resourceId) {
  /* Drop dos templates de compromissos */
  $(".tooltip").hide();
  dados = {
    'id_evento': $(this).attr('evento_id'),
    'date': date._d,
    'view': $('#calendar').fullCalendar('getView').name
  }
  $.ajax({
    url: URL_TRANSFERIR_COMPROMISSO,
    type: 'get',
    dataType: 'json',
    async: false,
    data: dados,
    success: function(dados) {
      if (dados['status'] == 'ok') {
        $.dialogs.success(dados['msg']);
        recarregar_agenda();
        abrir_novo_compromisso(dados['codigo']);
        recarregar_compromissos_do_dia();
      } else {
        $.dialogs.error(dados['msg']);
        recarregar_agenda();
      }
    },
    error: function() {
      recarregar_agenda();
    },
  });

};

var configurar_agenda = function() {
  /* Configura as ações e parâmetros da agenda */
  $('#calendar').fullCalendar({
    locale: LOCALE,
    timezoneParam: 'none',
    themeSystem: 'bootstrap3',
    businessHours: {
      dow: LISTA_DIAS_UTEIS,
      start: HORA_INICIAL_UTIL,
      end: HORA_FINAL_UTIL,
    },
    header: {
      left: 'prev,next today new',
      center: 'title',
      right: 'month,agendaWeek,listWeek,agendaDay'
    },
    views: {
      listWeek: {
        buttonText: TXT_LISTA_SEMANA
      },
      agenda: {
        eventLimit: 6 // adjust to 6 only for agendaWeek/agendaDay
      }
      /* agendaFourDay: {
         type: 'agenda',
         duration: { days: 3 },
         buttonText: '3 Dias'
       }*/
    },
    timeFormat: TIME_FORMAT,
    allDayText: TXT_DIA_INTEIRO,
    editable: true,
    nowIndicator: true,
    monthNames: LISTA_MESES,
    eventSources: captar_compromissos(),
    dayClick: onclick_dia,
    eventClick: onclick_compromisso,
    eventResize: resize_compromisso,
    eventDrop: resize_compromisso,
    droppable: true, // this allows things to be dropped onto the calendar !!!
    drop: soltar_evento,
    viewRender: renderizar_view(),
    eventRender: renderizar_evento,
  });

  /* Incrementando o botão de calendário para a View de Dia */
  var mudanca_data = function(dateText, inst) {
    var d = $.fullCalendar.moment($(".vt-goto-date").datepicker("getDate"));
    $('#calendar').fullCalendar('gotoDate', d);
  }
  $('.fc-prev-button').after('<button class="vt-goto-date btn btn-default"><i class="fa fa-calendar"></i></button>');
  make_datepicker($('.vt-goto-date'));
  $('.vt-goto-date').change(mudanca_data).on('changeDate', mudanca_data);


  var mudanca_ano_mes = function(dateText, inst) {
    var d = $.fullCalendar.moment($(".vt-goto-msyear").datepicker("getDate"));
    $('#calendar').fullCalendar('gotoDate', d);
  }
  $('.fc-prev-button').after('<button class="vt-goto-msyear btn btn-default"><i class="fa fa-calendar"></i></button>');
  make_monthyearpicker($('.vt-goto-msyear'));
  $('.vt-goto-msyear').change(mudanca_ano_mes).on('changeDate', mudanca_ano_mes);

  $('.vt-goto-date, .fc-today-button').hide();
  $('.fc-today-button').attr('title', TXT_HOJE_TOOLTIP);
  $('.fc-today-button').attr('alt', TXT_HOJE_TOOLTIP);
};


var injeta_src_usuario = function() {
  /* Injeta a quary viva para ativar render de imagem para listagens */
  $('.img_user:visible').livequery(function() {
    if (!$(this).attr("src")) {
      $(this).attr("src", URL_VER_FOTO + $(this).attr('user_id'))
    }
  });
}

$(function() {
  configurar_agenda();
  listar_eventos();
  injeta_src_usuario();

  $("#id_usuarios").on("change", function() {
    recarregar_agenda();
    listar_eventos();
  });


  // Prepara o conteiner dos selecionados
  $("#div_id_usuarios").parent().append("<span class='col-md-12 text-black'>Selecionados:</span>");
  $("#div_id_usuarios").parent().append("<span id='usuarios_selecionados' class='col-md-12' style='max-height: 80px; overflow: auto;'></span>");
  // Popula o conteiner ao clicar em um usuario
  $("[name='usuarios']").click(function() {
    nome_user = $(this).parent().find(".descricao_user:first").html();
    $("#usuarios_selecionados").html("");
    $.each($("[name='usuarios']:checked"), function(idx, value) {
      nome_user = $(value).parent().find(".descricao_user:first").html();
      $("#usuarios_selecionados").append("<span nome_user_span='" + nome_user + "'>" + nome_user + "<br> </span>");
    });
  });
  //
  $.each($("[name='usuarios']:checked"), function(idx, value) {
    nome_user = $(value).parent().find(".descricao_user:first").html();
    $("#usuarios_selecionados").append("<span nome_user_span='" + nome_user + "'>" + nome_user + "<br> </span>");
  })

  $("#div_id_usuarios > div > ul > li.multiselect-item.multiselect-all > a > label > input[type='checkbox']").click(function() {
    $("#usuarios_selecionados").html("");
    if ($(this).is(":checked")) {
      $("#usuarios_selecionados").append("<span nome_user_span='todos'>Todos<br> </span>");
    }
  })

})
