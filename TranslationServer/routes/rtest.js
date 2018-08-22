module.exports = function(app, gestorDB, traductor, gestorServer){
	app.get("/testObtenerTextos", function(req, res){
		var lv = req.query.lv;
		var lang = req.query.lang;
		criterio = {
			"nivel" : lv,
			"lang" : lang
		}
		gestorDB.obtenerTextosNivel(criterio, function(textos){
			if(textos == null){
				var txts = [];
				res.send(txts); //Le mando un array vacio de datos, lo cual quiere decir que no se han encontrado textos de ese nivel. 
			}else{
				res.send(textos);
			}
		});
	});
	app.get("/testObtenerLangCodes", function(req, res){
		var langs = gestorServer.getLangCode();
		res.send(langs);
		
	});
	
	app.get("/testTraduccion", function(req, res){
		var texto = req.query.texto;
		var lOrigen = req.query.lOrigen;
		var lDestino = req.query.lDestino;
		traductor.translateSometoOther(texto, lOrigen, lDestino, function(result){
			if(result == null){
				res.send("Ha ocurrido un error.");
			}else{
				res.send(result);
			}
		});
	});
}