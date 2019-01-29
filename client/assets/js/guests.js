(function () {
  var app = {
    init: function () {
      app.get_guests();
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
          $('#all-guests table').appendChild('<tbody>' + app.add_item_guest(res) +'</tbody>');
          $('#all-guests table').removeClass('hidden');
        }
      });
    },

    add_item_guest: function(items) {
      console.dir(items);
      // $('#all-guests table tbody').appendChild(
      //   '<tr>' +
      //   '</tr>'
      // );
    }
  };

  $(document).ready(app.init);
})();