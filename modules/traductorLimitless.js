module.exports = {
    limitless: null,
    app: null,
    init: function (app, limitless) {
        this.limitless = limitless;
        this.app = app;
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
            from: nfrom,
            to: nto
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
        var stringTxt = miTexto["texto"];
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
            console.log(new Error(err))
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
        this.traducirPorTodosLosCodigosIterativa(listaTextos, iteradorTextos, listaCodigos, iteradorCode, langFrom, nuevaLista, funcionCallback);

    }, traducirPorTodosLosCodigosIterativa : function (listaTextos, iteradorTextos, listaCodigos, iteradorCodigos, langFrom, nuevaLista, funcionCallback) {
        var actualLang = listaTextos[iteradorTextos];
        if(iteradorCodigos < listaCodigos.length){
           var langs = {
               from : langFrom,
               to : listaCodigos[iteradorCodigos]
           }
           console.log("Iteracion por codigo: ");
           console.log(langs)
           this.traduccionIterativa(listaTextos, nuevaLista, langs, iteradorTextos, function (listaTraducida) {
               if(listaTraducida == null){
                   console.log("No ha traducido bien")
                   funcionCallback(null);
               }else{
                   //for(var i = 0; i < listaTraducida.length; i++){}
                   console.log(listaTraducida);
                   iteradorCodigos = iteradorCodigos + 1;
                   iteradorTextos = 0;
                   this.traducirPorTodosLosCodigosIterativa(listaTextos,
                       iteradorTextos, listaCodigos,
                       iteradorCodigos, langFrom, nuevaLista, funcionCallback);
               }
           });
        }else{
            funcionCallback(nuevaLista);
        }
    }
}