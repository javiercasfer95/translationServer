module.exports = function (app, gestorBD, gestorServer, traductor, limitless, isoCodes) {


    app.get("/", function (req, res) {
        res.status(200);
        res.json({
            msj: "Servidor de idiomas funcionando...",
            autor: "Autor: Javier Castro",
            Proyecto: "Proyecto: Trabajo de fin de carrera"
        });
    });
    app.get("/texto", function (req, res) {
        var lv = parseInt(req.query.lv);
        var lang = req.query.lang;
        var criterio = {
            "nivel": lv,
            "lang": lang
        }
        //criterio = {}
        console.log(criterio);
        gestorBD.obtenerTextos(criterio, function (textos) {
            if (textos == null) {
                var txts = [];
                //res.send(JSON.stringify(txts)); //Le mando un array vacio de datos, lo cual quiere decir que no se han encontrado textos de ese nivel.
                res.status(401);
                res.json({
                    error: "Error al obtener los textos del idioma " + lang + " del nivel " + lv
                });
            } else if (textos.length == 0) {
                res.status(200);
                res.json({
                    msj: "No se han encontrado textos."
                });
            } else {
                //res.send(JSON.stringify(usuarios));
                //res.send(textos);
                console.log("No ha habido error en los textos:");
                console.log(textos);
                res.status(200);
                //res.send(JSON.stringify(textos));
                res.json({
                    textos: textos
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
            nivel: nivel,
            lang: idioma
        }

        //criterio = {}
        gestorBD.obtenerTextos(criterio, function (textos) {
            //En este comprobar que el resultado texto.length = 0 no es necesario.
            if (textos == null) {
                res.status(401);
                res.json({
                    error: "No se han encotnrado textos de ese nivel."
                });
            } else {
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
                } else {
                    res.status(401);
                    res.json({
                        error: "El mensaje ya existe"
                    })
                }

            }
        })
    })

    app.delete("/texto", function (req, res) {
        var texto = req.query.texto;
        var nivel = parseInt(req.query.lv);
        var lang = req.query.lang;
        var mitexto = {}
        if (texto == null || nivel == null || lang == null) {
            res.status(401);
            res.json({
                msj: "Se necesitan todas las propiedes del texto."
            })
        } else {
            mitexto = {
                texto: texto,
                nivel: nivel,
                lang: lang
            }
            gestorBD.obtenerTextos(mitexto, function (result) {
                if (result == null) {
                    res.status(401);
                    res.json({
                        msj: "No se ha encontrado ningun texto para borrar",
                        texto: mitexto
                    })
                } else if (result.length == 0) {
                    res.status(401);
                    res.json({
                        msj: "No se han encontrado textos."
                    });
                } else {
                    console.log(result[0]);
                    gestorBD.borrarTexto(result[0], function (r) {
                        if (r == null) {
                            res.status(401);
                            res.json({
                                msj: "No se ha podido borrar el texto",
                                obj: mitexto
                            })
                        } else {
                            res.status(200);
                            res.json({
                                msj: "El texto se ha eliminado correctamente.",
                                texto: mitexto
                            })
                        }
                    })
                }
            })

        }
        /*
        res.status(200)
        res.json({
            msj: "Esto debe borrar el texto que se indica y todas las traducciones en caso de haberlas. Mismo id."
        })
        */
    });

    app.post("/identificarse", function (req, res) {
        //Esto sirve para identificarse como usuario y obtener los datos.
        //IMPORTANTE: La contraseña tiene que llegar cifrada.

        var email = req.body.email;
        var pass = req.body.pass;
        criterio = {
            email: email,
            pass: pass
        }
        gestorBD.obtenerDatosUsuario(criterio, function (result) {
            if (result == null) {
                res.status(401);
                res.json({
                    error: "Error al buscar usuarios."
                });
            } else if (result.length == 0) {
                res.status(401);
                res.json({
                    msj: "No se han encontrado usuarios."
                });
            } else {
                console.log("Usuario obtenido: ");
                console.log(result);
                res.status(200);
                var mauser = {
                    email: result[0]["email"],
                    pass: result[0]["pass"],
                    estadisticas: result[0]["estadisticas"]
                }
                //res.send(JSON.stringify(mauser));
                res.send(mauser);
            }
        });

    });
    app.post("/usuario", function (req, res) {
        //Esto sirve para agregar un usuario nuevo a la base de datos.

        var email = req.body.email;
        var pass = req.body.pass;

        var estadisticas = []
        if (email == null || pass == null) {
            res.status(401);
            res.json({
                msj: "Faltan parámetros"
            })
        } else {
            var user = {
                email: email,
                pass: pass,
                estadisticas: estadisticas
            }
            var criterio = {
                email: email
            }
            gestorBD.obtenerDatosUsuario(criterio, function (result) {

                if (result == null) {
                    res.status(401);
                    res.json({
                        error: "Ha ocurrido un error al verificar si existe un usuario con el email: " + email
                    })
                } else if (result.length != 0) {
                    res.status(401);
                    res.json({
                        msj: "Se han encontrado usuarios con ese mail."
                    });
                } else if (result.length == 0) {
                    console.log("No ha encontrado un usuario con ese email. Seguimos.")
                    gestorBD.insertarUsuario(user, function (result) {
                        if (result == null) {
                            res.status(401);
                            res.json({
                                error: "No se ha podido insertar el usuario en la base de datos."
                            })
                        } else {
                            res.status(200);
                            res.json({
                                msj: "El usuario se ha insertado correctamente.",
                                usuario: user
                            });
                        }
                    });
                } else {
                    res.status(401);
                    res.json({
                        error: "Ya existe un usuario con el email: " + email
                    })
                }
            });
        }

    });

    app.put("/usuario", function (req, res) {

        var email = req.body.email;
        var pass = req.body.pass;
        var estadisticas = req.body.estadisticas;
        var criterio = {
            email: email,
            pass: pass
        }
        var user = {
            email: email,
            pass: pass,
            estadisticas: estadisticas
        }
        gestorBD.obtenerDatosUsuario(criterio, function (result) {
            if (result == null) {
                res.status(401);
                res.json({
                    error: "Error al verificar que el usuario es el correcto"
                })
            } else if (result.length == 0) {
                res.status(401);
                res.json({
                    error: "No se ha encontrado el usuario."
                })
            } else {
                gestorBD.actualizarUsuario(criterio, user, function (result) {
                    if (result == null) {
                        res.status(401)
                        res.json({
                            error: "Error al momento de actualizar los datos del usuario"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            msj: "Las estadísticas del usuario se han actualizado correctamente."
                        })
                    }
                })
            }
        });

    });

    app.get("/usuario", function (req, res) {
        var email = req.body.email;
        var pass = req.body.pass;
        var criterio = {}
        if (email != null && pass != null) {
            criterio = {
                email: email,
                pass: pass
            }
        }

        if (email == null || pass == null) {
            res.satutus(401);
            res.json({
                msj: "Se requiere un email y una contraseña."
            })

        }
        gestorBD.obtenerDatosUsuario(criterio, function (result) {
            if (result == null) {
                res.status(401);
                res.json({
                    msj: "Error al buscar."
                });
            } else if (result.length == 0) {
                res.status(401);
                res.json({
                    msj: "No se han encontrado usuarios."
                });
            } else {
                res.status(200);
                res.json({
                    usuario: result
                })
            }
        });
    });

    app.get("/usuarios", function (req, res) {
        var criterio = {}
        gestorBD.obtenerTodosUsuario(criterio, function (result) {
            if (result == null) {
                res.status(401);
                res.json({
                    msj: "Error al buscar."
                });
            } else if (result.length == 0) {
                res.status(401);
                res.json({
                    msj: "No se han encontrado usuarios."
                });
            } else {
                res.status(200);
                res.json({
                    usuarios: result
                })
            }
        });
    });

    //------------------- Traduccion de textos -------------------

    app.get("/traducirAllTextos", function (req, res) {
        var langFrom = "ES";
        var criterio = {
            lang : "ES"
        }
        gestorBD.obtenerTextos(criterio, function (textos) {
            if (textos == null) {
                var txts = [];
                //res.send(JSON.stringify(txts)); //Le mando un array vacio de datos, lo cual quiere decir que no se han encontrado textos de ese nivel.
                res.status(401);
                res.json({
                    error: "Error al obtener los textos del idioma " + lang + " del nivel " + lv
                });
            } else if (textos.length == 0) {
                res.status(401);
                res.json({
                    msj: "No se han encontrado textos para traducir."
                });
            } else {
                var misTextosTraducidos = texots;
                traductor.getSupportedLanguagesCodes(function (res) {
                    if(res == null){
                        res.status(501);
                        res.json({
                            msj : "Ha fallado la obtencion de los codigos de idioma"
                        })
                    }else{
                        res.status(501);
                        res.json({
                            msj : "No se ha implementado por completo"
                        })
                    }
                })
            }
        });
    })


    app.get("/traducir", function (req, res) {
        var texto = req.query.texto;
        var langFrom = req.query.langFrom;
        var langTo = req.query.langTo;
        limitless.traducirTexto(texto, langFrom, langTo, function (result) {
            if(result == null){
                res.status(501);
                res.json({
                    msj : "No ha ido bien el temita."
                })
            }else{
                res.status(200);
                res.json({
                    resultado : result
                })
            }
        })
    })

    app.post("/traducirLista", function (req, res) {
        var textos = req.body.textos;
        console.log(textos);
        var langFrom = req.body.langFrom;
        var langTo = req.body.langTo;
        limitless.traducirListaTextos(textos, langFrom, langTo, function (result) {
            if(result == null){
                res.status(501);
                res.json({
                    msj : "No ha ido bien el temita."
                })
            }else{
                console.log("Respuesta: ");
                console.log(result)
                res.status(200);
                res.json({
                    resultado : result
                })
            }
        })
    })

    app.post("/traducirTextosEinsertar", function (req, res) {
        var textos = req.body.textos;
        console.log(textos);
        var langFrom = req.body.langFrom;
        var langTo = req.body.langTo;
        limitless.traducirListaTextos(textos, langFrom, langTo, function (result) {
            if(result == null){
                res.status(501);
                res.json({
                    msj : "No ha ido bien el temita."
                })
            }else{
                /*
                console.log("Respuesta: ");
                console.log(result)
                res.status(200);
                res.json({
                    resultado : result
                })*/
                var textos = result["textos"];
                gestorBD.insertTextAll(textos, function (resultado) {
                    if(resultado == null){
                        res.status(401);
                        res.json({
                            msj : "No ha ido bien la cosa."
                        })
                    }else{
                        res.status(200);
                        res.json({
                            msj : "Textos traducidos e introducidos correctamente"
                        })
                    }
                })
            }
        })
    }

    app.get("/isoCodes", function (req, res) {
        isoCodes.obtenerCodigosIso(function (result) {
            res.status(200);
            res.json({
                codigos : result
            })
        })
    })

    app.get("/allLanguages", function (req, res) {
        isoCodes.obtenerParCodigoLangIso(function (result) {
            res.status(200);
            res.json({
                codigos : result
            })
        })
    })

    app.post("/idiomasIso", function (req, res) {
        isoCodes.obtenerParCodigoLangIso(function (result) {
            /*
            Tengo un objeto json del tipo
            {
                "codigos" : [
                { "codigo" : "a",
                    "idioma" : "aIdioma"
                    },
                    { "codigo" : "b",
                    "idioma" : "bIdioma"
                    }
                ]
            }
             */
            console.log(result);
            var codigos = result;
            gestorBD.insertLangCodes(codigos, function (respuesta) {
                if(respuesta == null){
                    res.status(401);
                    res.json({
                        msj : "Error al añadir los codigos iso a la base de datos."
                    })
                }else{
                    res.status(200);
                    res.json({
                        msj : "Los codigos se han añadido correctamente"
                    })
                }
            })
            }
        )
    })


    //----------------- FIN Traduccion de textos -----------------
}