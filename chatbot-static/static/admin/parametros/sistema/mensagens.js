var aplica_mensagem_config = function(id_field) {

  $('#id_' + id_field).on('change', function() {
    if ($(this).is(":checked")) {
      $("#div_" + id_field + "").show();
    } else {
      $("#div_" + id_field + "").hide();
    }
  });
  $('#id_' + id_field).change();

};

var validar_mensagem_config = function(id_field, extra) {
  if ($('#id_' + id_field).is(":checked")) {
    if ($('#id_' + id_field + "_msg").val() == '') {
      $.dialogs.error(TXT_VAL_FEEDBACKS);
      $('#id_' + id_field).focus();
      return false;
    } else if (extra != undefined) {
      if (extra()) {
        $.dialogs.error(TXT_VAL_FEEDBACKS);
        $('#id_' + id_field).focus();
        return false;
      }
    }
  }
  return true;
};


var validacaoFormMensagens = function() {

  for(var i in CKEDITOR.instances) {
    CKEDITOR.instances[i].updateElement();
  };

  if (!validar_mensagem_config('feeback_respselecao_candidatura')) {
    return false;
  } else if (!validar_mensagem_config('feedback_01')) {
    return false;
  } else if (!validar_mensagem_config('feedback_10')) {
    return false;
  } else if (!validar_mensagem_config('feedback_02')) {
    return false;
  } else if (!validar_mensagem_config('feedback_03')) {
    return false;
  } else if (!validar_mensagem_config('feedback_04')) {
    return false;
  } else if (!validar_mensagem_config('feedback_06')) {
    return false;
  } else if (!validar_mensagem_config('feedback_07')) {
    return false;
  } else if (!validar_mensagem_config('feedback_08', function() {
      return $('#id_feedback_08_assunto').val() == ''
    })) {
    return false;
  } else if (USA_TESTE && !validar_mensagem_config('feedback_09', function() {
      return $('#id_feedback_09_assunto').val() == ''
    })) {
    return false;
  } else{
    return true;
  }

}


$(function() {

  CKEDITOR.config.width = 'auto';
  CKEDITOR.config.height = 'auto';
  CKEDITOR.config.resize_dir = 'vertical';
  CKEDITOR.config.removePlugins = "elementspath"; // Remove o caminho que ele coloca no rodapé

  //-------------------- CKeditors Padrão ---------------------------------
  CKEDITOR.config.extraPlugins = 'cand_vaga_esp';
  tool = [{
      name: 'edit',
      items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', '/']
    },
    {
      name: 'component',
      items: ['Table', 'HorizontalRule', 'SpecialChar', '/']
    },
    {
      name: 'others',
      items: ['Maximize', '-', 'Source']
    },
    {
      name: 'styles',
      items: ['Bold', 'Italic', 'Strike', 'Underscore', 'RemoveFormat']
    }, '/',
    {
      name: 'indent',
      items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]
    },
    {
      name: 'cand_vaga_auto',
      items: ['/', "CampoEspecialPadrao"]
    },
    {
      name: 'styles2',
      items: ['Styles', 'Format']
    }
  ];
  // CONFIGURAÇÃO DO CKEDITOR DOS FEEDBACKS
  CKEDITOR.replace('feedback_01_msg', {
    extraPlugins: 'cand_vaga_esp',
    toolbar: tool
  });
  CKEDITOR.replace('feedback_02_msg', {
    extraPlugins: 'cand_vaga_esp',
    toolbar: tool
  });
  CKEDITOR.replace('feedback_03_msg', {
    extraPlugins: 'cand_vaga_esp',
    toolbar: tool
  });
  CKEDITOR.replace('feedback_04_msg', {
    extraPlugins: 'cand_vaga_esp',
    toolbar: tool
  });
  CKEDITOR.replace('feedback_06_msg', {
    extraPlugins: 'cand_vaga_esp',
    toolbar: tool
  });
  CKEDITOR.replace('feedback_07_msg', {
    extraPlugins: 'cand_vaga_esp',
    toolbar: tool
  });
  CKEDITOR.replace('feedback_10_msg', {
    extraPlugins: 'cand_vaga_esp',
    toolbar: tool
  });

  CKEDITOR.config.extraPlugins = 'cand_vaga_resp_feedback';
  CKEDITOR.replace('feeback_respselecao_candidatura_msg', {
    extraPlugins: 'cand_vaga_resp_feedback',
    toolbar: tool
  });

  //-------------------- CKeditor Divulgação auto ---------------------------------
  CKEDITOR.config.extraPlugins = 'cand_vaga_auto';
  tool2 = [{
      name: 'edit',
      items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', '/']
    },
    {
      name: 'component',
      items: ['Table', 'HorizontalRule', 'SpecialChar', '/']
    },
    {
      name: 'others',
      items: ['Maximize', '-', 'Source']
    },
    {
      name: 'styles',
      items: ['Bold', 'Italic', 'Strike', 'Underscore', 'RemoveFormat']
    }, '/',
    {
      name: 'indent',
      items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]
    },
    {
      name: 'cand_vaga_auto',
      items: ['/', "CampoEspecialAuto"]
    },
    {
      name: 'styles2',
      items: ['Styles', 'Format']
    }
  ];
  CKEDITOR.replace('feedback_08_msg', {
    extraPlugins: 'cand_vaga_auto',
    toolbar: tool2
  });

  if (USA_TESTE) {
    //-------------------- CKeditors Testes da vaga ---------------------------------
    CKEDITOR.config.extraPlugins = 'cand_vaga_teste';
    tool3 = [{
        name: 'edit',
        items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo', '/']
      },
      {
        name: 'component',
        items: ['Table', 'HorizontalRule', 'SpecialChar', '/']
      },
      {
        name: 'others',
        items: ['Maximize', '-', 'Source']
      },
      {
        name: 'styles',
        items: ['Bold', 'Italic', 'Strike', 'Underscore', 'RemoveFormat']
      }, '/',
      {
        name: 'indent',
        items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', ]
      },
      {
        name: 'cand_vaga_auto',
        items: ['/', "CampoEspecialTeste"]
      },
      {
        name: 'styles2',
        items: ['Styles', 'Format']
      }
    ];
    CKEDITOR.replace('feedback_09_msg', {
      extraPlugins: 'cand_vaga_teste',
      toolbar: tool3
    });
  }
  for(var i in CKEDITOR.instances) {
		CKEDITOR.instances[i].on('blur', function (event){
		    this.updateElement();
	    });
	}

  aplica_mensagem_config('feeback_respselecao_candidatura');
  aplica_mensagem_config('feedback_01');
  aplica_mensagem_config('feedback_10');
  aplica_mensagem_config('feedback_02');
  aplica_mensagem_config('feedback_03');
  aplica_mensagem_config('feedback_04');
  aplica_mensagem_config('feedback_06');
  aplica_mensagem_config('feedback_07');
  aplica_mensagem_config('feedback_08');
  if (USA_TESTE) {
      aplica_mensagem_config('feedback_09');
  }


  $("#button-id-bt_salvar_mensagens").click(function(e){
    if(validacaoFormMensagens()){
        $("#form_mensagens").submit();
    }
  });


});
