module.exports = function(app, gestorDB){
	app.get("/saludaTraductor", function(req, res){
		res.send("Hola, soy el modulo de gestion de textos de la base de datos.");
	});
	
	app.get("/text", function(req, res){
		var lv = req.query.lv; 
		var lang = req.query.lang; 
		var criterio = {
			"nivel" : lv,
			"lang" : lang
		}
		
		gestorDB.obtenerTextosNivel(criterio, function(textos){
			if(textos == null){
				var txts = [];
				res.send(txts); //Le mando un array vacio de datos, lo cual quiere decir que no se han encontrado textos de ese nivel. 
			}else{
                //res.send(JSON.stringify(usuarios));
				res.send(textos);
				//res.send(JSON.stringify((textos)));
			}
		});
		/*
		var txt = {
			contenido : "Hola Mundo",
			nivel: "1",
			lang: "ES"
		}
		gestorDB.insertText(txt, function(id){
			if(id == null){
				res.send("No se ha insertado el texto.");
			}else{
				res.send("Nuevo texto agregado!.");
			}
		})
		*/
	});

}