function criar_listagem(){
    TABELA_CONSULTA = $.DataTableXenon({
        json : URL_CONSULTA,
        container: "datatable_novacandidatura",
        filterForm: '#filtro_consulta',
        aoColumns: [
        {
            "mData": TITULO_VAGA,
            'orderable': true,
            'searchable': true,
            'class':'col-md-5',
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
            'class':'col-md-5',
            "mRender": function ( data, type, full ) {
                return '(' + full["cliente_id"] + ') '+ full["nome_fantasia"];
            }
        },
        {
            "mData": TITULO_ACOES,
            'orderable': false,
            'searchable': false,
            'class':'col-md-2 text-center big_icons',
            "mRender": function ( data, type, full ) {
                var HTML = ''
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
