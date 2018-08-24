module.exports = function (app, gestorBD, gestorServer, traductor) {


    app.get("/", function (req, res) {
        res.status(200);
        res.json({
            msj : "Servidor de idiomas fncionando...\nAutor: Javier Castro\nProyecto: Trabajo de fin de carrera"
        });
    });
    app.get("/texto", function (req, res){
      var lv = parseInt(req.query.lv);
      var lang = req.query.lang;
        var criterio = {
            "nivel" : lv,
            "lang" : lang
        }
        //criterio = {}
    console.log(criterio);
        gestorBD.obtenerTextosNivel(criterio, function(textos){
            if(textos == null){
                var txts = [];
                //res.send(JSON.stringify(txts)); //Le mando un array vacio de datos, lo cual quiere decir que no se han encontrado textos de ese nivel.
                res.status(401);
                res.json({
                    error : "Error al obtener los textos del idioma " + lang + " del nivel " + lv
                });
            }else{
                //res.send(JSON.stringify(usuarios));
                //res.send(textos);
                console.log("No ha habido error en los textos:");
                console.log(textos);
                res.status(200);
                //res.send(JSON.stringify(textos));
                res.json({
                    textos : textos
                });
            }
        });
    });

    app.post("/texto", function (req, res) {
        /*
        {id : 1 , texto : "Hola mundo.", lang = "ES", nivel : 1}

         */

        var texto = req.body.texto;
        var nivel = req.body.lv;
        var idioma = req.body.lang;
        criterio = {
            nivel : nivel,
            lang : idioma
        }

        //criterio = {}
        gestorBD.obtenerTextosNivel(criterio, function (textos) {
            if(textos == null){
                res.status(401);
                res.json({
                    error : "No se han encotnrado textos de ese nivel."
                })
            }else {
                var id1 = 0, id2 = 0;
                var elem;
                var existe = false;
                for (var i = 0; i < textos.length && !existe; i++) {
                    elem = textos[i];
                    id2 = elem["id"];
                    if (id2 > id1)
                        id1 = id2;
                    console.log(elem["texto"] + " & " + texto);
                    if (elem["texto"] == texto) {
                        existe = true;
                    }
                }
                if (!existe) {
                    var newID = id1 + 1;
                    var nuevoTexto = {
                        id: newID,
                        texto: texto,
                        lang: idioma,
                        nivel: nivel
                    }
                    gestorBD.insertText(nuevoTexto, function (result) {
                        if (result == null) {
                            res.status(401);
                            res.json({
                                error: "Error al insertar el texto"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                msj: "Se ha insertado correctamente"
                            })
                        }
                    })
                } else{
                    res.status(401);
                    res.json({
                        error : "El mensaje ya existe"
                    })}

            }
        })
    })

    app.delete("/texto", function (req, res) {
        res.status(200)
        res.json({
            msj: "Esto debe borrar el texto que se indica y todas las traducciones en caso de haberlas. Mismo id."
        })
    });

    app.post("/identificarse", function (req, res) {
        //Esto sirve para identificarse como usuario y obtener los datos.
        //IMPORTANTE: La contraseña tiene que llegar cifrada.
        var email = req.body.email;
        var pass = req.body.pass;
        criterio = {
            email : email,
            pass : pass
        }
        gestorBD.obtenerDatosUsuario(criterio, function (result) {
            if(result == null){
                res.status(401);
                res.json({
                    error : "No se ha encontrado el usuario indicado."
                });
            }else{
                console.log("Usuario obtenido: ");
                console.log(result);
                res.status(200);
                var mauser = {
                    email : result[0]["email"],
                    pass : result[0]["pass"],
                    estadisticas : result[0]["estadisticas"]
                }
                //res.send(JSON.stringify(mauser));
                res.send(mauser);
            }
        });
    });
    app.post("/usuario", function(req, res){
        //Esto sirve para agregar un usuario nuevo a la base de datos.
        var email = req.body.email;
        var pass = req.body.pass;
        var estadisticas = {

        }
        var user = {
            email : email,
            pass : pass,
            estadisiticas : estadisticas
        }
        var criterio = {
            email : email
        }
        gestorBD.obtenerDatosUsuario(criterio, function (result) {

            if(result == null){
                res.status(401);
                res.json({
                    error : "Ha ocurrido un error al verificar si existe un usuario con el email: " + email
                })
            }else if(result.length == 0){
                console.log("No ha encontrado un usuario con ese email. Seguimos.")
                gestorBD.insertarUsuario(user, function (result) {
                    if(result == null){
                        res.status(401);
                        res.json({
                            error : "No se ha podido insertar el usuario en la base de datos."
                        })
                    }else{
                        res.status(200);
                        res.json({
                            msj : "El usuario se ha insertado correctamente.",
                            usuario : user
                        });
                    }
                });
            }else{
                res.status(401);
                res.json({
                    error : "Ya existe un usuario con el email: " + email
                })
            }
        });
    });

    app.put("/usuario", function (req, res) {
        var email = req.body.email;
        var pass = req.body.pass;
        var estadisticas = req.body.estadisticas;
        var criterio = {
            email : email,
            pass : pass
        }
        var user = {
            email : email,
            pass : pass,
            estadisticas : estadisticas
        }
        gestorBD.obtenerDatosUsuario(criterio, function (result) {
            if(result == null){
                res.status(401);
                res.json({
                    error : "Error al verificar que el usuario es el correcto"
                })
            }else if(result.length == 0){
                res.status(401);
                res.json({
                    error : "No se ha encontrado el usuario."
                })
            }else{
                gestorBD.actualizarUsuario(criterio, user, function (result) {
                    if(result == null){
                        res.status(401)
                        res.json({
                            error : "Error al momento de actualizar los datos del usuario"
                        })
                    }else{
                        res.status(200);
                        res.json({
                            msj : "Las estadísticas del usuario se han actualizado correctamente."
                        })
                    }
                })
            }
        });
    })
}