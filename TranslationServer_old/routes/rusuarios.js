module.exports = function(app, gestorDB){
		app.get("/usuario", function(req, res){
			var idUsuario = req.query.id;
			criterio = {
				"id" : idUsuario
			}
			gestorDB.obtenerDatosUsuario(criterio, function(data){
				if(data == null){
					res.send("Error al obtener los datos del usuario.");
				}else{
					res.send(data);
				}
			});
		});
		
		
}
