var update_selected_fields = function() {
  var SELECTED_FIELDS = [];
  $.each($('#ul_groups :input.selected_group'), function(ids, input_group) {
    // checkbox ou hidden? se checkbox, está marcado?
    if ($(input_group).is('checkbox') & !$(input_group).is('checked'))
      return;
    var group_name = $(input_group).attr('name');
    var checked_fields = $(input_group).parent().siblings('.group_fields').find(':checkbox:checked');
    var checked_fields_names = $.map(checked_fields, function(chk, idx) {
      return $(chk).attr('name');
    }).join(',');
    if (checked_fields_names)
      SELECTED_FIELDS.push(group_name + ":" + checked_fields_names);
  });
  $('#id_REPORT_SELECTED_FIELDS').val(SELECTED_FIELDS.join('::'));
};

$(function() {

  $("#id_nome").click(function() {
    if ($("#id_nome").prop("checked") == false) {
      $("#id_nome_completo").removeAttr("disabled");
      $("#id_nome_completo").attr("checked", "true");
    } else {
      $("#id_nome_completo").removeAttr("checked");
      $("#id_nome_completo").attr("disabled", "true");
    }
  });

  $("#id_nome_completo").click(function() {
    if ($("#id_nome_completo").prop("checked") == false) {
      $("#id_nome").removeAttr("disabled");
      $("#id_nome").attr("checked", "true");
    } else {
      $("#id_nome").removeAttr("checked");
      $("#id_nome").attr("disabled", "true");
    }
  });

  $('.group_toggle').change(function() {
    var group_fields = $(this).parent().siblings('.group_fields');
    if ($(this).is(':checked')) {
      group_fields.removeClass('ui-helper-hidden');
      group_fields.find('span').find(':checkbox').prop("checked", true);
    } else {
      group_fields.addClass('ui-helper-hidden');
      group_fields.find('span').find(':checkbox').prop("checked", false);
    }
  });
  $('.group_toggle').change();

  $('#bt_submit_form, #bt_submiting_message, #bt_close_window').button();

  $(':checkbox.group_toggle,:checkbox.field_toggle').change(update_selected_fields);

  $('#ul_groups').sortable({
    items: 'li:not(.fixed_group)',
    update: function(event, ui) {
      update_selected_fields();
    }
  });

  $('#ul_groups').disableSelection();


});
