var upload_doc = function() {
  $("#id_documento").click();
}

var montar_arquivo = function(file_name, tmp_file) {
  $('#help_block_documento').html('<span class="text-success">' + file_name + "</span>");
  $('#id_tmp_file_doc').val(tmp_file);
  $('#id_name_file_doc').val(file_name);
  if (DOC_OBG) {
    $("#id_documento").removeAttr('required');
  }
}

var iniciar_doc = function() {

  if ($("#id_tmp_file_doc").val() != '') {
    montar_arquivo(
      $("#id_name_file_doc").val(),
      $("#id_tmp_file_doc").val()
    );
  }

  $('#id_documento').fileupload({
    url: URL_VALIDA_DOC,
    dataType: 'json',
    done: function(e, data) {

      if (data.result['status'] == 'ok') {
        montar_arquivo(data.result['file_name'], data.result['tmp_file']);
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

var excluir_doc = function(cli_ocorrencia_slug) {
  if (DOC_OBG == "False") {
    $.dialogs.confirm(TXT_CONFIRMAR_EXCLUSAO_DOC,
      function() {
        $.ajax({
          url: URL_EXCLUI_DOC,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            id: cli_ocorrencia_slug
          },
          success: function(dados) {
            if (dados["status"] == 'nok') {
              $.dialogs.error(dados["msg"]);
            } else {
              $.dialogs.success(dados["msg"]);
              $(".hide_on_exc_anexo").hide();
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
