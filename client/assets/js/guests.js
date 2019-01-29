(function () {
  var app = {
    init: function () {
      app.interactions();
      app.get_guests();
    },

    interactions: function() {
      app.select_edit_button();
      app.select_delete_button();
    },

    // Obtiene la lista de invitados
    get_guests: function() {
      $.ajax({
        url: '/api/tb_invitados',
        method: 'GET',
        dataType: 'json',
        data: { access_token: $('#at').text() }
      }).done(function(res) {
        if (res.length < 1) {
          $('#all-guests > .alert').addClass('alert-info').removeClass('hidden');
        } else {
          $('#all-guests table tbody').remove();
          $('#all-guests table').append('<tbody>' + app.add_item_guest(res) +'</tbody>');
          $('#all-guests table').removeClass('hidden');
        }
      }).fail(function (er) {
        app.error_occurred(er.responseJSON.error.message);
      });
    },

    // Agrega todos los items para la lista de invitados
    add_item_guest: function(items) {
      var guests = '';

      items.forEach(function(val) {
        guests += '<tr>' +
          '<th class="guest-id-event" scope="row">'+ val.id_evento +'</th>' +
          '<td class="guest-user">' + val.usuario +'</td>' +
          '<td class="guest-name">' + val.nombre +'</td>' +
          '<td class="guest-surname">' + val.primer_apellido +'</td>' +
          '<td class="guest-sec-surname">' + val.segundo_apellido +'</td>' +
          '<td class="guest-total">' + val.no_invitados +'</td>'+
          '<td>' +
            '<button class="btn btn-info btn-edit" data-toggle="modal" data-target="#guest-modal" data-id="'+ val.id +'">' +
              '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
            '</button>' +
          '<button class="btn btn-danger btn-delete" data-toggle="modal" data-target="#confirm-delete-modal" data-id="' + val.id +'">' +
              '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +
            '</button>' +
          '</td>' +
        '</tr>';
      });

      return guests;
    },

    // Observa el pulsado de los botones editar
    select_edit_button: function() {
      $('#all-guests').on('click', '.btn-edit', function() {
        var id = parseInt($(this).attr('data-id'));

        $.ajax({
          url: '/api/tb_invitados/' + id,
          method: 'GET',
          dataType: 'json',
          data: { access_token: $('#at').text() }
        }).done(function(res) {
          for (var val in res) {
            $('.form-modal .form-control[name="' + val + '"]').val(res[val]);
          }
        }).fail(function (er) {
          app.error_occurred(er.responseJSON.error.message);
        });
      });

      // Observa el pulsado del botón guardar del form-modal
      $('#guest-modal .btn-save').on('click', function() {
        var id = parseInt($('#guest-modal .form-control[name="id"]').val());
        var inputsToChange = $('#guest-modal .form-control');
        var inputValues = {};

        for (var i=1; i <= inputsToChange.length - 1; i++) {
          inputValues[inputsToChange[i].name] = $('#guest-modal .form-control[name="' + inputsToChange[i].name +'"]').val();
        }
        inputValues.no_invitados = parseInt(inputValues.no_invitados);

        $.ajax({
          url: '/api/tb_invitados/' + id,
          method: 'PUT',
          dataType: 'json',
          data: inputValues
        }).done(function(res) {
          app.close_modal_and_update();
        }).fail(function(er) {
          app.error_occurred(er.responseJSON.error.message);
        });
      });
    },

    // Observa el pulsado de los botones eliminar
    select_delete_button: function() {
      // Observa el pulsado del botón eliminar
      $('#all-guests').on('click', '.btn-delete', function() {
        var id = parseInt($(this).attr('data-id'));

        $('#confirm-delete-modal .id-to-delete').text(id);
      });

      // Observa el pulsado del botón "Si" del modal
      $('#confirm-delete-modal .btn-confirm-delete').on('click', function () {
        var idToRemove = $('#confirm-delete-modal .id-to-delete').text();

        $.ajax({
          url: '/api/tb_invitados/' + idToRemove,
          method: 'DELETE',
          dataType: 'json',
          data: { access_token: $('#at').text() }
        }).done(function (res) {
          app.close_modal_and_update();
        }).fail(function (er) {
          app.error_occurred(er.responseJSON.error.message);
        });
      });
    },

    // Cierra los modales y actualiza la lista de invitados
    close_modal_and_update: function() {
      $('.modal').modal('hide');
      app.get_guests();
    },

    // Cierra los modales y abre uno nuevo de error
    error_occurred: function(message) {
      $('.modal').modal('hide');
      $('#error-modal p').text(message);
      $('#error-modal').modal('show');
    }
  };

  $(document).ready(app.init);
})();