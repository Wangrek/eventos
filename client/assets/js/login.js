(function() {
  var app = {
    init: function () {
      app.interactions();
    },

    interactions: function() {
      app.validate_login();
    },

    validate_login: function() {
      var $email = $('#login-email');
      var $pass = $('#login-password');
      var $submit = $('button[type="submit"]');

      // Se desabilita el botón por si se refresca la página
      $submit.attr('disabled', 'disabled');

      // Valida la entrada del email cuando pierde su foco
      $email.focusout(function() {
        $('.invalid-text').remove();

        if (!app.validate_email($email.val())) {
          $email.addClass('is-invalid');
          $email.parent().append('<small class="invalid-text">Por favor ingresa un correo electrónico válido</small>');
        } else {
          $email.removeClass('is-invalid');
        }
      });

      // Valida las entradas del login cada que se presiona una tecla
      $('#login-email, #login-password').keyup(function() {
        if (app.validate_email($email.val()) && $pass.val().length > 5) {
          $('#login-email, #login-password').removeClass('is-invalid');
          $('.invalid-text').remove();
          $submit.attr('disabled', false);
        } else { $submit.attr('disabled', true); }
      });
    },

    validate_email: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  };

  $(document).ready(app.init);
})();