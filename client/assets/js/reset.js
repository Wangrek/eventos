(function () {
  var app = {
    init: function () {
      app.interactions();
    },

    interactions: function () {
      app.validate_login();
    },

    validate_login: function () {
      var $email = $('#reset-email');
      var $submit = $('button[type="submit"]');

      // Se valida el email al refrescarse la web
      if (app.validate_email($email.val())) {
        $submit.attr('disabled', false);
      } else {
        $submit.attr('disabled', true);
      }

      // Valida el email cada que se presiona una tecla
      $email.keyup(function () {
        $('.invalid-text').remove();

        if ( app.validate_email($email.val()) ) {
          $email.removeClass('is-invalid');
          $submit.attr('disabled', false);
        } else {
          $email.addClass('is-invalid');
          $email.parent().append('<small class="invalid-text">Por favor ingresa un correo electrónico válido</small>');
          $submit.attr('disabled', true);
        }
      });
    },

    validate_email: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  };

  $(document).ready(app.init);
})();