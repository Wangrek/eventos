(function () {
  var app = {
    init: function () {
      app.interactions();
      app.get_guests();
    },

    interactions: function() {
      app.select_edit_button();
      app.select_delete_button();
      app.select_event_dropdown();
      app.add_new_guest();
      app.add_new_event();
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

    // Eventos para agregar un nuevo invitado
    add_new_guest: function() {
      $('.adds .add-guest').on('click', function() {
        var selectOptions = "";

        if (!$('#collapse-guest').hasClass('in')) {
          $('.collapse').collapse('hide');
        }

        // Resetea todas las opciones de los eventos
        $('#id_evento ul li').remove();

        // Hace una petición para obtener todos los eventos
        if (!$('#collapse-guest').hasClass('in')) {
          $.ajax({
            url: '/api/tb_invitados/eventos',
            method: 'GET',
            dataType: 'json',
            data: { access_token: $('#at').text() }
          }).done(function (res) {
            // Lena todos los options de acuerdo al response del request
            res.results.forEach(function (val) {
              selectOptions += '<li><a href="#" data-value="' + val.slug + '">' + val.name.es + '</a></li>';
            });
            // Agregar el id a un input oculto
            $('#id_evento input').val(res.results[0].slug);
            $('#id_evento .dropdown-toggle')
              .text(res.results[0].name.es)
              .append('<span class="caret"></span>');

            $('#id_evento ul').append(selectOptions);
            $('#id_evento ul li:first-child').addClass('active');
            $('#id_evento').removeClass('hidden');
          }).fail(function (er) {
            console.dir(er)
            app.error_occurred(er.responseJSON.error.message);
          });
        }
      });

      $('#collapse-guest form').submit(function(e) {
        e.preventDefault();

        var guestInputs = $('#collapse-guest form').serializeArray();
        var guestData = {}

        guestInputs.forEach(function(val) {
          guestData[val.name] = val.value;
        });
        guestData.no_invitados = parseInt(guestData.no_invitados);
        guestData.access_token = $('#at').text();

        $.ajax({
          url: '/api/tb_invitados',
          method: 'POST',
          dataType: 'json',
          data: guestData
        }).done(function(res) {
          app.add_alert('#alerts-guest', 'success', '¡El invitado fué agregado exitosamente!');
          app.get_guests();
        }).fail(function(er) {
          app.add_alert('#alerts-guest', 'danger', '¡No se pudo agregar al invitado!, por favor revise los datos');
        });
      });
    },

    // Eventos para agregar un nuevo evento
    add_new_event: function () {
      $('#date').datepicker();
      $('#limit-date').datepicker();

      $('.adds .add-event').on('click', function () {
        if (!$('#collapse-event').hasClass('in')) {
          $('.collapse').collapse('hide');
        }
      });

      $('#collapse-event form').submit(function (e) {
        e.preventDefault();

        var eventInputs = $('#collapse-event form').serializeArray();
        var eventData = {}

        eventInputs.forEach(function (val) {
          eventData[val.name] = val.value;
        });

        // Trandformar texto del date a formato JS
        var regD = /^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/;
        var date = $('#date').val().replace(regD, "$2$1$3");
        var limitDate = $('#limit-date').val().replace(regD, "$2$1$3");

        // Llenado de fechas
        eventData.fecha_evento = new Date(date);
        eventData.fecha_limite = new Date(limitDate);

        // Llenado de atributos faltantes
        eventData.limite_invitaciones = parseInt(eventData.limite_invitaciones);
        eventData.access_token = $('#at').text();

        $.ajax({
          url: '/api/tb_invitados/crearEvento',
          method: 'POST',
          dataType: 'json',
          data: eventData
        }).done(function (res) {
          app.add_alert('#alerts-event', 'success', '¡El evento fué agregado exitosamente!');
          app.get_guests();
        }).fail(function (er) {
          app.add_alert('#alerts-event', 'danger', '¡No se pudo agregar el evento!, por favor revise los datos');
        });
      });
    },

    // Observa la selección del dropdown de eventos
    select_event_dropdown: function() {
      $('#id_evento ul').on('click', 'li > a', function(e) {
        e.preventDefault();
        // Agregar el id a un input oculto
        $('#id_evento input').val($(this).attr('data-value'));
        $('#id_evento .dropdown-toggle')
          .text($(this).text())
          .append('<span class="caret"></span>');

        $('#id_evento ul li').removeClass('active');
        $(this).parent().addClass('active');
      })
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
        inputValues.access_token = $('#at').text();

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
    },

    add_alert: function(el, type, message) {
      $(el).append(
        '<div class="alert alert-'+ type +' alert-dismissible fade in">' +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' +
          '<p>'+ message +'</p>' +
        '</div>'
      );
    }
  };

  $(document).ready(app.init);
})();