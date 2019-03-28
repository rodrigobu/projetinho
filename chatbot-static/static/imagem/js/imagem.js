var $image, data_imagem, cropper;

var deletar_imagem = function() {
  $.dialogs.confirm(TXT_CONFIRM_EXCLUIR_IMAGEM, function() {
    mostrarCarregando();
    $.ajax({
      url: URL_REMOVER_IMAGEM,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {},
      success: function(dados) {
        if (dados["status"] == 'ok') {
          $("#id_imagem").attr("src", dados["msg"]);
          TEM_IMAGEM = false;
          $("#id_remove_imagem").hide();
        } else {
          $.dialogs.error(dados["msg"]);
        }
      },
      complete: esconderCarregando
    });
  });
};

var cancelar_imagem = function() {
  $("#div_recorte").html("");
  $("#div_recorte").hide();
  $(".hide_on_recorte").show();
};

var salvar_imagem = function() {
  // Salvamento
  mostrarCarregando();
  $.ajax({
    url: URL_SALVAR_IMAGEM,
    type: 'post',
    dataType: 'json',
    data: data_imagem,
    success: function(dados) {
      if (dados["status"] == "ok") {
        $("#url_imagem").val(dados["url_imagem"]);
        $("#id_static_url_imagem").val(dados["url_src"]);
        $("#id_binary_imagem").val(dados["binary_imagem"]);
        $("#id_name_imagem").val(dados["name_imagem"]);
        $("#id_imagem").attr("src", dados["url_src"]);
        cancelar_imagem();
        TEM_IMAGEM = true;
        $("#id_remove_imagem").show();
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: esconderCarregando
  });
};

var iniciar_componente_recorte = function(url_imagem) {
  $("#imagem_vaga_recorte").attr("src", url_imagem);
  $("#url_imagem").val(url_imagem);
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
      data_imagem = $.extend($image.cropper("getImageData"), {
        'url_imagem': $("#url_imagem").val(),
        'data': $image.cropper("getDataURL", "image/jpeg") // imagem recortada
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
  $('#file_imagem').fileupload({
    url: URL_RECORTE_IMAGEM,
    dataType: 'json',
    done: function(e, data) {
      resposta = data._response.result;
      if (resposta["status"] == "ok") {
        $("#div_recorte").html(resposta["html_modal"]);
        $("#div_recorte").show();
        $(".hide_on_recorte").hide();
        iniciar_componente_recorte(resposta["url_imagem"]);
      } else {
        $.dialogs.error(resposta["status"])
      }
    }
  });
};

$(function() {
  $('.img_del_imagem').click(deletar_imagem);
  $("#id_add_imagem, #img_imagem, #id_imagem").click(function() {
    $("#file_imagem").click();
  });
  iniciar_componente_upload();
  if (!TEM_IMAGEM) {
    $("#id_remove_imagem").hide();
  }
});
