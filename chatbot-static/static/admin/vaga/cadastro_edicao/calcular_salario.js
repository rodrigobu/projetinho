
var calcula_salario = function() {
    if ($("#id_tipo_salario").val() == '2' && $("#id_horas_mes").val() != "" && $("#id_valor_salario").val() != "") {
        var horas_no_mes = parseFloat($("#id_horas_mes").val());
        var valor_do_salario = parseFloat($("#id_valor_salario").val().replace(",", "."));
        var total = horas_no_mes * valor_do_salario;
        $("#id_total_salario").val(total.toFixed(2));
        $("#id_total_salario").val($("#id_total_salario").val().replace(".", ","));
        $("#id_total_salario").change();
    } else {
        $("#id_total_salario").val($("#id_valor_salario").val());
        $("#id_total_salario").change();
    }
};

var make_calcula_salario = function(){

      $("#id_valor_salario").blur(function() {
          calcula_salario();
      });

      // Inicia com o valor do salario ou o que veio no banco
      if ($("#id_total_salario").val() == "") {
          calcula_salario();
      }
      $("#id_tipo_salario").change(function() {
          calcula_salario();
      });
      $("#id_horas_mes").change(function() {
          calcula_salario();
      });

}
