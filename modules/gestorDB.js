module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertText: function (texto, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('textos');
                collection.insert(texto, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, insertTextAll : function(textos, funcionCallBack){
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('textos');
                collection.insertMany(texto, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, borrarTexto: function (texto, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('textos');
                collection.remove(texto, function (err, obj) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(obj);
                    }
                    db.close();
                })
            }
        })
    }, eliminarTodosTextos : function(funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db){
            if(err){
                funcionCallback(null);
            }else{
                var collection = db.collection('textos');
                collection.remove({}, function (err, ok) {
                    if(err){
                        funcionCallback(null);
                    }else{
                        funcionCallback(ok);
                    }
                })
            }
        });
    },
    insertLangCodes: function (codes, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('langCodes');
                collection.remove({},function (err, ok) {
                    if(err){
                        console.log("No ha hecho el drop de langCodes")
                        funcionCallback(null);
                    }else{
                        collection.insertMany(codes, function (err, result) {
                            //console.log("He llegado al insertManyCodes");
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(result);
                            }
                            db.close();
                        });
                    }
                })

            }
        });
    },  insertLangCodesWithTexts : function (codes, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('langCodesWithtexts');
                collection.remove({},function (err, ok) {
                    if(err){
                        console.log("No ha hecho el drop de langCodes")
                        funcionCallback(null);
                    }else{
                        collection.insertMany(codes, function (err, result) {
                            //console.log("He llegado al insertManyCodes");
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(result);
                            }
                            db.close();
                        });
                    }
                })

            }
        });
    },
    obtenerTextos: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('textos');
                collection.find(criterio).toArray(function (err, textos) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(textos);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerDatosUsuario: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var colleciton = db.collection('usuarios');
                colleciton.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.insert(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                });
            }
        });
    },borrarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.remove(usuario, function (err, obj) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(obj);
                    }
                    db.close();
                })
            }
        })
    }, actualizarUsuario: function (criterio, usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.update(criterio, usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                });
            }
        });
    }, obtenerTodosUsuario: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var colleciton = db.collection('usuarios');
                colleciton.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    }, obtenerMisLangs : function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var colleciton = db.collection('langCodes');
                colleciton.find(criterio).toArray(function (err, misLangCodes) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(misLangCodes);
                    }
                    db.close();
                });
            }
        });
    }, updateTextWithLangs : function (newLangs, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if(err){
                funcionCallback(null);
            }else{
                var collection = db.collection('langsWithTexts');
                collection.remove({},function (err, ok) {
                    if(err){
                        console.log("No ha hecho el drop de langCodes")
                        funcionCallback(null);
                    }else{
                        collection.insertMany(newLangs, function (err, result) {
                            //console.log("He llegado al insertManyCodes");
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(result);
                            }
                            db.close();
                        });
                    }
                })
            }
        });
    }, getLangsWithTexts : function (criterio, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if(err){
                funcionCallback(null);
            }else{
                var collection = db.collection('langsWithTexts');
                collection.find(criterio).toArray(function (err, ok) {
                    if(err){
                        console.log("No se han podido obtener mis idiomas")
                        funcionCallback(null);
                    }else{
                        console.log("LangCodes con texto obtenidos correctamente");
                        funcionCallback(ok);
                    }
                })
            }
        });
    }
}