var resultado = undefined;
var PROFILE_LINKEDIN = undefined;
var LISTA_CAMPOS_LINKEDIN = [
  "id", "formatted-name", "pictureUrl", "publicProfileUrl",
  "phone-numbers",
  "main-address", "location", "positions", "email-address", "date-of-birth", "languages",
  "educations", "courses"
];

var efetuar_integracao_linkedin = function() {
  $("#id_importado_linkedin").val("true");
  IN.User.logout();
  IN.UI.Authorize().place();
  IN.Event.on(IN, "frameworkLoaded", function() {
    $('a[id*=li_ui_li_gen_]').html(URL_IMG);
  });
  IN.Event.on(IN, "systemReady", function() {
    $('a[id*=li_ui_li_gen_]').html(URL_IMG);
  });
}

function onLinkedInLoad() {
  if (!IMPORTADO_LINKEDIN) {
    IN.Event.on(IN, "auth", function() {
      if ($("#id_importado_linkedin").val() == 'true') {
        onLinkedInLogin();
      }
    });
  } else if (IMPORTADO_LINKEDIN) {
    IN.Event.on(IN, "auth", function() {
      onLinkedInLogin();
    });
    $("#id_linkedin").hide();
  }
}

function onLinkedInLogout() {
  IN.User.logout();
}

function onLinkedInLogin() {
  // we pass field selectors as a single parameter (array of strings)
  PROFILE_LINKEDIN = IN.API.Profile("me");
  PROFILE_LINKEDIN.fields(LISTA_CAMPOS_LINKEDIN).result(function(result) {
    resultado = result.values[0];
    // Nome e Foto
    $("#id_nome").val(resultado.formattedName);
    $("#id_foto").attr('src', resultado.pictureUrl);
    $("#url_foto").val(resultado.pictureUrl);

    // Site
    $("#id_site").val(resultado.publicProfileUrl);

    // Importar Experiências Profissionais
    $.each(resultado.positions.values, function(idx, value) {
      abrir_form_nova_experiencia(function() {
        indice = INDICE_EXPERIENCIA - 1;
        $("#id_experiencia_empresa_" + indice).val(value.company.name);
        $("#id_experiencia_funcao_ini_" + indice).val(value.title);
        $("#id_experiencia_realizacao_" + indice).val(value.summary);
      });
    });

    try { // tentaiva de captação do estado
      names_add = resultado.location.name.split(' ')
      estado = names_add[0].substring(0, 1) + names_add[1].substring(0, 1);
      $("#id_estado").val(estado);
    } catch (e) {}

    if (resultado.emailAddress) {
      $("#id_email").val(resultado.emailAddress);
    }

    if (resultado.mainAddress) {
      $("#id_endereco").val(resultado.mainAddress);
    }

    if (resultado.dateOfBirth) {
      var dia = resultado.dateOfBirth.day.toString();
      if (dia && dia.length == 1) {
        dia = '0';
        dia += resultado.dateOfBirth.day.toString();
      }
      var mes = resultado.dateOfBirth.month.toString();
      if (mes && mes.length == 1) {
        mes = '0';
        mes += resultado.dateOfBirth.month.toString();
      }
      var ano = '';
      if (resultado.dateOfBirth.year) {
        ano = resultado.dateOfBirth.year.toString();
      }
      $("#id_dt_nasc").val(dia + mes + ano);
    }

    if (resultado.phoneNumbers) {
      if (resultado.phoneNumbers.values) {
        var numero = resultado.phoneNumbers.values[0].phoneNumber;
        if (numero.length <= 9) {
          $("#id_telefone").val(numero);
        } else if (numero.length >= 11) {
          $("#id_ddd").val(numero.substring(0, 2));
          $("#id_telefone").val(numero.substring(2, numero.length));
        }
      }
    }

    $("#id_importado_linkedin").val("true");
    $.dialogs.warning(TXT_LINKED_ALERT_TITLE, TXT_LINKED_ALERT_MSG);
    $('#id_linkedin').hide();
  }).error(function(err) {
    alert(err);
  });
}

$(function() {

  $("#img_linkedin").on('click', efetuar_integracao_linkedin);

  $("#sair").on("click", function() {
    if (IN.User.isAuthorized()) {
      IN.User.logout();
    }
  });

});
