var $image, data_foto, cropper;

var deletar_foto = function() {
  $.dialogs.confirm(TXT_CONFIRM_EXCLUIR_FOTO, function() {
    mostrarCarregando();
    $.ajax({
      url: URL_REMOVER_FOTO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {},
      success: function(dados) {
        if (dados["status"] == 'ok') {
          $("#id_foto").attr("src", dados["msg"]);
          TEM_FOTO = false;
          $("#id_remove_foto").hide();
        } else {
          $.dialogs.error(dados["msg"]);
        }
      },
      complete: esconderCarregando
    });
  });
};

var cancelar_foto = function() {
  $("#div_recorte").html("");
  $("#div_recorte").hide();
  $(".hide_on_recorte").show();
};

var salvar_foto = function() {
  // Salvamento
  mostrarCarregando();
  $.ajax({
    url: URL_SALVAR_FOTO,
    type: 'post',
    dataType: 'json',
    data: data_foto,
    success: function(dados) {
      if (dados["status"] == "ok") {
        $("#url_foto").val(dados["url_foto"]);
        $("#id_static_url_foto").val(dados["url_src"]);
        $("#id_binary_foto").val(dados["binary_foto"]);
        $("#id_name_foto").val(dados["name_foto"]);
        $("#id_foto").attr("src", dados["url_src"]);
        cancelar_foto();
        TEM_FOTO = true;
        $("#id_remove_foto").show();
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: esconderCarregando
  });
};

var iniciar_componente_recorte = function(url_imagem) {
  $("#foto_colab_recorte").attr("src", url_imagem);
  $("#url_foto").val(url_imagem);
  $image = $(".cropper");
  $image.cropper({
    aspectRatio: RECORTE_RATIO,
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
      data_foto = $.extend($image.cropper("getImageData"), {
        'url_foto': $("#url_foto").val(),
        'data': $image.cropper("getDataURL", "image/jpeg") // foto recortada
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
  $('#file_foto').fileupload({
    url: URL_RECORTE_FOTO,
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

var iniciar_componente_webcam = function() {
  $('#id_shot_foto').click(function() {
    WebcamScreenshot.go({
      width: SHOT_FOTO_WIDTH,
      postImageFormat: 'jpg',
      postTo: URL_RECORTE_FOTO,
      dialogFramework: 'bs3',
      takeText: TXT_TIRAR_FOTO,
      cancelText: TXT_CANCELAR,
      dialogTitle: TXT_TIRAR_FOTO_WC
    }, function(code, result) {
      if (result == 'DevicesNotFoundError') {
        $.dialogs.error(TXT_WEBCAM_N_INSTALADA);
        esconderCarregando();
        return;
      } else if (code === WebcamScreenshot.RC.OK) {
        if (result["status"] == "ok") {
          $("#div_recorte").html(result["html_modal"]);
          $("#div_recorte").show();
          $(".hide_on_recorte").hide();
          iniciar_componente_recorte(result["url_imagem"]);
          esconderCarregando();
        } else {
          $.dialogs.error(result["msg"]);
        }
      } else {
        if (code == WebcamScreenshot.RC.UNSUPPORTED_BROWSER) {
          $.dialogs.error(TXT_WEBCAM_ACESSO_NAV_ERRO);
          esconderCarregando();
          return;
        }
        if (code == WebcamScreenshot.RC.CANT_ACCESS_WEBCAM) {
          $.dialogs.error(TXT_WEBCAM_ACESSO_ERRO);
          esconderCarregando();
          return;
        }
      }
    });
  });
};


$(function() {
  $('.img_del_foto').click(deletar_foto);
  $("#id_add_foto, #img_foto, #id_foto").click(function() {
    $("#file_foto").click();
  });
  iniciar_componente_upload();
  iniciar_componente_webcam();
  if (!TEM_FOTO) {
    $("#id_remove_foto").hide();
  }
});
