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
  'tipo': {
    "mData": TXT_COL_TIPO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['tipo'];
    }
  },
  'ramo': {
    "mData": TXT_COL_RAMO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['ramo'];
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
  'grupo': {
    "mData": TXT_COL_GRUPO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['grupo'];
    }
  },
  'promotor': {
    "mData": TXT_COL_PROMOTOR,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['promotor'];
    }
  },
  'login': {
    "mData": TXT_COL_LOGIN,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['login_cli'];
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
  'data_cadastro': {
    "mData": TXT_COL_DTCAD,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      var HTML = '';
      var HTML = '<span class="hidden">' + full["dt_cadastro"] + '</span><span>' + full["dt_cadastro_format"] + '</span>';
      return HTML;
    }
  },
}

function criar_cliente() {

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
      "mData": TXT_COL_CLI,
      'orderable': true,
      'searchable': true,
      'class': '',
      "mRender": function(data, type, full) {
        var HTML = '';
        HTML += "<span>" + full["nome_fantasia"] + " (" + TXT_COL_COD + "&nbsp;" + full["id"] + ")<br/></span>";
        HTML += "<span><b>" + TXT_COL_RAZAO + ":</b>&nbsp;" + full["razao_social"] + "<br/></span>";
        HTML += "<span><b>" + TXT_COL_CNPJ + ":</b>&nbsp;" + full["cnpj"] + "<br/></span>";
        return HTML;
      }
    }
  ];

  $.each(COLUNAS_CONFIGURADAS, function(idx, value) {
    if (COLUNAS[value]) {
      COLUNAS_TBL.push(COLUNAS[value]);
    }
  });
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_CLIENTE,
    container: "datatable_cliente",
    filterForm: '#filtro_consulta',
    aoColumns: COLUNAS_TBL,
    searching: false,
    order: [
      [1, "desc"]
    ],
    complete: function() {
      $("#table_datatable_cliente").css("width", (327.37 * COLUNAS_CONFIGURADAS.length) + "px");
      $("#table_datatable_cliente").css("min-width", "100%");
      $("#table_datatable_cliente").parent().remove("col-sm-12");
      $("#table_datatable_cliente").parent().css("overflow-x", "scroll");
    }
  });

}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  criar_cliente();
  $("#id_btn_filtrar").click(consultar);
  set_cidades_do_estado('#id_estado', '#id_cidade');
});
