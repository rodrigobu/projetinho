var abrir_detalhes_candidato = function(id_cand, ja_aberta) {
  //-- Abre a dialog dos detalhes do candidato
  if (ja_aberta) {
    jQuery('#id_dialog_detalhes_candidato').modal('hide');
  }
  $.ajax({
    url: URL_DETALHES_CANDIDATO,
    type: 'post',
    dataType: 'json',
    data: {
      'codigo': id_cand
    },
    success: function(data) {
      //-- colocar o html
      $("#detalhes_candidato_modal_body").html(data["html"]);
      //-- recolher paineis necessários
      $(".painel_exps_collapse").click();
      //-- vistar candidato
      $("#visto_" + id_cand).removeClass('hidden');

      //-- processo do proximo
      var div_proximo = $("#id_candidato_" + id_cand).next('.conteiner_candidato');
      if (div_proximo) {
        if (div_proximo.length == 0) {
          $('#link_proximo').hide();
        } else {
          var id_proximo = div_proximo.attr('id').replace('id_candidato_', '');
          var slug_proximo = div_proximo.attr("data-slug");
          $('#link_proximo').click(function() {
            abrir_detalhes_candidato(slug_proximo, id_proximo, true)
          });
        }
      }
      //-- processo do anterior
      var div_anterior = $("#id_candidato_" + id_cand).prev('.conteiner_candidato');
      if (div_anterior) {
        if (div_anterior.length == 0) {
          $('#link_anterior').hide();
        } else {
          var id_anterior = div_anterior.attr('id').replace('id_candidato_', '');
          var slug_anterior = div_anterior.attr("data-slug");
          $('#link_anterior').click(function() {
            abrir_detalhes_candidato(slug_anterior, id_anterior, true)
          });
        }
      }

      $(".remover_funcao_bne").click(function(){
          var botao = $(this);
          $.dialogs.confirm(TXT_CONFIRMACAO, TXT_CONFIRM_FUNCAO, function(){
            botao.parent().remove()
          });
      })

      // -- abrir popup
      jQuery('#id_dialog_detalhes_candidato').modal('show', {
        backdrop: 'fade'
      });

    }
  });

}

var abrir_importacao = function() {
  $("#div_detalhes_cand_bne").hide();
  $("#div_importacao_bne").show();
}

var cancelar_importacao = function() {
  $("#div_detalhes_cand_bne").show();
  $("#div_importacao_bne").hide();
}

var salvar_importacao = function(){
  disable_btn("form_importar_cand");
  if (!$('#form_importar_cand').parsley().validate()) {
    enable_btn("form_importar_cand");
    return false;
  }

  dados = serializaForm($('#form_importar_cand'));
  dados['codigo'] = $("#id_det_candidato_id").val();

  jQuery('#id_dialog_detalhes_candidato').modal('hide');
  $.ajax({
    url: URL_IMPORTAR,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {

        if(data['status']=='ok'){
            $("#div_importacao_bne, #bt_import_cand").remove();
            $("#div_detalhes_cand_bne").show();
            $("#alerta_sucess_import").show();
            $("#alerta_sucess_import_msg").html(data['msg']);
            $("#alerta_danger_import").hide();
        } else {
            $("#alerta_danger_import").show();
            $("#alerta_danger_import_msg").html(data['msg']);
            $("#alerta_sucess_import").hide();
        }

    },
    complete: function(){
      enable_btn("form_importar_cand");
      jQuery('#id_dialog_detalhes_candidato').modal('show', {
        backdrop: 'fade'
      });

    }
  });

}
