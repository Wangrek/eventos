var config = require('../../server/config.json');
var path = require('path');
var md5 = require('md5');
var senderAddress = "abraham.saldivar@vun.mx";

module.exports = function(Tbinvitados) {
	//Manda credenciales de invitado a correo y guarda contraseña en md5
	Tbinvitados.observe('before save', function(ctx, next) {
		//GUARDAR
		if (ctx.instance) {
			Tbinvitados.app.models.Email.send({
				to: ctx.instance.usuario,
				from: senderAddress,
				subject: 'Credenciales de invitado',
				text: 'Usuario: ' + ctx.instance.usuario + '   ' + 'Contraseña: ' + ctx.instance.contrasenia,
			}, function(err, mail) {
				console.log('email sent!');
				cb(err);
			});
			ctx.instance.contrasenia = md5(ctx.instance.contrasenia);
		}
		next();
	});
};
