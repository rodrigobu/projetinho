function criar_vagas_padroes() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_VAGAS_PADROES_JSON,
    container: "datatable_vagas_padroes",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COLUMN_FUNCAO,
        'orderable': true,
        'searchable': true,
        'class': 'col-md-11 col-xs-11',
        "mRender": render_vaga_coluna_padrao
      },
      {
        "sTitle": "<span class='text-center hidden-xs'>"+TXT_COLUMN_ACOES+"</span>",
        'orderable': true,
        'searchable': true,
        'class': 'col-md-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = '';
          HTML += "<span title='"+TXT_BTN_DETALHES+"' class='cursor_pointer' onclick='detalhes_vaga(\"" + full["vaga_slug"] + "\")'> <i class='fa fa-eye'></i> </span> ";
          HTML += "<span title='"+TXT_BTN_ABRIR+"' class='cursor_pointer' onclick='form_abertura_vaga(\"" + full["vaga_slug"] + "\")'> <i class='fa fa-plus-circle'></i> </span> ";
          return HTML;
        }
      },
    ]
  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}

function form_abertura_vaga(slug_registro) {
  window.location.href = URL_FORM_ABRIR_VAGA + slug_registro;
}

function detalhes_vaga(slug_registro){
    $.ajax({
      url : URL_DETALHES_VAGA,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { codigo : slug_registro },
      success : function(dados) {
        $("#datatable_vagas_padroes").hide();
        $("#detalhes_vagas_padroes").html(dados["html"]).show();
        $("#id_btn_voltar").click(voltar_detalhes_vaga);
      }
    });
}

function voltar_detalhes_vaga(){
    $("#datatable_vagas_padroes").show();
    $("#detalhes_vagas_padroes").hide().html("");
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  criar_vagas_padroes();
});
