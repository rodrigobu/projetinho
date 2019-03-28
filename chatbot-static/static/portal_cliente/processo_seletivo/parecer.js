function criar_list_parecer() {

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_PROC_SEL_JSON,
    container: "datatable_proc_sel",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_VAGA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-6 col-xs-11',
        "mRender": render_vaga_coluna_padrao
      },{
        "mData": TXT_COL_DATA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 col-xs-11',
        "mRender": function(data, type, full) {
          var HTML = '<span value='+  full["data_us"] +' >' + full["data"] + '</span>';
          return HTML;
        }
      },{
        "mData": TXT_COL_PARECER,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 col-xs-11',
        "mRender": function(data, type, full) {
          if(full['parecer_ent'].length>100){
             var HTML = ' <span title="'+full['parecer_ent'].replace('"',"'")+'"">' + full["parecer"] + '</span> ';
          } else {
            var HTML = ' 	<span>' + full["parecer_ent"]  + '</span> ';
          }
          return HTML;
        }
      },
      {
        "sTitle": "<span class='hidden-xs'>" + TXT_COL_ACOES + "</span>",
        'orderable': false,
        'searchable': false,
        'class': 'col-sm-1 text-center big_icons',
        "mRender": function(data, type, full) {
          var HTML = '';
          HTML += '<a href="'+ URL_EDICAO + full["slug"] + '" title="'+TITULO_EDIT+'" class="text-gray "><i class="'+ICON_EDIT+'"></i> </a>';
          HTML += '<a href="#" title="'+TITULO_EXC+'" class="text-gray " onclick="excluir_registro(\''+full["slug"]+'\')"> <i class="'+ICON_DELETE+'"></i></a>';
          return HTML;
        }
      }
    ]

  });
}

function consultar() {
  TABELA_CONSULTA.reload();
}


function excluir_registro(slug_registro){

  $.dialogs.confirm('', ALERTA_EXC, function() {
    $.ajax({
      url : URL_EXCLUSAO,
      type : 'get',
      dataType : 'json',
      async : false,
      data : { num : slug_registro },
      success : function(dados) {
        $.dialogs.success(ALERTA_SUC_EXC);
        consultar();
      }
    });
  });

}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  criar_list_parecer();
});
























function adicionar_parecer(slug_registro) {
  $.ajax({
    url: URL_FORM_PARECER,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro
    },
    success: function(dados) {
      $("#datatable_proc_sel").hide();
      $("#parecer_proc_sel").html(dados["html"]).show();
      $("#id_btn_voltar").click(voltar_parecer);
    }
  });
}

function criar_parecer() {
    disable_btn("form_parecer");
    if (!$('#form_parecer').parsley().validate()) {
        enable_btn("form_parecer");
        return false;
    }
    var form = serializaForm('#form_parecer');
    $.post(URL_SALVAR_PARECER, form)
        .done(function(data) {
            if(data['status']  == 'ok'){
              $.dialogs.success(data['msg']);
              consultar();
              voltar_parecer();
            } else {
              $.dialogs.error(data['msg']);
            }
        }).complete(function(data) {
            enable_btn("form_restricao");
        });
}

function editar_parecer(slug_registro) {
    disable_btn("form_parecer");
    if (!$('#form_parecer').parsley().validate()) {
        enable_btn("form_parecer");
        return false;
    }
    var form = serializaForm('#form_parecer');
    form['slug_registro'] = slug_registro;
    $.post(URL_SALVAR_PARECER, form)
        .done(function(data) {
            if(data['status']  == 'ok'){
              $.dialogs.success(data['msg']);
              listagem_parecer();
            } else {
              $.dialogs.error(data['msg']);
            }
        }).complete(function(data) {
            enable_btn("form_restricao");
        });
}

function remover_parecer(slug_registro) {
  $.ajax({
    url: URL_REMOVER_PARECER,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      codigo: slug_registro
    },
    success: function(dados) {
      if(data['status']  == 'ok'){
        $.dialogs.success(data['msg']);
        listagem_parecer();
      } else {
        $.dialogs.error(data['msg']);
      }
    }
  });
}
