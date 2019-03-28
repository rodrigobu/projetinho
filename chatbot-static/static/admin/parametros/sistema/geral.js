var alternaAbas = function() {
  if($(window).width() >= 769) {
      $('#myTab').removeClass('nav-tabs').removeClass('nav-tabs-justified');
      $('#tabs-vertical-class').addClass('tabs-vertical-env');
      $('#myTab').addClass('tabs-vertical');
  } else if($(window).width() < 769){
      $('#tabs-vertical-class').removeClass('tabs-vertical-env');
      $('#myTab').removeClass('tabs-vertical');
      $('#myTab').addClass('nav-tabs').addClass('nav-tabs-justified');
  }
}
