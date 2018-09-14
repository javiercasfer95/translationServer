module.exports = {
    gestorDB: null,
    app: null,
    limitless: null,
    langCodes: null,
    instance: null,
    init: function (app, gestorDB, traductor) {
        this.gestorDB = gestorDB;
        this.app = app;
        this.limitless = traductor;
        this.instance = this;
    }, getLangNames: function () {
        //Este metodo igual es mejor no usarlo y que el cliente guarde directamente todo el array name/code.
        if (langCodes == null) {
            limitless.getSupportedLanguages(function (newlangCodes) {
                this.langCodes = newlangCodes;
                langNamesArray();
            });
        } else {
            langNamesArray();
        }
    },
    langNamesArray: function () {
        var langNames = [];
        for (var n in this.langCodes) {
            var name = n.name;
            langNames.push(name);
        }
        return langNames;
    },
    getLangCode: function () {
        //Yo creo que lo mejor es usar esta.
        if (langCodes == null) {
            limitless.getSupportedLanguages(function (newlangCodes) {

                this.langCodes = newlangCodes;
                return this.langCodes;
            });
        } else {
            return this.langCodes;
        }
    }, obtenerIdiomasCompatibles: function (listaISOcodes, texto, funcionCallBack) {
        var codigos = [];
        //console.log(listaISOcodes);
        var lang;
        for (var i = 0; i < listaISOcodes.length; i++) {
            lang = listaISOcodes[i];
            //console.log(lang)
            codigos.push(lang["codigo"]);
        }
        //console.log(codigos)
        var iterador = 0;
        var listaNuevaCodigos = [];
        //funcionCallBack(codigos);
        console.log(texto);
        try {
            this.traduccionPorCodigoIterativa(texto, codigos, iterador, listaNuevaCodigos, funcionCallBack);
        } catch (e) {
            console.log(e);
            funcionCallBack(null);
        }
    }, traduccionPorCodigoIterativa: function (texto, listaCodigos, iterador, listaNuevaCodigos, funcionCallback) {
        if (iterador < listaCodigos.length) {
            //cod = "en"
            console.log("Iterador: " + iterador + " cod: " + listaCodigos[iterador]);
            var nfrom = "es".toLowerCase();
            var nto = listaCodigos[iterador].toLowerCase();
            console.log("From: " + nfrom + " to " + nto)
            var langs = {
                from: nfrom,
                to: nto
            }
            this.limitless.translate(texto, langs).then(
                (result) => {
                    console.log(result);
                    listaNuevaCodigos.push(listaCodigos[iterador]);
                    iterador = iterador + 1;
                    this.traduccionPorCodigoIterativa(texto, listaCodigos, iterador, listaNuevaCodigos, funcionCallback);
                    // funcionCallBack(result);
                }
            ).catch(
                (err) => {
                    //console.log(err);
                    iterador = iterador + 1;
                    console.log("No encuentra para el iterador: " + iterador);
                    //console.log(iterador);
                    this.traduccionPorCodigoIterativa(texto, listaCodigos, iterador, listaNuevaCodigos, funcionCallback);
                    //funcionCallBack(null);
                });
        } else {
            console.log("He terminado.")

            //console.log(listaNuevaCodigos);
            funcionCallback(listaNuevaCodigos);
        }
    }, getAllSystemLangs : function(funcionCallback){
      var criterio = {

      }
      this.gestorDB.obtenerMisLangs(criterio, function (resultado) {
          if(resultado == null){
              funcionCallback(null);
          }else{
              funcionCallback(resultado);
          }
      })
    }, actualizarIdiomasConTextos : function (textos, funcionCallBack){
        var idiomasExistentes = [];
        var langAux;
        for(var i = 0; i < textos.length; i++){
            console.log(textos[i]);
            langAux = textos[i]["lang"];
            if(!idiomasExistentes.includes(langAux)){
                idiomasExistentes.push(langAux);
            }
        }
        funcionCallBack(idiomasExistentes);
    }






    /*actualizarIdiomasConTextos: function (langs, funcionCallBack) {
        var allLangs = [];
        var textLangs = [];
        var criterio = {}
        if (langs == null) {
            funcionCallBack(null);
        } else {
            var mlang;
            for (var i = 0; i < langs.length; i++) {
                mlang = langs[i]["codigo"];
                allLangs.push(mlang);
            }
            //allLangs = langs;
            //console.log(allLangs);
            var iterador = 0;
            this.buscarTextosPorCodigoIterativo(allLangs, iterador, textLangs, function (resultadoBusqueda) {
                if (resultadoBusqueda == null) {
                    funcionCallBack(null);
                } else if (resultadoBusqueda.length == 0) {
                    console.log("Al final no hay langs, asi que no meto nada.")
                    funcionCallBack(resultadoBusqueda)
                    //funcionCallBack([]); //Esto hay que revisarlo y comprobar que revise que la longitud sea 0? No, mejor no hace nada
                } else {
                    console.log(textLangs);
                    console.log(resultadoBusqueda);
                    var nLangs = [];
                    var lang;
                    //for(var i = 0; i < re)
                    //gestorDB.insertLangCodesWithTexts
                }
            });
        }
    }, intermedio: function (langs) {
        var allLangs = [];
        var textLangs = [];
        var criterio = {}
        if (langs == null) {
            funcionCallBack(null);
        } else {
            var mlang;
            for (var i = 0; i < langs.length; i++) {
                mlang = langs[i]["codigo"];
                allLangs.push(mlang);
            }
            //allLangs = langs;
            //console.log(allLangs);
            var iterador = 0;
            this.buscarTextosPorCodigoIterativo(allLangs, iterador, textLangs, function (resultadoBusqueda) {
                if (resultadoBusqueda == null) {
                    funcionCallBack(null);
                } else if (resultadoBusqueda.length == 0) {
                    console.log("Al final no hay langs, asi que no meto nada.")
                    funcionCallBack(resultadoBusqueda)
                    //funcionCallBack([]); //Esto hay que revisarlo y comprobar que revise que la longitud sea 0? No, mejor no hace nada
                } else {
                    console.log(textLangs);
                    console.log(resultadoBusqueda);
                    var nLangs = [];
                    var lang;
                    //for(var i = 0; i < re)
                    //gestorDB.insertLangCodesWithTexts
                }
            });
        }
    }, buscarTextosPorCodigoIterativo : function(allLangs, iteradorLangs, langsWithText, funcionCallback) {
        if (iteradorLangs < allLangs.length) {
            var actualCod = allLangs[iteradorLangs];
            console.log("Actual code: " + actualCod);
            var lCriterio = {
                lang: actualCod
            }
            this.gestorDB.obtenerTextos(lCriterio, function (resultadoBusqueda) {
                if (resultadoBusqueda == null) {
                    //funcionCallback(null);
                    console.log("No se encuentran textos para el criterio: ");
                    console.log(lCriterio);
                } else {
                    langsWithText.push(actualCod);
                    this.buscarTextosPorCodigoIterativo(allLangs, iteradorLangs, langsWithText, funcionCallback);
                }
            });
        } else {
            funcionCallback(langsWithText);
        }
    }
    */
}