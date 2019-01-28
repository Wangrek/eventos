var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Tbinvitados) {

	Tbinvitados.observe('before save', function(ctx, next) {
		Tbinvitados.app.models.Email.send({
			to: 'nakluv@hotmail.com',
			from: 'abraham.saldivar@vun.mx',
			subject: 'Credenciales de invitado',
			text: 'Usuario: ' + ctx.instance.usuario + '   ' + 'Contraseña: ' + ctx.instance.contrasenia,
		}, function(err, mail) {
			console.log('email sent!');
			cb(err);
		});
		//ctx.instance.contrasenia = 'perro';
		next();
	});
};
