function form_encerrar_contrato(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_ENCERRA, function() {
    $.ajax({
      url: URL_FORM_ENCERRA,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro
      },
      success: function(dados) {
        $("#datatable_colaboradores").hide();
        $("#detalhes_colaboradores").html(dados["html"]).show();
        make_datepicker('#id_dt_demissao');
        $("#id_btn_voltar").click(voltar_form_encerrar_contrato);
      }
    });
  });
}

function voltar_form_encerrar_contrato() {
  $("#datatable_colaboradores").show();
  $("#detalhes_colaboradores").hide().html("");
}

var salvar_encerrar_contrato = function() {
  disable_btn("form_encerrar_contrato");
  if (!$('#form_encerrar_contrato').parsley().validate()) {
    enable_btn("form_encerrar_contrato");
    return false;
  }
  var form = serializaForm('#form_encerrar_contrato');
  $.post(URL_SALVAR_ENCERRA, form)
    .done(function(data) {
      if (data['status'] == 'ok') {
        $.dialogs.success(data['msg'], function() {
          $.dialogs.confirm("Restrição", "Deseja adicionar uma restrição para o colaborador?", function() {
            form_restricao(data['cand_slug']);
          });
        });
        consultar();
        voltar_form_encerrar_contrato();

      } else {
        $.dialogs.error(data['msg']);
      }
    }).complete(function(data) {
      enable_btn("form_encerrar_contrato");
    });
};
