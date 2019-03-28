$(function() {


  // Poppover do menu de contato
  $('#menu_contato').popover({
    content: "<div class='container' style='text-indent: 0px; font-size: 12px; width: auto;'>" + TXT_SITE + ":<br>" +
      "<a style='font-size: 12px;' href='" + URL_SITE_CLIENTE_LINK + "' target='_blank'>" +
      URL_SITE_CLIENTE +
      "</a> <br>" +
      TXT_TELEFONE + ": " + TELEFONE_CLIENTE +
      "</div> ",
    html: true,
    placement: 'bottom',
    container: 'body',
    trigger: 'click',
  });

  $(document).on('click', function(e) {
    $('[data-toggle="popover"],[data-original-title]').each(function() {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
      }
    });
  });

});
