
function form_abertura_vaga(slug_registro){
    $.ajax({
      url : URL_FORM_ABRIR_VAGA,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { codigo : slug_registro },
      success : function(dados) {
        $("#datatable_vagas_padroes").hide();
        $("#detalhes_vagas_padroes").html(dados["html"]).show();
        make_calcula_salario();
        $("#id_btn_voltar").click(voltar_form_abertura_vaga);
      }
    });
}

function voltar_form_abertura_vaga(){
    $("#datatable_vagas_padroes").show();
    $("#detalhes_vagas_padroes").hide().html("");
}

var salvar_abertura_vaga = function() {
    disable_btn("form_abertura_vaga");
    if (!$('#form_abertura_vaga').parsley().validate()) {
        enable_btn("form_abertura_vaga");
        return false;
    }
    var form = serializaForm('#form_abertura_vaga');
    $.post(URL_SALVAR_ABRIR_VAGA, form)
        .done(function(data) {
            if(data['status'] == 'ok'){
              $.dialogs.success(data['msg']);
              consultar();
              voltar_form_abertura_vaga();
            } else {
              $.dialogs.error(data['msg']);
            }
        }).complete(function(data) {
            enable_btn("form_abertura_vaga");
        });
};
