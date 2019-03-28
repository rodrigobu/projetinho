var TABELA_CONSULTA_CANDIDATURA = undefined;

function criar_fila_cand() {

  TABELA_CONSULTA_FILA_CAND = $.DataTableXenon({
    json: URL_CONS_CANDIDATURA,
    container: "datatable_fila_cand",
    filterForm: '#filtro_consulta',
    order: [
      [2, "asc"]
    ],
    aoColumns: [{
      "sTitle": "<span class='hidden-xs'>" + TITULO_ACOES + "</span>",
      'orderable': false,
      'searchable': false,
      'class': 'col-xs-1 text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = '';

        if (PERMITE_CAND == 'True') {
          HTML += gerar_link_edicao_candidato(full);
        }

        if(USA_QUESTIONARIO){
          HTML += '<a href="' + URL_CONS_QUESTIONARIO_RESPOSTAS + full["fila_slug"] + '" title="'+ TXT_VER_RESPOSTAS +'" class="text-gray"> <i class="' + ICON_VER_RESPOSTAS + '"></i> </a>';
        }

        if (!full['fechada'] && !READONLY) {

          if (PERMITE_INSERIR == 'True') {
            HTML += "<a title='" + TXT_BTN_SELECIONAR + "' onclick='selecionar(\"" + full["fila_slug"] + "\")' class='text-gray'> <i class='" + ICON_SELECIONAR + "'></i></span> ";
          }

          if (PERMITE_DELETAR_FILA_CAND == 'True') {
            HTML += "<a title='" + TXT_BTN_REMOVER + "' onclick='remover(\"" + full["fila_slug"] + "\")' class='text-gray'> <i class='" + ICON_EXC + "'></i></span> ";
          }

        }
        return HTML;
      }
    }, {
      "mData": TXT_COL_CANDIDATO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-4 col-xs-11',
      "mRender": render_candidato_coluna_padrao
    }, {
      "sTitle": "<span class='hidden-xs' title=" + TXT_COL_DATA + ">D.C.</span>",
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-1 hidden-xs text-center',
      "mRender": function(data, type, full) {
        return "<span value='" + full["dt_candidatura_us"] + "'><br/>" + full["dt_candidatura"] + '</span> '
      }
    }, {
      "mData": TXT_COL_CURRICULO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-1 hidden-xs text-center',
      "mRender": function(data, type, full) {
        return gerar_cv_link(full);
      }
    }, {
      "sTitle": TXT_COL_TRABALHANDO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-2 hidden-xs',
      "mRender": function(data, type, full) {
        return full["trabalhando"];
      }
    }, {
      "sTitle": TXT_COL_CIDADE_ESTADO,
      'orderable': true,
      'searchable': true,
      'class': 'col-sm-1 hidden-xs',
      "mRender": function(data, type, full) {
        return full["cand_cidade"] + " " + full["cand_estado"];
      }
    }, ]
  });
}

function consultar_candidatura() {
  TABELA_CONSULTA_FILA_CAND.reload();
}

function remover(slug_registro) {
  $.dialogs.confirm('', TXT_CONFIRM_ENCERRA, function() {
    $.ajax({
      url: URL_EXCLUIR_CANDIDATURA,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro,
      },
      success: function(dados) {
        if (dados['status'] == 'ok') {
          $.dialogs.success(dados['msg']);
          consultar_candidatura();
        } else {
          $.dialogs.error(dados['msg']);
        }
      }
    });
  });
}

function selecionar(slug_registro) {
  window.location.href = URL_ADICIONAR_COLAB + slug_registro + '/';
}

$(function() {
  criar_fila_cand();
})
