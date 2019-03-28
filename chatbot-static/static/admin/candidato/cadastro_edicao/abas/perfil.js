var upload_cv = function() {
  $("#id_cv").click();
}

var colocar_aviso_cv = function(file_name, tmp_file) {
  $('#help_block_cv').html('<span class="text-success">' + file_name + "</span>");
  $('#id_tmp_file_cv').val(tmp_file);
  $('#id_name_file_cv').val(file_name);
  if (CV_OBG) {
    $("#id_cv").removeAttr('required');
  }
}

var iniciar_cv = function() {

  if (FILE_CV_NAME) {
    colocar_aviso_cv(FILE_CV_NAME, FILE_CV_PATH);
  }

  $('#id_cv').fileupload({
    url: URL_VALIDA_CV,
    dataType: 'json',
    done: function(e, data) {
      if (data.result['status'] == 'ok') {
        colocar_aviso_cv(data.result['file_name'], data.result['tmp_file']);
      } else {
        $('#help_block_cv').html('<span class="text-danger">' + data.result['tmp_file'] + "</span>");
        $('#id_tmp_file_cv').val('');
        $('#id_name_file_cv').val('');
        if (CV_OBG && !TEM_CV) {
          $("#id_cv").attr('required', true);
        }
        //$("#div_control_cv").hide();
      }
    }
  });
}

var excluir_cv = function(candidato_slug) {
  if (!CV_OBG) {
    $.dialogs.confirm(TXT_CONFIRMAR_EXCLUSAO_CV,
      function() {
        $.ajax({
          url: URL_EXCLUI_CV + candidato_slug,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {},
          success: function(dados) {
            if (dados["status"] == 'nok') {
              $.dialogs.error(dados["msg"]);
            } else {
              $.dialogs.success(dados["msg"]);
              $("#div_control_cv").hide();
              if (CV_OBG) {
                $("#id_cv").removeAttr('required');
              }
              TEM_CV = false;
            }
          },
        });
      })
  }
}

var upload_imgcv = function() {
  $("#id_imgcv").click();
}

var colocar_aviso_imgcv = function(file_name, tmp_file) {
  $('#help_block_imgcv').html('<span class="text-success">' + file_name + "</span>");
  $('#id_tmp_file_imgcv').val(tmp_file);
  $('#id_name_file_imgcv').val(file_name);
  if (IMGCV_OBG) {
    $("#id_imgcv").removeAttr('required');
  }
}

var iniciar_imgcv = function() {

  if (FILE_IMGCV_NAME) {
    colocar_aviso_imgcv(FILE_IMGCV_NAME, FILE_IMGCV_PATH);
  }

  $('#id_imgcv').fileupload({
    url: URL_VALIDA_IMGCV,
    dataType: 'json',
    done: function(e, data) {
      if (data.result['status'] == 'ok') {
        colocar_aviso_imgcv(data.result['file_name'], data.result['tmp_file']);
      } else {
        $('#help_block_imgcv').html('<span class="text-danger">' + data.result['tmp_file'] + "</span>");
        $('#id_tmp_file_imgcv').val('');
        $('#id_name_file_imgcv').val('');
        if (IMGCV_OBG && !TEM_IMGCV) {
          $("#id_imgcv").attr('required', true);
        }
        //$("#div_control_imgcv").hide();
      }
    }
  });
}

var excluir_imgcv = function(candidato_slug) {
  if (!IMGCV_OBG) {
    $.dialogs.confirm(TXT_CONFIRMAR_EXCLUSAO_IMGCV,
      function() {
        $.ajax({
          url: URL_EXCLUI_IMGCV + candidato_slug,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {},
          success: function(dados) {
            if (dados["status"] == 'nok') {
              $.dialogs.error(dados["msg"]);
            } else {
              $.dialogs.success(dados["msg"]);
              $("#div_control_imgcv").hide();
              if (IMGCV_OBG) {
                $("#id_imgcv").removeAttr('required');
              }
              TEM_IMGCV = false;
            }
          },
        });
      })
  }
}

var trocar_idade = function() {
	if (!$('#id_dt_nasc').val())
		return;
	mostrarCarregando("Calculando idade");
	$.ajax({
		async : false,
		url : URL_GERAR_IDADE,
		data : {
			dt_nasc : $('#id_dt_nasc').val()
		},
		type : 'get',
		cache : false,
		success : function(retorno) {
			if (retorno["status"] == 'ok') {
				if ($('#id_idade').val() == retorno["idade"])
					return;
				$('#id_idade').val(retorno["idade"]);
			} else {
				jError(retorno["msg"], config_jnotify);
				$('#id_dt_nasc').val("");
			}
		},
	});
};

var trocar_dt_nasc = function() {
	if (!$('#id_idade').val())
		return;
	mostrarCarregando("Calculando Data de Nascimento");
	$.ajax({
		async : false,
		url : URL_GERAR_DTNASC,
		data : {
			idade : $('#id_idade').val()
		},
		type : 'get',
		cache : false,
		success : function(retorno) {
			if (retorno["status"] == 'ok') {
				if ($('#id_dt_nasc').val() != '') {
					var ano = $("#id_dt_nasc").val().split("/")[2];
					if (ano == retorno["dt_nasc"].split("/")[2])
						return;
				}
				$('#id_dt_nasc').val(retorno["dt_nasc"]);
			} else {
				jError(retorno["msg"], config_jnotify);
				$('#id_idade').val("");
			}
		},
	});
};



$(function() {
  set_pesquisa_endereco('#id_cep', '#id_endereco', '#id_bairro', '#id_cidade', '#id_estado');
  set_cidades_do_estado('#id_estado', '#id_cidade');
  $('#id_estado').change();
  $("#id_cidade").val(CIDADE);
  if(READONLY=='True'){
    $("#id_cidade").attr('readonly', 'readonly');
  }

  $("#id_cv, [for='cv']").hide();
  iniciar_cv();

  $("#id_imgcv, [for='imgcv']").hide();
  iniciar_imgcv();

  $('#id_dt_nasc').on("blur", trocar_idade);
  $('#id_idade').on("blur", trocar_dt_nasc);
});
