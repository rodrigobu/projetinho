var TABELA_CONSULTA_PS = undefined;

function remover_processo_seletivo(slug_registro) {
  $.dialogs.confirm('', PROC_SEL_TXT_CONFIRM_REMOVER, function() {
    $.ajax({
      url: PROC_SEL_URL_SALVAR_REMOVER,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro
      },
      success: function(dados) {
        consultar_processo_seletivo()
      }
    });
  });
}

function get_form_aprovacao(slug_registro) {
  $.dialogs.confirm('', PROC_SEL_TXT_CONFIRM_APROVAR, function() {
    $.ajax({
      url: PROC_SEL_URL_FORM_APROVAR,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro
      },
      success: function(dados) {
        $(".hide_on_proc_sel").hide();
        $("#detalhes_proc_sel").html(dados["html"]).show();
        make_datepicker('#id_data_inicio');
        make_datepicker('#id_data_inativo');
      }
    });
  });
}

var voltar_proc_sel = function() {
  $(".hide_on_proc_sel").show();
  $("#detalhes_proc_sel").html("").hide();
}

var salvar_aprovacao = function() {
  disable_btn("form_aprovacao");
  if (!$('#form_aprovacao').parsley().validate()) {
    enable_btn("form_aprovacao");
    return false;
  }
  var form = serializaForm('#form_aprovacao');
  $.post(PROC_SEL_URL_SALVAR_APROVAR, form)
    .done(function(data) {
      if (data['status'] == 'ok') {
        $.dialogs.success(data['msg']);
        consultar_processo_seletivo();
        voltar_proc_sel();
        consultar_status();
      } else {
        $.dialogs.error(data['msg']);
      }
    }).complete(function(data) {
      enable_btn("form_aprovacao");
    });
};

function salvar_desaprovacao(slug_registro) {
  $.dialogs.confirm('', PROC_SEL_TXT_CONFIRM_DESAPROVAR, function() {
    $.ajax({
      url: PROC_SEL_URL_SALVAR_DESAPROVAR,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro
      },
      success: function(data) {
        if (data['status'] == 'ok') {
          $.dialogs.success(data['msg']);
          consultar_processo_seletivo();
          consultar_status();
        } else {
          $.dialogs.error(data['msg']);
        }
      }
    });
  });
}

function funcao_encaminhar(slug_registro, txt_confirm, encaminhado) {
  $.dialogs.confirm('', txt_confirm, function() {
    $.ajax({
      url: PROC_SEL_URL_SALVAR_ENCAMINHAMENTO,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {
        codigo: slug_registro,
        encaminhado: encaminhado
      },
      success: function(data) {
        if (data['status'] == 'ok') {
          $.dialogs.success(data['msg']);
          consultar_processo_seletivo();
        } else {
          $.dialogs.error(data['msg']);
        }
      }
    });
  });
}

function encaminhar(slug_registro) {
  funcao_encaminhar(slug_registro, PROC_SEL_TXT_CONFIRM_ENCAMINHAR, 'true');
}

function desencaminhar(slug_registro) {
  funcao_encaminhar(slug_registro, PROC_SEL_TXT_CONFIRM_DESENCAMINHAR, 'false');
}

function fechar_vaga() {
  $.dialogs.confirm('', TXT_CONFIRM_FECHAR_VAGA, function() {
    $.ajax({
      url: URL_FECHAR_VAGA,
      type: 'get',
      dataType: 'json',
      async: false,
      data: {},
      success: function(data) {
        if (data['status'] == 'ok') {
          $.dialogs.success(data['msg']);
          window.location.href = window.location.href;
        } else {
          $.dialogs.error(data['msg']);
        }
      }
    });
  });
}

function consultar_status() {
  $.ajax({
    url: URL_CONSULTAR_STATUS,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {},
    success: function(data) {
      $("#id_qtd_fechada").html(data['qtd_fechada']);
      $("#id_qtd_solicitada").html(data['qtd_solicitada']);
      if (data['para_fechar']) {
        fechar_vaga();
      }
    }
  });
}

function listar_processo_seletivo() {

  var COLUNAS_TBL = [{
    "mData": TITULO_ACOES,
    'orderable': false,
    'searchable': false,
    'class': 'col-md-2 text-center big_icons',
    "mRender": function(data, type, full) {
      var HTML = ''
      HTML += '<a href="' + URL_DETALHES_PS + full["num"] + '" title="' + TITULO_DETALHES + '" class="text-gray "><i class="' + ICON_DETALHES + '"></i> </a>';

      if (PERMITE_CAND == 'True') {
        HTML += gerar_link_edicao_candidato(full);
      }

      if (!full['fechada'] && PERMITE_EDIT_CAND_PROC_SEL == 'True' && !READONLY) {

        if (!full['esta_aprovado']) {
          HTML += "<span class='text-gray cursor_pointer' title='" + PROC_SEL_TXT_BTN_APROVAR + "' onclick='get_form_aprovacao(\"" + full["num"] + "\")'> <i class='" + PROC_SEL_APROVACAO_ICON + "'></i> </span> ";
        }

        if (full['usa_encaminhamento']) {
          if (!full['esta_encaminhado']) {
            HTML += "<span class='text-gray cursor_pointer' title='" + PROC_SEL_TXT_BTN_ENCAMINHAR + "' onclick='encaminhar(\"" + full["num"] + "\")'> <i class='" + PROC_SEL_ENCAMINHAR_ICON + "'></i> </span> ";
          }
        }

        if (PERMITE_DELET_CAND_PROC_SEL == 'True') {
          HTML += "<span class='text-danger cursor_pointer' title='" + PROC_SEL_TXT_BTN_REMOVER + "' onclick='remover_processo_seletivo(\"" + full["num"] + "\")'> <i class='" + PROC_SEL_REMOVER_ICON + "'></i> </span> ";
        }

        HTML += "<a class='cursor_pointer text-gray' title='" + TXT_CV_PADRAO + "' href='" + URL_CV_PADRAO + full["cand_id"] + "'  target='_blank'> <i class='" + ICON_CV_PADRAO + "'></i> </a> ";

      }

      return HTML;

    }
  }, {
    "mData": TXT_COL_CANDIDATO,
    'orderable': true,
    'searchable': true,
    'class': 'col-md-6',
    "mRender": function(data, type, full) {
      extra_render = function(data, type, full) {
        HTML = '<br/>'
        if (!full["part_sel"]) {
          HTML += '<span title="' + full["conceito"] + '" class="text-warning" ><i class="' + ICON_CONCRUIM + '"></i> </span>';
        }
        if (full["restrito"]) {
          HTML += '<span title="' + TXT_COL_RESTRITO + '" class="text-red"><i class="' + ICON_RESTRITO + '"></i> </span>';
        }
        return HTML;
      };
      return render_candidato_coluna_padrao(data, type, full, extra_render);
    }
  }, ];

  if (MOD_ETAPA == 'True') {
    COLUNAS_TBL.push({
      "mData": TXT_COL_ETAPA,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-2',
      "mRender": function(data, type, full) {
        return full['etapa'];
      }
    }, );
  }

  if (MOD_ENCAM == 'True') {
    COLUNAS_TBL.push({
      "mData": TXT_COL_ENCAM,
      'orderable': true,
      'searchable': true,
      'class': 'col-md-1 text-center',
      "mRender": function(data, type, full) {
        HTML = '';
        if (full['esta_encaminhado']) {
          HTML += "<span class='text-danger cursor_pointer' title='" + PROC_SEL_TXT_BTN_DESENCAMINHAR + "' onclick='desencaminhar(\"" + full["num"] + "\")'> <i class='" + ICON_FECHAR + "'></i> </span> ";
        };
        HTML += full['encaminhado'];
        return HTML;
      }
    }, );
  }

  COLUNAS_TBL.push({
    "mData": TXT_COL_APROV,
    'orderable': true,
    'searchable': true,
    'class': 'col-md-1 text-center',
    "mRender": function(data, type, full) {
      HTML = '';
      if (full['esta_aprovado']) {
        HTML += "<span class='text-danger cursor_pointer' title='" + PROC_SEL_TXT_BTN_DESAPROVAR + "' onclick='salvar_desaprovacao(\"" + full["num"] + "\")'> <i class='" + ICON_FECHAR + "'></i> </span> ";
      }
      HTML += full['aprovado'];
      return HTML;
    }
  }, );

  TABELA_CONSULTA_PS = $.DataTableXenon({
    json: URL_CONS_PS,
    container: "datatable_processo_seletivo",
    filterForm: '#filtro_consulta',
    order: [
      [1, "desc"]
    ],
    aoColumns: COLUNAS_TBL,
  });

}

function consultar_processo_seletivo() {
  TABELA_CONSULTA_PS.reload();
}

$(function() {
  if (document.URL.match(/processo_seletivo/)) {
    listar_processo_seletivo();
  };
  $("#aba_competencia").click(function(e) {
    listar_processo_seletivo();
  });
});
