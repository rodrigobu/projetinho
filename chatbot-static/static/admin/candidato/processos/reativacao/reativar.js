$(function() {

  $("[name='tipo_reativacao']").change(function() {

    if ($(this).val() == '0') {

      $("#id_candidato").attr('required',true);
      $("#id_dt_ini, #id_dt_fin, #id_data_inativo").removeAttr('required');
      $("#div_candidato").show();
      $("#div_datas").hide();
      $("#div_data").hide();
      $("#id_candidato").off('change');

    } else if ($(this).val() == '1') {

      $("#id_candidato, #id_data_inativo").removeAttr('required');
      $("#id_dt_ini, #id_dt_fin").attr('required',true);
      $("#div_candidato").hide();
      $("#div_datas").show();
      $("#div_data").hide();

    } else {

      $("#id_candidato, #id_data_inativo").attr('required',true);
      $("#id_dt_ini, #id_dt_fin").removeAttr('required');

      $("#div_candidato").show();
      $("#div_datas").hide();
      $("#div_data").show();
      $("#id_candidato").on('change', function() {
        $.ajax({
          url: URL_GET_DATA_REATIVACAO,
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            codigo: $("#id_candidato").val()
          },
          success: function(dados) {
            $("#id_data_inativo").val(dados['data'])
          }
        });
      });
      $("#id_candidato").change();

    }
    $("#div_btn_reativar").show();
  });
  $("[name='tipo_reativacao']:first").click();



  var data_minima = new Date(Date.now());
  $("#id_data_inativo").datepicker('setStartDate', data_minima);

  datas_menor_e_maior("#id_dt_ini", "#id_dt_fin");

})
