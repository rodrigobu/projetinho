var data_fotobook;
var NUM_FOTO_ATUAL = '0';
var MODULO_FOTOBOOK = true;

var cancelar_fotobook = function() {
  $("#div_recorte").html("");
  $("#div_recorte").hide();
  $(".hide_on_recorte").show();
};

var configurar_fotobook = function(indice) {
  // Configuração dos uploads do Fotobook
  // Botão de Upload simples
  $("#id_add_foto_" + indice).click(function(e) {
    e.preventDefault();
    upload_fotobook(indice);
  });
  // Upload simples
  $('#file_fotobook_' + indice).fileupload(
    config_upload_fotobook(indice)
  );
  // Tirando foto pela webcam
  $('#id_shot_foto_' + indice).click(function(e) {
    e.preventDefault();
    webcam_fotobook(indice)
  });
};

var upload_fotobook = function(indice) {
  // Inicia o upload
  NUM_FOTO_ATUAL = indice;
  $("#file_fotobook_" + indice).click();
};

var iniciar_componente_recorte_fotobook = function(url_imagem) {
  $("#foto_colab_recorte").attr("src", url_imagem);
  $("#id_url_fotobook_" + NUM_FOTO_ATUAL).val(url_imagem);
  $image = $(".cropper");
  $image.cropper({
    aspectRatio: 1,
    data: {
      x: 1,
      y: 1,
      width: 201,
      height: 201
    },
    preview: ".preview",
    // 3x4
    minWidth: 201,
    minHeight: 201,
    resizable: true,
    zoomable: true,
    done: function() {
      foto_recortada = $image.cropper("getDataURL", "image/jpeg"); // foto recortada
      if (foto_recortada == "data:,") {
        foto_recortada = $image.cropper("getDataURL", "image/png");
      }
      data_fotobook = $.extend($image.cropper("getImageData"), {
        'num_foto': NUM_FOTO_ATUAL,
        'url_foto': $("#id_url_fotobook_" + NUM_FOTO_ATUAL).val(),
        'data': foto_recortada
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

var salvar_fotobook = function() {
  // Salvamento
  mostrarCarregando();
  $.ajax({
    url: URL_SALVAR_FOTOBOOK,
    type: 'post',
    dataType: 'json',
    data: data_fotobook,
    success: function(dados) {
      if (dados["status"] == "ok") {
        $("#id_url_fotobook_" + NUM_FOTO_ATUAL).val(dados["url_fotobook"]);
        $("#id_static_url_fotobook_" + NUM_FOTO_ATUAL).val(dados["url_src"]);
        $("#id_binary_fotobook_" + NUM_FOTO_ATUAL).val(dados["binary_fotobook"]);
        $("#id_name_fotobook_" + NUM_FOTO_ATUAL).val(dados["name_fotobook"]);
        $("#img_fotobook_" + NUM_FOTO_ATUAL).attr("src", dados["url_src"]);
        cancelar_fotobook();
        //$("#id_remove_fotobook_"+indice).show();
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: esconderCarregando
  });
};

var config_upload_fotobook = function(indice) {
  // Retorna a configuração do upload da imagem
  return {
    url: URL_RECORTE_FOTOBOOK,
    dataType: 'json',
    send: function(e, data) {
      mostrarCarregando();
    },
    done: function(e, data) {
      esconderCarregando();
      resposta = data._response.result;
      if (resposta["status"] == "ok") {
        $("#div_recorte").html(resposta["html_modal"]);
        $("#div_recorte").show();
        $(".hide_on_recorte").hide();
        iniciar_componente_recorte_fotobook(resposta["url_imagem"]);
      } else {
        $.dialogs.error(resposta["msg"]);
      }
    }
  }
};

var webcam_fotobook = function(indice) {
  NUM_FOTO_ATUAL = indice;
  WebcamScreenshot.go({
      width: 520,
      postImageFormat: 'jpg',
      postTo: URL_RECORTE_FOTOBOOK,
      dialogFramework: 'bs3',
      takeText: TXT_TIRAR_FOTO,
      cancelText: TXT_CANCELAR,
      dialogTitle: TXT_TIRAR_FOTO_WC
    },
    function(code, result) {
      esconderCarregando();
      console.log(code);
      console.log(result);
      do_webcam_callback(code, result, indice);
    }
  );
}

var do_webcam_callback = function(code, result, index) {
  if (result == 'DevicesNotFoundError') {
    $.dialogs.error(TXT_WEBCAM_N_INSTALADA);
    esconderCarregando();
    return;
  } else if (code === WebcamScreenshot.RC.OK) {
    console.log(result);
    if (result["status"] == "ok") {
      $("#div_recorte").html(result["html_modal"]);
      $("#div_recorte").show();
      $(".hide_on_recorte").hide();
      iniciar_componente_recorte_fotobook(result["url_imagem"]);
      esconderCarregando();
    } else {
      $.dialogs.error(result["msg"]);
    }
  } else {
    if (code == WebcamScreenshot.RC.UNSUPPORTED_BROWSER) {
      $.dialogs.error(TXT_WEBCAM_ACESSO_NAV_ERRO);
      esconderCarregando();
      return;
      return;
    }
    if (code == WebcamScreenshot.RC.CANT_ACCESS_WEBCAM) {
      $.dialogs.error(TXT_WEBCAM_ACESSO_ERRO);
      esconderCarregando();
      return;
    }
  }
  esconderCarregando();
};

var ativar_fotos = function() {
  // Somente aparece as fotos quando aceita o temro de uso de imagem
  if ($('#id_aceita_termos_usoimagem').is(':checked')) {
    $('#div_fotobooks').show();
  } else {
    /*$.dialogs.confirm(TXT_CONFIRMAR_REMOVER_ACEITE, function(){*/
    $('#div_fotobooks').hide();
    /*}, function(){
       $('#id_aceita_termos_usoimagem').click();
    });*/
  }
};

$(function() {

  $('#id_aceita_termos_usoimagem').change(ativar_fotos);

  $.each(FOTOS, function(idx, value){
    configurar_fotobook(value);
  });

});
