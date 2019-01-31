var config = require('../../server/config.json');
var request = require('request');
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

	Tbinvitados.eventos = function(cb) {
		var req = {
			uri: 'https://pretix.eu/api/v1/organizers/vun/events',
			method: 'GET',
			json: true,
			headers: {
				Authorization: 'Token wcml447dijrl522tngv833zadvg85mpd9ngg38j90ycx76oq877cju88rvdy67f4',
				'Content-Type': 'application/json'
			}
		};
		request(req,callback);
		function callback(error, response, body) {
			//console.log('error:', error); // Print the error if one occurred
		    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		    //console.log('body:', body);
		    cb(null, body);
		}		
	};

	Tbinvitados.remoteMethod(
		'eventos', {
			http: {
				path: '/eventos',
				verb: 'get'
			},
			returns: {
				root: true
			}
		}
	);
};
