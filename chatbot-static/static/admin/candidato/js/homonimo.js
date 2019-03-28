function checarHomonimo(e) {
	if (!e)
		return;

	candidato = $('#id_codigo').val()
	var TABELA_CONSULTA_HOMON = undefined;

	TABELA_CONSULTA_HOMON  = $.DataTableXenon({
        json : URL_CAND_CHECAR_HOMONIMO +'?c='+candidato+'&n='+e,
        container: "tbl_homonimo_candidato_modal",
		paging: false,
		searching: false,
        filterForm: '#filtro_consulta',
        order: [[ 0, "desc" ]],
        aoColumns: [
			{
		        "mData": CODIGO,
		        'orderable': true,
		        'searchable': true,
		        'class':'col-md-1',
		        "mRender": function ( data, type, full ) {
		            return full["c"];
		        }
		    },
		    {
		        "mData": NOME,
		        'orderable': true,
		        'searchable': true,
		        'class':'col-md-3',
		        "mRender": function ( data, type, full ) {
		            return full["n"];
		        }
		    },
			{
		        "mData": DT_CAD,
		        'orderable': true,
		        'searchable': true,
		        'class':'col-md-2',
		        "mRender": function ( data, type, full ) {
		            return full["dtc"];
		        }
		    },
			{
		        "mData": CPF,
		        'orderable': true,
		        'searchable': true,
		        'class':'col-md-2',
		        "mRender": function ( data, type, full ) {
		            return full["cpf"];
		        }
		    },
			{
		        "mData": DT_NASC,
		        'orderable': true,
		        'searchable': true,
		        'class':'col-md-2',
		        "mRender": function ( data, type, full ) {
		            return full["dtn"];
		        }
		    },
			{
		        "mData": IDADE,
		        'orderable': true,
		        'searchable': true,
		        'class':'col-md-1',
		        "mRender": function ( data, type, full ) {
		            return full["i"];
		        }
		    },
			{
		        "mData": ESCOL,
		        'orderable': true,
		        'searchable': true,
		        'class':'col-md-1',
		        "mRender": function ( data, type, full ) {
		            return full["e"];
		        }
		    },
		    {
		        "mData": ACOES,
		        'orderable': false,
		        'searchable': false,
		        'class':'col-md-1 text-center',
		        "mRender": function ( data, type, full ) {
		            return '<a href="/admin/candidato/edicao/'+full["s"]+'" title="Selecionar candidatdo" class="text-gray" >'
		            +' <i class="fa fa-plus"></i>'
		            +'</a>'
		        }
		    }
		]
    });

	$('#id_dialog_homonimo').modal('show', {backdrop: 'fade'});
};
