// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var config = require('../../server/config.json');
var path = require('path');
var senderAddress = "abraham.saldivar@vun.mx"; //Replace this address with your actual address

module.exports = function(User) {
  //send verification email after registration
  User.afterRemote('create', function(context, user, next) {
    var options = {
      type: 'email',
      to: user.email,
      from: senderAddress,
      subject: 'Gracias por registrarte.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user
    };

    user.verify(options, function(err, response) {
      if (err) {
        User.deleteById(user.id);
        return next(err);
      }
      context.res.render('response', {
        title: 'Registrado exitosamente.',
        content: 'Por favor verifica tu correo y da clic en la liga de verificación ' +
            'antes de entrar al sistema.',
        redirectTo: '/',
        redirectToLinkText: 'Entrar'
      });
    });
  });
  
  // Method to render
  User.afterRemote('prototype.verify', function(context, user, next) {
    context.res.render('response', {
      title: 'Una liga para verificar tu identidad ha sido enviada '+
        'a tu correo exitosamente',
      content: 'Por favor verifica tu correo y da clic en la liga de verificación '+
        'antes de entrar al sistema.',
      redirectTo: '/',
      redirectToLinkText: 'Entrar'
    });
  });

  //send password reset link when requested
  User.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Clic <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> para resetear tu contraseña';

    User.app.models.Email.send({
      to: info.email,
      from: senderAddress,
      subject: 'Contraseña reseteada',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  //render UI page after password change
  User.afterRemote('changePassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Contraseña cambiada exitosamente',
      content: 'Por favor entra al sistema con tu nueva contraseña',
      redirectTo: '/',
      redirectToLinkText: 'Entrar'
    });
  });

  //render UI page after password reset
  User.afterRemote('setPassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Contraseña reseteada exitosamente',
      content: 'Tu contraseña ha sido reseteada exitosamente',
      redirectTo: '/',
      redirectToLinkText: 'Entrar'
    });
  });
};
