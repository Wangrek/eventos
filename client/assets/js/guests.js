(function () {
  var app = {
    init: function () {
      app.interactions();
      app.get_guests();
    },

    interections: function() {
      $('#all-guests .btn-info')
    },

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
          $('#all-guests table').append('<tbody>' + app.add_item_guest(res) +'</tbody>');
          $('#all-guests table').removeClass('hidden');
        }
      });
    },

    add_item_guest: function(items) {
      var guests = '';

      items.forEach(function(val) {
        guests += '<tr>' +
          '<th scope="row">'+ val.id_evento +'</th>' +
          '<td>' + val.usuario +'</td>' +
          '<td>' + val.nombre +'</td>' +
          '<td>' + val.primer_apellido +'</td>' +
          '<td>' + val.segundo_apellido +'</td>' +
          '<td>' + val.no_invitados +'</td>'+
          '<td>' +
            '<button class="btn btn-info" data-toggle="modal" data-target="#guest-modal" data-id="'+ val.id +'">' +
              '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
            '</button>' +
          '<button class="btn btn-danger" data-toggle="modal" data-target="#confirm-delete-modal" data-id="' + val.id +'">' +
              '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +
            '</button>' +
          '</td>' +
        '</tr>';
      });

      return guests;
    },

    fill_modal: function() {
      // $('.form-modal .form-control[name="usuario"]').val()
    }
  };

  $(document).ready(app.init);
})();