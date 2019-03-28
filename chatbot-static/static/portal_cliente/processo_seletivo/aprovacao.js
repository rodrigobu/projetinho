function form_aprovacao(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_APROVACAO, function() {
    $.ajax({
      url: URL_FORM_APROVACAO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro
      },
      success: function(dados) {
        $("#datatable_proc_sel").hide();
        $("#detalhes_proc_sel").html(dados["html"]).show();
        make_datepicker('#id_data_inicio');
        make_datepicker('#id_inativo_ate');
        $("#id_btn_voltar").click(voltar_detalhes);
      }
    });
  });
}

var salvar_aprovacao = function() {
  disable_btn("form_aprovacao");
  if (!$('#form_aprovacao').parsley().validate()) {
    enable_btn("form_aprovacao");
    return false;
  }
  var form = serializaForm('#form_aprovacao');
  $.post(URL_SALVAR_APROVACAO, form)
    .done(function(data) {
      if (data['status'] == 'ok') {
        $.dialogs.success(data['msg']);
        consultar();
        voltar_detalhes();
        consultar_status()
      } else {
        $.dialogs.error(data['msg']);
      }
    }).complete(function(data) {
      enable_btn("form_aprovacao");
    });
};

function salvar_desaprovacao(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_DESAPROVACAO, function() {
    $.ajax({
      url: URL_SALVAR_DESAPROVACAO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro
      },
      success: function(data) {
        if (data['status'] == 'ok') {
          $.dialogs.success(data['msg']);
          consultar();
          consultar_status();
        } else {
          $.dialogs.error(data['msg']);
        }
      }
    });
  });
}


function encaminhar(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_ENCAMINHAR, function() {
    $.ajax({
      url: URL_SALVAR_ENCAMINHAMENTO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro,
        encaminhado: 'true'
      },
      success: function(data) {
        if (data['status'] == 'ok') {
          $.dialogs.success(data['msg']);
          consultar();
          consultar_status();
        } else {
          $.dialogs.error(data['msg']);
        }
      }
    });
  });
}

function desencaminhar(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_DESENCAMINHAR, function() {
    $.ajax({
      url: URL_SALVAR_ENCAMINHAMENTO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro,
        encaminhado: 'false'
      },
      success: function(data) {
        if (data['status']  == 'ok') {
          $.dialogs.success(data['msg']);
          consultar();
          consultar_status();
        } else {
          $.dialogs.error(data['msg']);
        }
      }
    });
  });
}


function fechar_vaga() {
  $.dialogs.confirm('', TXT_CONFIRM_FECHAR_VAGA, function() {
    $.ajax({
      url: URL_FECHAR_VAGA,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {},
      success: function(data) {
        if (data['status']  == 'ok') {
          $.dialogs.success(data['msg']);
            window.location.href = URL_LISTAGEM_PROC_SEL;
        } else {
          $.dialogs.error(data['msg']);
        }
      }
    });
  });
}


function consultar_status(){
  $.ajax({
    url: URL_CONSULTAR_STATUS,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {},
    success: function(data) {
      $("#id_qtd_fechada").html(data['qtd_fechada']);
      $("#id_qtd_solicitada").html(data['qtd_solicitada']);
      if (data['para_fechar']) {
        fechar_vaga();
      }
    }
  });
}
