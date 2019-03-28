// -- Colunas da tabela
var COLUNAS = {
  'status': {
    "mData": TXT_COL_STATUS,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['status'];
    }
  },
  'logradouro': {
    "mData": TXT_COL_LOGRADO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['logradouro'];
    }
  },
  'cliente': {
    "mData": TXT_COL_CLIENTE,
    'orderable': true,
    'searchable': true,
    'class': 'col-md-2',
    "mRender": function(data, type, full) {
      var HTML = '';
      HTML += "<span>" + full["cliente_nome"] + " (" + TXT_COL_COD + "&nbsp;" + full["cliente_id"] + ")<br/></span>";
      HTML += "<span><b>" + TXT_COL_RAZAO + ":</b>&nbsp;" + full["cliente_razao"] + "<br/></span>";
      HTML += "<span><b>" + TXT_COL_CNPJ + ":</b>&nbsp;" + full["cliente_cnpj"] + "<br/></span>";
      return HTML;
    }
  },
  'tipo': {
    "mData": TXT_COL_TIPO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['tipo_vaga'];
    }
  },
  'filial': {
    "mData": TXT_COL_FILIAL,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['filial'];
    }
  },
  'motivo_ab': {
    "mData": TXT_COL_MOTIVOAB,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['motivo_ab'];
    }
  },
  'etapa': {
    "mData": TXT_COL_ETAP,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['etapa'];
    }
  },
}

function criar_vaga() {

  var COLUNAS_TBL = [{
      "mData": TITULO_ACOES,
      'orderable': false,
      'searchable': false,
      'class': 'text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = ''
        HTML += '<a href="' + URL_DETALHES + full["slug"] + '" title="' + TITULO_DETALHES + '" class="text-gray "><i class="' + ICON_DETALHES + '"></i> </a>';

        if (VAL_ICONEDIT == 'True') {
          HTML += '<a href="' + URL_EDICAO + full["slug"] + '" title="' + TITULO_EDIT + '" class="text-gray "><i class="' + ICON_EDIT + '"></i> </a>';
        }
        HTML += ' 	<a class="text-gray" href="' + URL_SELECAO_CAND_VAGA + full["slug"] + '" title="' + TXT_COL_SELECAO + '"><i class="' + ICON_SELECAO + '"></i> </a> ';
        return HTML;
      }
    },
    {
      "mData": '',
      'visible': false,
      'class': '',
      "mRender": function(data, type, full) {
        return full['dt_cadastro'];
      }
    },
    {
      "mData": TXT_COL_VAGA,
      'orderable': true,
      'searchable': true,
      'class': '',
      "mRender": function(data, type, full) {
        var HTML = '';
        HTML += "<span>" + full["desc_contrato"] + " (" + TXT_COL_COD + "&nbsp;" + full["num"] + ")<br/></span>";
        HTML += "<span><b>" + TXT_COL_FUNCAO + ":</b>&nbsp;" + full["funcao"] + "<br/></span>";
        HTML += "<span><b>" + TXT_COL_DTENT + ":</b>&nbsp;" + full["dt_cadastro_format"] + "<br/></span>";
        return HTML;
      }
    }
  ];
  $.each(COLUNAS_CONFIGURADAS, function(idx, value) {
    COLUNAS_TBL.push(COLUNAS[value]);
  });


  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_VAGA,
    container: "datatable_vaga",
    filterForm: '#filtro_consulta',
    aoColumns: COLUNAS_TBL,
    searching: false,
    order: [
      [1, "desc"]
    ],
    complete: function() {
      $("#table_datatable_vaga").css("width", (327.37 * COLUNAS_CONFIGURADAS.length) + "px");
      $("#table_datatable_vaga").css("min-width", "100%");
      $("#table_datatable_vaga").parent().remove("col-sm-12");
      $("#table_datatable_vaga").parent().css("overflow-x", "scroll");
    }
  });

}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  criar_vaga();
  $("#id_btn_filtrar").click(consultar);
  set_cidades_do_estado('#id_estado', '#id_cidade');
});
