var $image, data_logo, cropper;

var deletar_logo = function() {
  $.dialogs.confirm(TXT_CONFIRM_EXCLUIR_LOGO, function() {
    mostrarCarregando();
    $.ajax({
      url: URL_REMOVER_LOGO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {},
      success: function(dados) {
        if (dados["status"] == 'ok') {
          $("#id_logo").attr("src", dados["msg"]);
          TEM_LOGO = false;
          $("#id_remove_logo").hide();
        } else {
          $.dialogs.error(dados["msg"]);
        }
      },
      complete: esconderCarregando
    });
  });
};

var cancelar_logo = function() {
  $("#div_recorte").html("");
  $("#div_recorte").hide();
  $(".hide_on_recorte").show();
};

var salvar_logo = function() {
  // Salvamento
  mostrarCarregando();
  $.ajax({
    url: URL_SALVAR_LOGO,
    type: 'post',
    dataType: 'json',
    data: data_logo,
    success: function(dados) {
      if (dados["status"] == "ok") {
        $("#url_logo").val(dados["url_logo"]);
        $("#id_static_url_logo").val(dados["url_src"]);
        $("#id_binary_logo").val(dados["binary_logo"]);
        $("#id_name_logo").val(dados["name_logo"]);
        $("#id_logo").attr("src", dados["url_src"]);
        cancelar_logo();
        TEM_LOGO = true;
        $("#id_remove_logo").show();
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: esconderCarregando
  });
};

var iniciar_componente_recorte = function(url_imagem) {
  $("#logo_vaga_recorte").attr("src", url_imagem);
  $("#url_logo").val(url_imagem);
  $image = $(".cropper");
  $image.cropper({
  //  aspectRatio: RECORTE_RATIO,
    data: {
      x: 1,
      y: 1,
      width: RECORTE_WIDTH,
      height: RECORTE_HEIGHT
    },
    preview: ".preview",
    // 3x4
    minWidth: RECORTE_MIN_WIDTH,
    minHeight: RECORTE_MIN_HEIGHT,
    resizable: true,
    zoomable: true,
    done: function() {
      data_logo = $.extend($image.cropper("getImageData"), {
        'url_logo': $("#url_logo").val(),
        'data': $image.cropper("getDataURL", "image/jpeg") // logo recortada
      });
    }
  });
  cropper = $image.data("cropper");

  // Mini Botões
  $("#clear_mini").click(function() {
    $image.cropper("clear");
  });

  $("#rotate").click(function() {
    $image.cropper("rotate", $("#rotateWith").val());
  });

  $("#rotate_right_mini").click(function() {
    $image.cropper("rotate", 90);
  });

  $("#rotate_left_mini").click(function() {
    $image.cropper("rotate", -90);
  });

  $("#zoom").click(function() {
    $image.cropper("zoom", $("#zoomWith").val());
  });

  $("#zoom_in_mini").click(function() {
    $image.cropper("zoom", 0.1);
  });

  $("#zoom_out_mini").click(function() {
    $image.cropper("zoom", -0.1);
  });

  //$('.modal-backdrop.fade.in').remove();

};

var iniciar_componente_upload = function() {
  $('#file_logo').fileupload({
    url: URL_RECORTE_LOGO,
    dataType: 'json',
    done: function(e, data) {
      resposta = data._response.result;
      if (resposta["status"] == "ok") {
        $("#div_recorte").html(resposta["html_modal"]);
        $("#div_recorte").show();
        $(".hide_on_recorte").hide();
        iniciar_componente_recorte(resposta["url_imagem"]);
      } else {
        $.dialogs.error(TXT_ARQUIVO_INVALIDO)
      }
    }
  });
};

$(function() {
  $('.img_del_logo').click(deletar_logo);
  $("#id_add_logo, #img_logo, #id_logo").click(function() {
    $("#file_logo").click();
  });
  iniciar_componente_upload();
  if (!TEM_LOGO) {
    $("#id_remove_logo").hide();
  }
});
