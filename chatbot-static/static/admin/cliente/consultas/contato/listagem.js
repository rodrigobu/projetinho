function criar_listagem(){
    TABELA_CONSULTA = $.DataTableXenon({
        json : URL_CONSULTA,
        container: "datatable_contato",
        filterForm: '#filtro_consulta',
        order: [
          [1, "asc"]
        ],
        aoColumns: [
        {
            "mData": TITULO_ACOES,
            'orderable': false,
            'searchable': false,
            'class':'col-md-1 text-center big_icons',
            "mRender": function ( data, type, full ) {
                var HTML = ''
                HTML += '<a href="' + URL_EDIT_VAGA + full["vaga_slug"] + '" type="button" class="btn btn-md btn-default btn-gray"><i class="fa fa-share"></i> <span class="bigger-110">'+ TITULO_VAGA +'</span></a>';
                return HTML;
            }
        },
        {
            "mData": TITULO_CLI,
            'orderable': true,
            'searchable': true,
            'class':'col-md-3',
            "mRender": function ( data, type, full ) {
                return '(' + full["cliente_id"] + ') '+ full["nome_fantasia"];
            }
        },
        {
            "mData": TITULO_RESP,
            'orderable': true,
            'searchable': true,
            'class':'col-md-2',
            "mRender": function ( data, type, full ) {
                return full["resp"]
            }
        },
        {
            "mData": TITULO_HIST,
            'orderable': true,
            'searchable': true,
            'class':'col-md-3',
            "mRender": function ( data, type, full ) {
                return full["hist"]
            }
        },
        {
            "mData": TITULO_OCO,
            'orderable': true,
            'searchable': true,
            'class':'col-md-3',
            "mRender": function ( data, type, full ) {
                return full["oco"]
            }
        },]
    });
}

function consultar(){
    TABELA_CONSULTA.reload();
}

$(function() {
    criar_listagem();
});
