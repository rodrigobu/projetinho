
var check_field = function(c) {
	c_id = $(c).attr('id');
	if (!$(c).is(":checked")){
		$('#' + c_id.replace('_disp', '_obr')).prop('checked',false);
		$('#' + c_id.replace('_disp', '_obr')).prop('disabled',true);
	} else {
		$('#' + c_id.replace('_disp', '_obr')).prop('disabled',false);
	}
};

$(function() {

	$('.vMarcar').on("click", function() {
		data_parent = $(this).attr('data-parent');
		$('#'+data_parent).find('input[type=checkbox]').each(function() {
			$(this).prop("checked", true);
		});
		$('#'+data_parent).find('.selector_obrigatorio').each(function() {
			$(this).prop('disabled', false);
		});
	});
	$('.vMarcarDisp').on("click", function() {
		data_parent = $(this).attr('data-parent');
		$('#'+data_parent).find('.selector_disponivel').each(function() {
			$(this).prop("checked", true);
		});
		$('#'+data_parent).find('.selector_obrigatorio').each(function() {
			$(this).prop('disabled', false);
		});
	});
	$('.vDesmarcar').on("click", function() {
		data_parent = $(this).attr('data-parent');
		$('#'+data_parent).find('input[type=checkbox]').each(function() {
			$(this).prop("checked", false);
		});
		$('#'+data_parent).find('.selector_obrigatorio').each(function() {
			$(this).prop('disabled', 'disabled');
		});
	});
	$('.vDesmarcarObr').on("click", function() {
		data_parent = $(this).attr('data-parent');
		$('#'+data_parent).find('.selector_obrigatorio').each(function() {
			$(this).prop("checked", false);
		});
	});


});
