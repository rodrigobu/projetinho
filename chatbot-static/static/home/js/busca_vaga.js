$(function() {
  $("#id_localidade").select2({
    minimumInputLength: 3,
    dropdownAutoWidth: true,
    allowClear: true,
    language: 'pt-BR',
    ajax: {
      url: URL_SITE_CLIENTE_LINK,
      dataType: 'json',
      data: function(term, page) {
        return {
          limit: -1,
          q: term
        };
      },
      results: function(data, page) {
        return {
          results: data
        }
      }
    },
    formatResult: function(objeto) {
      return objeto.name
    },
    formatSelection: function(objeto) {
      return objeto.name;
    },
  });
})
