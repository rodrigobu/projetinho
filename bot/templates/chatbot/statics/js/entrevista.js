var csrftoken = Cookies.get('csrftoken');

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  }
});

var chatlog = $('.js-chat-log');
var input = $('.chat_text');
var input_btn_left = $('#js-btn-left');
var input_btn_right = $('#js-btn-right');
var botaoEnviar = $('.chat_enviar');
var chatNotificacao = $(".chat_notificacao");
var chat_input = $("#chat_input");

const input_text = function() {
  let _input_text =
    '<input type="text" id="input_text" class="form-control chat_text chat_text_entrevista col-md-6  col-xs-12"  placeholder="'+TXT_DIGITE+'..." />' +
    '<button type="button" class="btn btn-info chat_enviar">' +
    '<i class="fa fa-send-o"></i>' +
    '</button>';
  chat_input.empty();
  chat_input.append(_input_text);
  setFocusToTextBox();
}

const initEventsInputText = function() {
  let chatlog = $('.js-chat-log');
  chatlog[0].scrollTop = chatlog[0].scrollHeight;

  $('.chat_enviar').click(function() {
    submitInput(input.val(), input.val());
  });

  $('.chat_text_entrevista').keydown(function(event) {
    // Submit the input when the enter button is pressed
    if (event.keyCode == 13) {
      submitInput(input.val(), input.val());
    }
  });
}

function createRowUsuario(options, text = '') {
  var message = '<li class="">' +
    '<div class="message-entry container_chat_ent" style="font-size: 1.2em;">' +
    `<img src="${candFoto}" alt="Avatar" class="right img-responsive "/>`;
  if (options) {
    let elementId = new Date().getTime().toString();

    if (options.media === 'audio' && options.el) {
      let audioDiv = document.createElement('div');
      options.el.id = elementId;
      audioDiv.appendChild(options.el);
      message += audioDiv.outerHTML;

      chatlog.append(message);
      if (chatlog.length) chatlog[0].scrollTop = chatlog[0].scrollHeight;
      return options.el;
    }

    if (options.media === 'video' && options.el) {
      let videoDiv = document.createElement('div');
      videoDiv.appendChild(options.el);
      message += videoDiv.outerHTML;

      chatlog.append(message);
      if (chatlog.length) chatlog[0].scrollTop = chatlog[0].scrollHeight;
      return options.el;
    }

  } else {
    message += `<p class="conversa" style="text-align:right;">${text}</p>` +
      '</div>'; +
    '</li>';
  }

  chatlog.append(message);

}

function createRowBot(text) {
  var message = '<li class="">' +
    '<div class="message-entry container_chat_ent conv_bot" style="font-size: 1.2em;">' +
    `<img src="${botFoto}"  alt="Avatar" class="left" />` +
    `<p class="conversa conversa_entrevista">${text}</p>`; +
  '</div>'; +
  '</li>';

  chatlog.append(message);
}

function sendMediaBlob(type, blob) {
  if (!type || !blob) return null;
  let typeText;
  let extension;
  let mime;

  if (type === 'audio') {
    typeText = 'áudio';
    extension = 'mp3';
    mime = 'audio/mp3';
  } else if (type === 'video') {
    typeText = 'vídeo';
    extension = 'mp4';
    mime = 'video/mp4';
  }

  let formData = new FormData();
  let filename = getFileName(extension);
  let file = new File([blob], filename, {
    type: mime,
    lastModified: Date.now()
  });

  let msgReceived = `Recebi o seu ${typeText}!`;

  formData.append('file', file);

  $.ajax({
      type: 'POST',
      url: saveMediaURL,
      data: formData,
      global: false,
      /*Para cancelar o carregamento do ajax*/
      processData: false,
      contentType: false
    })
    .done(function(res) {
      console.log(res);
      if (res.status === 'ok') {
        createRowBot(msgReceived);
        input_text();
        initEventsInputText();
      }
    })
    .fail(function(err) {
      console.log(err);
    });
}

const cancelClick = function() {
  let allUserMessages = document.querySelectorAll('div.message-entry.container_chat_ent:not(.conv_bot)');
  let lastUserMessage = allUserMessages[allUserMessages.length - 1];
  let lastUserMessageLi = lastUserMessage.parentNode;
  lastUserMessageLi.parentNode.removeChild(lastUserMessageLi);

  createRowBot('Você cancelou o envio!');

  input_text();
  initEventsInputText();
}

function createVideoSubmit(e) {
  if (!e) e = window.event;
  e.stopPropagation();

  startVideoRecording();
}

function createAudioSubmit(e) {
  if (!e) e = window.event;
  e.stopPropagation();

  StartRecording();

}

function responder_alternativa(element){
    var btn_left = $(element).val()
    submitInput(btn_left, $(element).val());
}

function submitInput(input_val, input_resp) {

  var inputData = {
    'text': input_val,
    // 'extra_data': [candidato, vaga]
  }
  var inputDataResp = {
    'text': input_resp,
  }
  // Display the user's input on the web page
  createRowUsuario(null, inputData.text);
  console.log(chatterbotUrl);
  var $submit = $.ajax({
    type: 'POST',
    url: chatterbotUrl,
    data: JSON.stringify(inputData),
    global: false,
    /*Para cancelar o carregamento do ajax*/
    contentType: 'application/json'
  });

  $submit.done(function(statement) {
    createRowBot(statement.text);
    // Clear the input field

    if (statement.extra_data.is_alternativa) {
      var input_btn = '';
      if (statement.extra_data.alternativas.length!=0) {
        $.each(statement.extra_data.alternativas, function(idx, value) {
          input_btn += '<input type="button" class="btn btn-primary js-btn-alternativa col-md-2 col-xs-12" value="' + value[0] + '" title="' + value[0] + '" onclick="responder_alternativa(this)"/>';
        })
      } else {
        input_btn = '<input type="button" class="btn btn-success js-btn-alternativa col-md-2 col-xs-12" value="'+TXT_SIM+'" onclick="responder_alternativa(this)"/>' +
          '<input type="button" class=" btn btn-danger js-btn-alternativa col-md-2 col-xs-12" value="'+TXT_NAO+'" onclick="responder_alternativa(this)"/>';
      }

      chat_input.empty();
      chat_input.append(input_btn);
    } else {
      if (statement.extra_data.respondida) {
        chat_input.empty();
      } else {
        input_text()
        setFocusToTextBox();
      }

    }

    // Scroll to the bottom of the chat interface
    chatlog[0].scrollTop = chatlog[0].scrollHeight;

    $('.chat_text').keydown(function(event) {
      // Submit the input when the enter button is pressed
      if (event.keyCode == 13 && !statement.extra_data.respondida) {
        submitInput($('.chat_text').val(), $('.chat_text').val());

      }
    });

    $('.chat_enviar').click(function() {
      submitInput($('.chat_text').val(), $('.chat_text').val());
    });

  });


}

botaoEnviar.click(function() {
  submitInput(input.val(), input.val());
});

$('#js-btn-left').click(function() {
  var btn_left = $('#js-btn-left').val()
  submitInput(btn_left, $('#js-btn-left').val());
});

input_btn_right.click(function() {
  var btn_right = input_btn_right.val()
  submitInput(btn_right, input_btn_right.val());
});

input.keydown(function(event) {
  // Submit the input when the enter button is pressed
  if (event.keyCode == 13) {
    submitInput(input.val(), input.val());
  }
});

$('.chat-user').click(function() {
  chatNotificacao.hide();
});

function setFocusToTextBox() {
  document.getElementById("input_text").focus();
}
