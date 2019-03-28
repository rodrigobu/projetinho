var render_proc_sel = function(data, type, full) {
  var HTML = '';
  if(full["esta_no_proc_sel"]){
     HTML += "<i class='fa-check-square  text-success'></i> <span>Sim</span>";
  }
  return HTML;
};

var render_data = function(data, type, full) {
  var HTML = '';
  HTML += "<span value=" + full["dt_candidatura_us"] + ">" + full["dt_candidatura"] + "</span>";
  return HTML;
};

function criar_proc_sel() {
  TABELA_CONSULTA = $.DataTableXenon({
    json: URL_PROC_SEL_JSON,
    container: "datatable_proc_sel",
    filterForm: '#filtro_consulta',
    aoColumns: [{
        "mData": TXT_COL_VAGA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-4 col-xs-11',
        "mRender": function(data, type, full) {
          var HTML = "<a valor=\""+full["vaga_desc"] + " (" + TXT_COL_COD + " " + full["vaga_id"] + ")\" href='"+ URL_VER_VAGA + full["vaga_slug"] +"'>" +full["vaga_desc"] + " (" + TXT_COL_COD + " " + full["vaga_id"] + ") </a>";
          HTML += "<span class='hidden-md-up'><br/><b>" + TXT_COL_CIDADE + ":</b>&nbsp;" + full["vaga_cidade"] + "</span>";
          HTML += "<span class='hidden-md-up'><br/><b>" + TXT_COL_PROC_SEL + ":</b>&nbsp;" + render_proc_sel(data, type, full) + "</span>";
          HTML += "<span class='hidden-md-up'><br/><b>" + TXT_COL_DATA + ":</b>&nbsp;" + render_data(data, type, full) + "</span>";
          HTML += "<span class='hidden-md-up'><br/><b>" + TXT_COL_STATUS + ":</b>&nbsp;" + full["status_desc"] + "</span>";
          return HTML;
        }
      },
      {
        "mData": TXT_COL_CIDADE,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 hidden-xs',
        "mRender": function(data, type, full) {
          return full["vaga_cidade"];
        }
      },
      {
        "mData": TXT_COL_PROC_SEL,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 text-center hidden-xs',
        "mRender": render_proc_sel
      },
      {
        "mData": TXT_COL_DATA,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 text-center hidden-xs',
        "mRender": render_data
      },
      {
        "mData": TXT_COL_STATUS,
        'orderable': true,
        'searchable': true,
        'class': 'col-sm-2 text-center  hidden-xs',
        "mRender": function(data, type, full) {
          return full["status_desc"];
        }
      },
    ]
  });
}

function ver_vaga(slug_registro) {
  window.location.href = URL_VER_VAGA + slug_registro + '/';
}

function consultar() {
  TABELA_CONSULTA.reload();
}

$(function() {
  $("#id_btn_filtrar").click(consultar);
  criar_proc_sel();
});
