
function form_restricao(slug_registro){
    $.ajax({
      url : URL_FORM_RESTRICAO,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { codigo : slug_registro },
      success : function(dados) {
        $("#datatable_proc_sel").hide();
        $("#detalhes_proc_sel").html(dados["html"]).show();
        make_datepicker('#id_data_restricao');
        $("#id_btn_voltar").click(voltar_form_restricao);
      }
    });
}

function voltar_form_restricao(){
    $("#datatable_proc_sel").show();
    $("#detalhes_proc_sel").hide().html("");
}

var salvar_restricao = function() {
    disable_btn("form_restricao");
    if (!$('#form_restricao').parsley().validate()) {
        enable_btn("form_restricao");
        return false;
    }
    var form = serializaForm('#form_restricao');
    $.post(URL_SALVAR_RESTRICAO, form)
        .done(function(data) {
            if(data['status'] == 'ok'){
              $.dialogs.success(data['msg']);
              consultar();
              voltar_form_restricao();
            } else {
              $.dialogs.error(data['msg']);
            }
        }).complete(function(data) {
            enable_btn("form_restricao");
        });
};
