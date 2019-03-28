
var abrir_detalhes_candidato = function(slug_cand, id_cand, ja_aberta) {
  //-- Abre a dialog dos detalhes do candidato
  $("#detalhes_candidato_modal_body").html("Carregando dados...");
  $.ajax({
    url: URL_DETALHES_CANDIDATO,
    type: 'post',
    dataType: 'json',
    data: {
      'codigo' : slug_cand,
      'vaga': $("#id_vaga").val(),
      'perfil': SLUG_SELECAO,
    },
    success: function(data) {
      //-- colocar o html
      $("#detalhes_candidato_modal_body").html(data["html"]);
      //-- recolher paineis necessários
      $(".painel_exps_collapse").click();
      //-- vistar candidato
      $("#visto_"+id_cand).removeClass('hidden');
      //-- processo de alteração de conceito
      $("#id_conceito_candidato_detalhes").change(function(){
        alterar_conceito_candidato(slug_cand, id_cand);
      });

      //-- processo do proximo
      var div_proximo = $("#id_candidato_"+id_cand).next('.conteiner_candidato');
      if( div_proximo ){
        if ( div_proximo.length == 0 ){
          $('#link_proximo').hide();
        } else{
            var id_proximo = div_proximo.attr('id').replace('id_candidato_', '');
            var slug_proximo = div_proximo.attr("data-slug");
            $('#link_proximo').click(function(){
                abrir_detalhes_candidato(slug_proximo, id_proximo, true)
            });
        }
      }
      //-- processo do anterior
      var div_anterior = $("#id_candidato_"+id_cand).prev('.conteiner_candidato');
      if( div_anterior ){
        if ( div_anterior.length == 0 ){
          $('#link_anterior').hide();
        } else {
            var id_anterior = div_anterior.attr('id').replace('id_candidato_', '');
            var slug_anterior = div_anterior.attr("data-slug");
            $('#link_anterior').click(function(){
                abrir_detalhes_candidato(slug_anterior, id_anterior, true)
            });
        }
      }


      $("#id_convocar").change(function(){
        if($(this).is(":checked")){
          $(".show_on_comparecimento").show();
          $(".hide_on_comparecimento").hide();
        } else {
          $(".show_on_comparecimento").hide();
          $(".hide_on_comparecimento").show();
        }
      })


      URL_CONSULTA_PROC_SEL_JSON_CAND = URL_CONSULTA_PROC_SEL_JSON + slug_cand;
      TABELA_CONSULTAPROC_SEL = undefined;

      URL_CONSULTA_CANDIDATURA_JSON_CAND = URL_CONSULTA_CANDIDATURA_JSON + slug_cand;
      TABELA_CONSULTA_CANDIDATURA = undefined;

      URL_CONSULTA_COMPARECIMENTO_JSON_CAND = URL_CONSULTA_COMPARECIMENTO_JSON + slug_cand;
      TABELA_CONSULTA_COMPARECIMENTO = undefined;

      recarrega_consultar_processos_seletivos();
      recarrega_consultar_candidatura();
      recarrega_consultar_comparecimento();
      make_datepicker('#id_data_comparecimento');

      // -- abrir popup
      if(!ja_aberta){
        jQuery('#id_dialog_detalhes_candidato').modal('show');
      }
    }
  });

}

var alterar_conceito_candidato = function(slug_cand, cand_id) {
  $.ajax({
    url: URL_ALTERAR_CONCEITO,
    type: 'post',
    dataType: 'json',
    data: {
      'codigo' : slug_cand,
      'conceito': $("#id_conceito_candidato_detalhes").val()
    },
    success: function(data) {
      if(data['status'] == 'ok'){
          //$.dialogs.success(data['msg']);
          $("#span_conceito_candidato_"+cand_id).html(data['conceito']);
          $("#span_conceito_candidato_detalhes").html(data['conceito']);

          $("#alerta_sucess_proc_sel").show();
          $("#alerta_sucess_proc_sel_msg").html(data['msg']);
          $("#alerta_danger_proc_sel").hide();

      } else {
          //$.dilogs.error(data['msg']);
          $("#alerta_danger_proc_sel").show();
          $("#alerta_danger_proc_sel_msg").html(data['msg']);
          $("#alerta_sucess_proc_sel").hide();
      }
    }
  });

}

// -- Processo Seletivo

var exibir_perfil_vaga = function(){
  $("#btn_ocultar_perfil_vaga, #painel_dados_vaga, .show_on_proc_sel").show();
  $("#btn_exibir_perfil_vaga").hide();
}

var ocultar_perfil_vaga = function(){
  $("#btn_exibir_perfil_vaga").show();
  $("#btn_ocultar_perfil_vaga, #painel_dados_vaga").hide();
}

var abrir_processo_seletivo = function(){
  $(".show_on_proc_sel, .btn_cancelar").show();
  $(".hide_on_proc_sel").hide();
}

var cancelar_inserir_proc_sel = function(){
  $(".show_on_proc_sel, .btn_cancelar, .show_on_comparecimento").hide();
  $(".hide_on_proc_sel").show();
  $(".hide_on_comparecimento").show();
}

var salvar_inserir_proc_sel = function(){
  mostrarCarregando()
  $("#alerta_danger_proc_sel").hide();
  $("#alerta_sucess_proc_sel").hide();
  dados = {
      'vaga': $("#id_vaga").val(),
      'convocar': $("#id_data_comparecimento").is(':visible'),
      'data_comparecimento': $("#id_data_comparecimento").val(),
      'hora_comparecimento': $("#id_hora_comparecimento").val(),
      'selecionador_comparecimento': $("#id_selecionador_comparecimento").val(),
      'candidato_id': $("#id_det_candidato_id").val(),
      'encaminhar': $("#id_encaminhar").is(':checked'),
      'observacao_candidato_detalhes': $("#id_observacao_candidato_detalhes").val(),
      'etapa_visivel': $("#id_fase_proc_sel_detalhes").is(':visible'),
      'fase_proc_sel_detalhes': $("#id_fase_proc_sel_detalhes").val(),
  }
  $.ajax({
    url: URL_INSERIR_PROC_SEL,
    type: 'post',
    dataType: 'json',
    data: dados,
    success: function(data) {
      if(data['status']=='ok'){
          $("#alerta_sucess_proc_sel").show();
          $("#alerta_sucess_proc_sel_msg").html(data['msg']);
          $("#alerta_danger_proc_sel").hide();
          recarrega_consultar_comparecimento();
          recarrega_consultar_processos_seletivos();
          $(".btn_cancelar").hide();
          cand_id = data['cand_id'];

          $("#span_qtde_proc_seletivo_"+cand_id).html(data['qtde_proc_seletivo']);
          $("#span_qtde_encaminhamento_"+cand_id).html(data['qtde_encaminhamento']);
          if( data['qtde_proc_seletivo']>0 ){
              $("#div_det_processos_seletivos").show();
          }

          $("#span_qtde_comparecimento_"+cand_id).html(data['qtde_comparecimento']);
          if( data['qtde_comparecimento']>0 ){
              $("#div_det_comparecimentos").show();
          }

          $("#span_qtde_candidatura_"+cand_id).html(data['qtde_candidatura']);
          if( data['qtde_candidatura']>0 ){
              $("#div_det_candidaturas").show();
          }

          var data_minima = new Date(Date.now());
          $("#id_data_comparecimento").datepicker('setStartDate', data_minima);

      } else {
          $("#alerta_danger_proc_sel").show();
          $("#alerta_danger_proc_sel_msg").html(data['msg']);
          $("#alerta_sucess_proc_sel").hide();
      }
      esconderCarregando();
    },
    error: function(data) {
        $("#alerta_danger_proc_sel").show();
        $("#alerta_danger_proc_sel_msg").html(data['responseText']);
        $("#alerta_sucess_proc_sel").hide();
        esconderCarregando();
    }
  });

}


// -- Listagens de informações do candidato

var consultar_candidatura = function() {

  TABELA_CONSULTA_CANDIDATURA = $.DataTableXenon({
    json: URL_CONSULTA_CANDIDATURA_JSON_CAND,
    container: "datatable_candidaturas",
    filterForm: '#filtro_candidaturas',
    paging: false,
    searching: false,
    select: false,
    order: [],
    aoColumns: [
      {
       "sTitle": "<span class='hidden-xs' title=" + TXT_COL_DATA + ">D.C.</span>",
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-1 text-center',
       "mRender": function(data, type, full) {
         return "<span value='" + full["dt_candidatura_us"] + "'>" + full["dt_candidatura"] + '</span> '
       }
     }, {
       "sTitle": TXT_COL_CLIENTE,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-5',
       "mRender": function(data, type, full) {
         var HTML = ' (' + full["cliente_id"] + ') ' + full["cliente_desc"] + ' ';
         return HTML;
       }
     },{
       "sTitle": TXT_COL_VAGA,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-6',
       "mRender": function(data, type, full) {
         var HTML = ' (' + full["vaga_id"] + ') ' + full["vaga_desc"] + ' ';
         return HTML;
       }
     },
   ],
   complete: function(){
     $("#table_datatable_candidaturas_info").remove()
   }
  });

}

var recarrega_consultar_candidatura = function() {
  try{
    TABELA_CONSULTA_CANDIDATURA.reload();
  } catch(e) {
    consultar_candidatura()
  }
}

var consultar_comparecimento = function() {

  TABELA_CONSULTA_COMPARECIMENTO = $.DataTableXenon({
    json: URL_CONSULTA_COMPARECIMENTO_JSON_CAND,
    container: "datatable_comparecimento",
    filterForm: '#filtro_comparecimento',
    paging: false,
    searching: false,
    select: false,
    order: [],
    aoColumns: [
      {
       "sTitle": "<span class='hidden-xs' title=" + TXT_COL_DATA + ">D.C.</span>",
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-1 text-center',
       "mRender": function(data, type, full) {
         return "<span value='" + full["data_us"] + full["hora"] + "'>" + full["data"] + " " + full["hora"] + '</span> '
       }
     }, {
       "sTitle": TXT_COL_CLIENTE,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-3',
       "mRender": function(data, type, full) {
         var HTML = '(' + full["cliente_id"] + ') ' + full["cliente_desc"] + ' ';
         return HTML;
       }
     },{
       "sTitle": TXT_COL_VAGA,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-3',
       "mRender": function(data, type, full) {
         var HTML = '(' + full["vaga_id"] + ') ' + full["vaga_desc"] + ' ';
         return HTML;
       }
     }, {
       "sTitle": TXT_COL_SELECIONADOR,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-3',
       "mRender": function(data, type, full) {
         var HTML = full["selecionador"];
         return HTML;
       }
     },{
       "sTitle": TXT_COL_COMPARECEU,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-2 text-center',
       "mRender": function(data, type, full) {
         var HTML = full['compareceu'] ? 'Sim' : 'Não';
         return HTML;
       }
     },
    ],
    complete: function(){
      $("#table_datatable_comparecimento_info").remove()
    }
  });

}

var recarrega_consultar_comparecimento = function() {
  try{
    TABELA_CONSULTA_COMPARECIMENTO.reload();
  } catch(e) {
    consultar_comparecimento()
  }
}

var consultar_processos_seletivos = function() {

  TABELA_CONSULTAPROC_SEL = $.DataTableXenon({
    json: URL_CONSULTA_PROC_SEL_JSON_CAND,
    container: "datatable_processos_seletivos",
    filterForm: '#filtro_processos_seletivos',
    paging: false,
    searching: false,
    select: false,
    order: [],
    aoColumns: [ {
       "sTitle": TXT_COL_CLIENTE,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-4',
       "mRender": render_cliente_coluna_padrao
     },{
       "sTitle": TXT_COL_VAGA,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-4',
       "mRender": render_vaga_coluna_padrao
     }, {
       "sTitle": TXT_COL_DETALHES,
       'orderable': false,
       'searchable': false,
       'class': 'col-sm-4',
       "mRender": function(data, type, full) {
         var HTML = '';
         HTML += '<span><b>' + TXT_COL_APROVADO + ':</b> ' + full["aprovado"] + '</span><br/>';

         if (full['usa_encaminhamento']) {
           HTML += '<span><b>' + TXT_COL_ENCAMINHAMENTO + ':</b> ' + full["encaminhado"] + '</span><br/>';
         }

        if (full['usa_fase_proc_sel']) {
          HTML += '<span><b>' + TXT_COL_ETAPA + ':</b> ' + ( full["etapa"]? full["etapa"] : '') + '</span> ';
        }
         return HTML;
         return HTML;
       }
     },
    ],
    complete: function(){
      $("#table_datatable_processos_seletivos_info").remove()
    }
  });

}

var recarrega_consultar_processos_seletivos = function() {
  try{
    TABELA_CONSULTA_PROC_SEL.reload();
  } catch(e) {
    consultar_processos_seletivos()
  }
}
