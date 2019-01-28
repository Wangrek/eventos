(function () {
  var app = {
    init: function () {
      app.interactions();
    },

    interactions: function () {
      app.validate_register();
    },

    validate_register: function () {
      var $email = $('#register-email');
      var $pass = $('#register-password');
      var $passAgain = $('#register-password-again');
      var $submit = $('button[type="submit"]');

      // Se desabilita el botón por si se refresca la página
      $submit.attr('disabled', 'disabled');

      // Valida la entrada del email cuando pierde su foco
      $email.focusout(function () {
        $email.parent().find('.invalid-text').remove();

        if (!app.validate_email($email.val())) {
          $email.addClass('is-invalid');
          $email.parent().append('<small class="invalid-text">Por favor ingresa un correo electrónico válido</small>');
        } else {
          $email.removeClass('is-invalid');
        }
      });

      // Valida la entrada del password cuando pierde su foco
      $pass.bind('focusout, keyup', function() {
        $pass.parent().find('.text-help').remove();
        $pass.parent().find('.invalid-text').remove();

        if ($pass.val().length < 6) {
          $pass.addClass('is-invalid');
          $pass.parent().append('<small class="invalid-text">La contraseña debe contener al menos 6 caractéres</small>');
        } else {
          $pass.removeClass('is-invalid');
          $pass.parent().append('<small class="text-help">La contraseña debe contener al menos 6 caractéres</small>');
        }
      });

      // Valida la entrada de los dos passwords al presionar una tecla
      $passAgain.keyup(function() {
        $passAgain.parent().find('.text-help').remove();
        $passAgain.parent().find('.invalid-text').remove();

        if ($pass.val() !== $passAgain.val()) {
          $passAgain.addClass('is-invalid');
          $passAgain.parent().append('<small class="invalid-text">La contraseña debe contener al menos 6 caractéres</small>');
        } else {
          $passAgain.removeClass('is-invalid');
          $passAgain.parent().append('<small class="text-help">La contraseña debe contener al menos 6 caractéres</small>');
        }
      });

      // Valida las entradas del registro cada que se presiona una tecla
      $('#register-email, #register-password, #register-password-again').keyup(function () {
        if (app.validate_email($email.val()) && $pass.val().length > 5 && $passAgain.val().length > 5) {
          $('#register-email, #register-password, #register-password-again').removeClass('is-invalid');
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