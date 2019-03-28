// -- Colunas da tabela
var COLUNAS = {
  'conceito': {
    "mData": TXT_COL_CONCEITO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['conceito'];
    }
  },
  'origem': {
    "mData": TXT_COL_ORIG,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['origem'];
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
  'cod_outros_sist': {
    "mData": TXT_COL_CODOUTRO,
    'orderable': true,
    'searchable': true,
    'class': '',
    "mRender": function(data, type, full) {
      return full['cod_outros_sist'];
    }
  },
}

function criar_candidato() {

  var COLUNAS_TBL = [{
      "mData": TITULO_ACOES,
      'orderable': false,
      'searchable': false,
      'class': 'text-center big_icons',
      "mRender": function(data, type, full) {
        var HTML = '';
        HTML += '<a href="' + URL_DETALHES + full["slug"] + '" title="' + TITULO_DETALHES + '" class="text-gray "><i class="' + ICON_DETALHES + '"></i> </a>';

        if (VAL_ICONEDIT == 'True') {
          HTML += '<a href="' + URL_EDICAO + full["slug"] + '" title="' + TITULO_EDIT + '" class="text-gray "><i class="' + ICON_EDIT + '"></i> </a>';
        }
        if (full["com_deficiencia"]) {
          HTML += '<span title="' + TXT_COL_DEF + '" class="text-blue"><i class="' + ICON_DEF + '"></i> </span>';
        }
        if (full["inativo"]) {
          HTML += '<span title="' + TXT_COL_INATIVOATE + ': ' + full["inativo_ate"] + '" class="text-yellow "><i class="' + ICON_INATIVO + '"></i> </span>';
        }
        if (!full["part_sel"]) {
          HTML += '<span title="' + full["conceito"] + '" class="text-gray" ><i class="' + ICON_CONCRUIM + '"></i> </span>';
        }
        if (full["restrito"]) {
          HTML += '<span title="' + TXT_COL_RESTRITO + '" class="text-red"><i class="' + ICON_RESTRITO + '"></i> </span>';
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
      "mData": TXT_COL_CAND,
      'orderable': true,
      'searchable': true,
      'class': '',
      "mRender": function(data, type, full) {
        var HTML = '';
        HTML += "<span>" + full["nome"] + " (" + TXT_COL_COD + "&nbsp;" + full["num"] + ")<br/></span>";
        HTML += "<span><b>" + TXT_COL_DTNASC + ":</b>&nbsp;" + full["dt_nasc"] + "<br/></span>";
        HTML += "<span><b>" + TXT_COL_CPF + ":</b>&nbsp;" + full["cpf"] + "<br/></span>";
        return HTML;
      }
    }
  ];
  $.each(COLUNAS_CONFIGURADAS, function(idx, value) {
    COLUNAS_TBL.push(COLUNAS[value]);
  });

  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_CONSULTA_CAND,
    container: "datatable_candidato",
    filterForm: '#filtro_consulta',
    aoColumns: COLUNAS_TBL,
    searching: false,
    order: [
      [1, "desc"]
    ],
    complete: function() {
      $("#table_datatable_candidato").css("width", (327.37 * COLUNAS_CONFIGURADAS.length) + "px");
      $("#table_datatable_candidato").css("min-width", "100%");
      $("#table_datatable_candidato").parent().remove("col-sm-12");
      $("#table_datatable_candidato").parent().css("overflow-x", "scroll");
    }
  });

}

function recarrega_consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  criar_candidato();
  $("#id_btn_filtrar").click(recarrega_consultar);
  set_cidades_do_estado('#id_estado', '#id_cidade');
});
