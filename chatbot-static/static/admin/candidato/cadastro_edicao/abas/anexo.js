var upload_doc = function(){
  $("#id_documento").click();
}

var iniciar_doc = function() {
  $('#id_documento').fileupload({
    url: URL_VALIDA_DOC,
    dataType: 'json',
    done: function(e, data) {

      if (data.result['status'] == 'ok') {
        $('#help_block_documento').html('<span class="text-success">' + data.result['file_name'] + "</span>");
        $('#id_tmp_file_doc').val(data.result['tmp_file']);
        $('#id_name_file_doc').val(data.result['file_name']);
        if (DOC_OBG) {
          $("#id_documento").removeAttr('required');
        }
      } else {
        $('#help_block_documento').html('<span class="text-danger">' + data.result['tmp_file'] + "</span>");
        $('#id_tmp_file_doc').val('');
        $('#id_name_file_doc').val('');
        if (DOC_OBG && !TEM_DOC) {
          $("#id_documento").attr('required', true);
        }
        //$("#div_control_cv").hide();
      }
    }
  });
}

var excluir_doc = function(candidato_slug) {
  if (!DOC_OBG) {
    $.dialogs.confirm(TXT_CONFIRMAR_EXCLUSAO_DOC,
      function() {
        $.ajax({
          url: URL_EXCLUI_DOC + candidato_slug,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {},
          success: function(dados) {
            if (dados["status"] == 'nok') {
              $.dialogs.error(dados["msg"]);
            } else {
              $.dialogs.success(dados["msg"]);
              $("#div_control_doc").hide();
              if (DOC_OBG) {
                $("#id_doc").removeAttr('required');
              }
              TEM_DOC = false;
            }
          },
        });
      })
  }
}

$(function() {
    iniciar_doc();
    $("#id_documento, [for='documento']").hide();
});
