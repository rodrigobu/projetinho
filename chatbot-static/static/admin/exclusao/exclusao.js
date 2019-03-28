
function criar_candidato() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA,
    container: "datatable_candidato",
    filterForm: '#filtro_consulta',
    order: [
      [1, "asc"]
    ],
    aoColumns: [{
        "sTitle": "<input class='center' name='selecionar-todas' type='checkbox'>",
        'sType': 'html',
        'orderable': false,
        'searchable': false,
        'class': 'col-md-1 text-center',
        "mRender": function(data, type, full) {
          return "<input class='center checkbox_colab' value='" + full["cand_id"] + "' name='selecionar-cand' type='checkbox'>";
        }
      }, {
        "mData": TXT_COL_CANDIDATO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-6',
        "mRender": render_candidato_coluna_padrao
      },
			{
        "mData": TXT_COL_OUTRAS_INFOR,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-5',
        "mRender": function(data, type, full) {
          var HTML = "<span><b>" + TXT_COL_ESTADO + ": </b>" + ( full["estado"] ? full["estado"]  : '' ) + "<br/></span>";
	        HTML += "<span><b>" + TXT_COL_CIDADE + ": </b>" + ( full["cidade"] ? full["cidade"] : '' )  + "<br/></span>";
	        HTML += "<span><b>" + TXT_COL_DT_CADASTRO + ": </b>" + ( full["dt_cadastro"] ? full["dt_cadastro"]  : '' ) + "<br/></span>";
	        HTML += "<span><b>" + TXT_COL_ORIGEM + ": </b>" + ( full["origem"] ? full["origem"]  : '' ) + "<br/></span>";
	        HTML += "<span><b>" + TXT_COL_CONCEITO + ": </b>" + ( full["conceito"] ? full["conceito"] : '' ) + "<br/></span>";
	        HTML += "<span><b>" + TXT_COL_TIPO + ": </b>" + ( full["tipo"] ? full["tipo"] : '' ) + "<br/></span>";
					return HTML;
        }
      }

    ],
    complete: function() {
      $("[name='selecionar-todas']").click(_selecionar_lote);
      $("[name='selecionar-cand']").click(_selecionar_geral);

      if ($("[name=selecionar-cand]").length != 0) {
        //$("#div_datatable_candidato").show();
				$("#id_excluir_todos_os_filtrados").parent().parent().show();
      } else {
        //$("#div_datatable_candidato").hide();
				$("#id_excluir_todos_os_filtrados").parent().parent().hide();
      }

    }
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

var _selecionar_lote = function(adicionar) {
  if ($(this).is(":checked")) {
    $(".checkbox_colab").prop("checked", "checked");
  } else {
    $(".checkbox_colab").removeAttr("checked");
  }
  if ($(this).is(":checked") & $("[name=selecionar-cand]").length == 0) {
    $(this).removeAttr("checked");
  }
};

var _selecionar_geral = function() {
  if ($("[name=selecionar-cand]").length == $("[name=selecionar-cand]:checked").length) {
    $("[name='selecionar-todas']").prop("checked", "checked");
  } else {
    $("[name='selecionar-todas']").removeAttr("checked");
  }
};

$(function() {

  $("#id_tipo").change(function() {
    $.ajax({
      url: URL_FORMULARIO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        tipo: $("#id_tipo").val()
      },
      success: function(dados) {

        $("#div_formulario").html(dados['html']);

        $("#id_btn_excluir").click(function() {

          if ($('#id_is_candidato').val() != 'True' || ($('#id_is_candidato').val() == 'True' && $("[name='tipo_excluir']:checked").val() == '0')) {
            // Exclusões normais e Exclusão de candidato
            if( $('#id_excluir').val()=='' ) {
              $.dialogs.error(TXT_ERRO_001);
            } else {
              $.dialogs.confirm('', TXT_CONFIRMACAO_001, function(){

                $.dialogs.confirm('', TXT_CONFIRMACAO_001+" "+TXT_CONFIRMACAO_002, function(){
                  $("#form_exclusao").submit();
                })

              });
            }

          } else {
            // Exclusão de candidato em massa
            if(  $('[name="selecionar-cand"]').length==0 ) {
                $.dialogs.error(TXT_ERROR_SEM_CANDS_FILTRADOS);
            } else if( !$("#id_excluir_todos_os_filtrados").is(":checked") && $('[name="selecionar-cand"]:checked').length==0 ) {
                $.dialogs.error(TXT_ERROR_SEM_CANDS_SELECIONADOS);
            } else {

               $.dialogs.confirm('', TXT_CONFIRMACAO_001, function(){

                 $.dialogs.confirm('', TXT_CONFIRMACAO_001+" "+TXT_CONFIRMACAO_002, function(){
                    $("#form_exclusao").submit();
                 })

               })

            }

          }

        });

        $("[name='tipo_excluir']").change(function() {
          if ($(this).val() == '0') {
            $("#id_excluir").attr('required',true);
            $('#excluir_candidato').show();
            $('#excluir_em_massa').hide();
            $("#id_btn_excluir").show();
          } else {
            $("#id_excluir").removeAttr('required');
            $('#excluir_em_massa').show();
            $('#excluir_candidato').hide();
            $("#id_btn_excluir").hide();
            $("#div_datatable_candidato").hide();
          }
        });
        set_cidades_do_estado("#id_estado", "#id_cidade");

        criar_candidato();
        $("#id_funcao").change(function(){
          $("[name='funcao']").val( $(this).val() );
        });

        $("#id_cand_tipo").change(function(){
          $("[name='cand_tipo']").val( $(this).val() );
        });

        $("#id_cand_conceito").change(function(){
          $("[name='cand_conceito']").val( $(this).val() );
        });

        $("#id_cand_origem").change(function(){
          $("[name='cand_origem']").val( $(this).val() );
        });

        $("#id_escolaridade").change(function(){
          $("[name='escolaridade']").val( $(this).val() );
        });

        $("#id_cidade").change(function(){
          $("[name='cidades']").val( $(this).val() );
        });

        make_datepicker('#id_dt_ini');
        make_datepicker('#id_dt_fin');

				$("#id_btn_filtrar").click(function(){
          if( Object.keys(serializaFormOnlyFill("#filtro_consulta")).length == 0 ) {
            $.dialogs.error(TXT_ERROR_OBG_FILTROS);
          } else {
            $("#div_datatable_candidato").show();
            consultar();
            $("#id_btn_excluir").show();
          }
				});

				$("#div_datatable_candidato").hide();

      }
    });
  });

  $("#id_tipo").change();

});
