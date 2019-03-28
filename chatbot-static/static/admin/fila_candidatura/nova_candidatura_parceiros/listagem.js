function criar_listagem(){
    TABELA_CONSULTA = $.DataTableXenon({
        json : URL_CONSULTA,
        container: "datatable_novacandidaturaparceiros",
        filterForm: '#filtro_consulta',
        aoColumns: [
        {
            "mData": TITULO_PARCEIRO,
            'orderable': true,
            'searchable': true,
            'class':'col-md-2',
            "mRender": function ( data, type, full ) {
                return full["parceiro"]
            }
        },
        {
            "mData": TITULO_VAGA,
            'orderable': true,
            'searchable': true,
            'class':'col-md-3',
            "mRender": function ( data, type, full ) {
                var HTML = '';
                HTML += '<span>(' + full["vaga_id"] + ') ' + full["vaga_desc"]+ '<br/></span>';
                HTML += "<span><b>" + TITULO_FUNCAO + ":</b>&nbsp;" + full["vaga_funcao"] + "<br/></span>";
                return HTML;
            }
        },
        {
            "mData": TITULO_CLIENTE,
            'orderable': true,
            'searchable': true,
            'class':'col-md-3',
            "mRender": function ( data, type, full ) {
                return '(' + full["cliente_id"] + ') '+ full["nome_fantasia"];
            }
        },
        {
            "mData": TITULO_CANDIDATO,
            'orderable': true,
            'searchable': true,
            'class':'col-md-3',
            "mRender": function ( data, type, full ) {
                return full["candidato"];
            }
        },
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
        },]
    });
}

function consultar(){
    TABELA_CONSULTA.reload();
}

$(function() {
    criar_listagem();
});
