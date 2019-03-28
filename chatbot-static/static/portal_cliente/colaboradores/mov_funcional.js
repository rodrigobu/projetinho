function form_mov_funcional(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_MOV_FUNC, function() {
    $.ajax({
      url: URL_FORM_MOV_FUNC,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro
      },
      success: function(dados) {
        $("#datatable_colaboradores").hide();
        $("#detalhes_colaboradores").html(dados["html"]).show();
        make_datepicker('#id_dt_admissao');
        $("#id_btn_voltar").click(voltar_form_mov_funcional);
      }
    });
  });
}

function voltar_form_mov_funcional() {
  $("#datatable_colaboradores").show();
  $("#detalhes_colaboradores").hide().html("");
}

var salvar_mov_funcional = function() {
  disable_btn("form_mov_funcional");
  if (!$('#form_mov_funcional').parsley().validate()) {
    enable_btn("form_mov_funcional");
    return false;
  }
  var form = serializaForm('#form_mov_funcional');
  $.post(URL_SALVAR_MOV_FUNC, form)
    .done(function(data) {
      if (data['status'] == 'ok') {
        $.dialogs.success(data['msg']);
        consultar();
        voltar_form_mov_funcional();
      } else {
        $.dialogs.error(data['msg']);
      }
    }).complete(function(data) {
      enable_btn("form_mov_funcional");
    });
};
