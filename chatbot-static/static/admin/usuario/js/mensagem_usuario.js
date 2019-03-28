function criar_listagem(){
    TABELA_CONSULTA = $.DataTableXenon({
        json : URL_CONSULTA,
        container: "datatable_mensagem",
        filterForm: '#filtro_consulta',
        order: [[ 5, "asc" ], [ 1, "desc" ], [ 2, "desc" ], [ 3, "desc" ]],
        aoColumns: [
        {
            "mData": TITULO_ACOES,
            'orderable': false,
            'searchable': false,
            'class':'col-md-1 text-center big_icons',
            "mRender": function ( data, type, full ) {
                var HTML = ''
                HTML += '<a title="'+TITULO_DETALHE+'" target="_blank" class="text-gray" style="cursor: pointer;" onclick="detalhes_mensagem(\''+full["slug"]+'\')"><i class="'+ICON_DETALHE+'"></i></a>';
                HTML += '<a title="'+TITULO_MAIL+'" class="text-gray" style="cursor: pointer;" href="'+URL_MAIL+full["reid"]+'"><i class="'+ICON_MAIL+'"></i></a>';
                return HTML;
            }
        },
        {
            "mData": TITULO_DATA,
            'orderable': true,
            'searchable': true,
            'class':'col-md-1',
            "mRender": function ( data, type, full ) {
                return full['d'];
            }
        },
        {
            "mData": TITULO_HORA,
            'orderable': true,
            'searchable': true,
            'class':'col-md-1',
            "mRender": function ( data, type, full ) {
                return full['h'];
            }
        },
        {
            "mData": TITULO_REMETENTE,
            'orderable': true,
            'searchable': true,
            'class':'col-md-3',
            "mRender": function ( data, type, full ) {
                return full['re'];
            }
        },
        {
            "mData": TITULO_MENSAGEM,
            'orderable': true,
            'searchable': true,
            'class':'col-md-5',
            "mRender": function ( data, type, full ) {
                return full['msg'];
            }
        },
        {
            "mData": TITULO_LIDO,
            'orderable': true,
            'searchable': true,
            'class':'col-md-1',
            "mRender": function ( data, type, full ) {
                return full['lido'];
            }
        },
        ]
    });
}

function consultar(){
    TABELA_CONSULTA.reload();
}

function detalhes_mensagem(slug_registro){
    $.ajax({
        url : URL_DETALHES,
        dataType : 'json',
        type : 'get',
        data : { num : slug_registro },
        success : function(retorno) {
            $("#mensagem_modal_body").html(retorno['html']);
            jQuery('#id_dialog_mensagem').modal('show', {backdrop: 'fade'});
        }
    });
}

$(function() {
    criar_listagem();
});
