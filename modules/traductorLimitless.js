module.exports = {
    limitless: null,
    app: null,
    instance : null,
    init: function (app, limitless) {
        this.limitless = limitless;
        this.app = app;
        this.instance = this;
    },
    traducirTexto: function (texto, langFrom, langTo, funcionCallBack) {
        var nto = langTo.toLowerCase();
        var nfrom = langFrom.toLowerCase();
        console.log("From: " + langFrom + " to " + langTo)
        var langs = {
            from: nfrom,
            to: nto
        }
        this.limitless.translate(texto, langs).then(
            (result) => {
                console.log(result);
                funcionCallBack(result);
            }
        ).catch(
            (err) => {
                console.log(err);
                funcionCallBack(null);
        })
    }, traducirListaTextos : function(listaObjetosTextosJson, langFrom, langTo, funcionCallBack) {
        console.log(listaObjetosTextosJson)
        var nto = langTo.toUpperCase();
        var nfrom = langFrom.toUpperCase();
        console.log("From: " + langFrom + " to " + langTo)
        var langs = {
            from : nfrom,
            to : nto
        }
        var textosTraducidos = [];
        var it = 0;
        console.log("Voy a la iteracion: " + it);

        this.traduccionIterativa(listaObjetosTextosJson, textosTraducidos, langs, it, funcionCallBack);

    }, traduccionIterativa : function (listaTextos, listaNuevosTextos, langs, iterador, funcionCallBack) {
        var miTexto = listaTextos[iterador];
        console.log("Mi texto: ");
        console.log(miTexto);
        var nText = miTexto;
        var stringTxt = miTexto["texto"].toString();
        console.log(stringTxt)
        this.limitless.translate(stringTxt, langs).then(
            (result) => {
                nText["texto"] = result["text"];
                nText["lang"] = langs["to"].toUpperCase();
                listaNuevosTextos.push(nText);
                if(listaNuevosTextos.length == listaTextos.length){
                    funcionCallBack(listaNuevosTextos);
                }else{
                    iterador++;
                    this.traduccionIterativa(listaTextos, listaNuevosTextos, langs, iterador, funcionCallBack);
                }
            }
        ).catch((err) => {
            //console.log(new Error(err))
            console.log(err)
            funcionCallBack(null);
        })
    }, getSupportedLanguagesCodes : function (funcionCallback) {
        this.limitless.getSupportedLanguagesCodes(function (err, codes) {
            if(err){
                funcionCallback(null);
            }else{
                funcionCallback(codes);
            }
        })
    }, traducirPorTodosLosCodigos : function (listaTextos, listaCodigos, langFrom, funcionCallback) {
        var nuevaLista = [];
        var iteradorCode = 0;
        var iteradorTextos = 0;
        var nuevaLista = [];
        this.traducirPorTodosLosCodigosIterativa(this.instance, listaTextos, iteradorTextos, listaCodigos, iteradorCode, langFrom, nuevaLista, funcionCallback);

    }, traducirPorTodosLosCodigosIterativa : function (instance, listaTextos, iteradorTextos, listaCodigos, iteradorCodigos, langFrom, nuevaLista, funcionCallback) {
        //var actualLang = listaTextos[iteradorTextos];
        if(iteradorCodigos < listaCodigos.length){
            var actualCode = listaCodigos[iteradorCodigos];
            console.log(actualCode)
            //actualCode = 'en';
           var langs = {
               from : langFrom,
               to : actualCode
           }
           console.log("Iteracion por codigo: ");
           console.log(langs);
           this.ntraduccionIterativa(listaTextos, nuevaLista, langs, iteradorTextos, funcionCallback, function (listaTraducida) {
               if(listaTraducida == null){
                   console.log("Ha ocurrido un error.")
                   funcionCallback(null);
               }else{
                   //console.log(listaTraducida);
                   console.log("Ha traducido al " + langs["to"]);
                   /*
                   for(var j = 0; j < listaTraducida.length; j++){
                       nuevaLista.push(listaTraducida[j]);
                   }
                   */
                   //nuevaLista = listaTraducida;
                   iteradorCodigos = iteradorCodigos + 1;
                   iteradorTextos = 0;
                   instance.traducirPorTodosLosCodigosIterativa(listaTextos, iteradorTextos, listaCodigos, iteradorCodigos, langFrom, nuevaLista, funcionCallback);
               }
           });
        }else{
            funcionCallback(nuevaLista);
        }
    }, ntraduccionIterativa : function (listaTextos, listaNuevosTextos, langs, iterador, funcionVuelta, funcionCallBack) {
        var miTexto = listaTextos[iterador];
        //console.log("Mi texto: ");
        //console.log(miTexto);
        var nText = miTexto;
        var stringTxt = miTexto["texto"].toString();
        //console.log(stringTxt)
        this.limitless.translate(stringTxt, langs).then(
            (result) => {
                nText["texto"] = result["text"];
                nText["lang"] = langs["to"].toUpperCase();
                listaNuevosTextos.push(nText);
                console.log("Lista del idioma " + langs["to"] + " mide:");
                console.log(listaNuevosTextos.length);
                if(listaNuevosTextos.length == listaTextos.length){
                    funcionCallBack(listaNuevosTextos);
                }else{
                    iterador++;
                    this.ntraduccionIterativa(listaTextos, listaNuevosTextos, langs, iterador, funcionVuelta, funcionCallBack);
                }
            }
        ).catch((err) => {
            //console.log(new Error(err))
            console.log(err)
            funcionCallBack(null);
        })
    }
}