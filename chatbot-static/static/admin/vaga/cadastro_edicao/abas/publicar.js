var reativar_vaga_catho = function() {
  mostrarCarregando();
  $.ajax({
    url: URL_REATIVAR_CATHO,
    type: 'get',
    dataType: 'json',
    async: 'false',
    data: {},
    success: function(dados) {
      if (dados["status"] == 'ok') {
        $.dialogs.success(dados["msg"]);
        window.location.href = window.location.href;
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: function() {
      esconderCarregando();
    }
  });
};

var desativar_vaga_catho = function() {
  mostrarCarregando();
  $.ajax({
    url: URL_DESATIVAR_CATHO,
    type: 'get',
    dataType: 'json',
    async: 'false',
    data: {},
    success: function(dados) {
      if (dados["status"] == 'ok') {
        $.dialogs.success(dados["msg"]);
        window.location.href = window.location.href;
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: function() {
      esconderCarregando();
    }
  });
};

var exportar_vaga_catho = function() {
  mostrarCarregando();
  $.ajax({
    url: URL_PUBLICAR_CATHO,
    type: 'get',
    dataType: 'json',
    async: 'false',
    data: {},
    success: function(dados) {
      if (dados["status"] == 'ok') {
        $.dialogs.success(dados["msg"]);
        window.location.href = window.location.href;
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: function() {
      esconderCarregando();
    }
  });
};

var desativar_vaga_infojobs = function() {
  mostrarCarregando();
  $.ajax({
    url: URL_DESATIVAR_INFOJOBS,
    type: 'get',
    dataType: 'json',
    async: 'false',
    data: {},
    success: function(dados) {
      if (dados["status"] == 'ok') {
        $.dialogs.success(dados["msg"]);
        window.location.href = window.location.href;
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: function() {
      esconderCarregando();
    }
  });
};

var exportar_vaga_infojobs = function() {
  mostrarCarregando();
  $.ajax({
    url: URL_PUBLICAR_INFOJOBS,
    type: 'get',
    dataType: 'json',
    async: 'false',
    data: {},
    success: function(dados) {
      if (dados["status"] == 'ok') {
        $.dialogs.success(dados["msg"]);
        window.location.href = window.location.href;
      } else {
        $.dialogs.error(dados["msg"]);
      }
    },
    complete: function() {
      esconderCarregando();
    }
  });
};

$(function() {
  $("#bt_exportar_catho").click(exportar_vaga_catho);
  $("#bt_desativar_catho").click(desativar_vaga_catho);
  $("#bt_reativar_catho").click(reativar_vaga_catho);

  $("#bt_exportar_infojobs").click(exportar_vaga_infojobs);
  $("#bt_desativar_infojobs").click(desativar_vaga_infojobs);
});
