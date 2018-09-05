module.exports = {
    gestorDB: null,
    app: null,
    limitless: null,
    langCodes: null,
    instance : null,
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
    }, obtenerIdiomasCompatibles : function(listaISOcodes, texto, funcionCallBack) {
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
        try{
            this.traduccionPorCodigoIterativa(texto, codigos, iterador, listaNuevaCodigos, funcionCallBack);
        }catch (e) {
            console.log(e);
            funcionCallBack(null);
        }
    }, traduccionPorCodigoIterativa : function(texto, listaCodigos, iterador, listaNuevaCodigos, funcionCallback){
        if(iterador < listaCodigos.length){
            //cod = "en"
            console.log("Iterador: " + iterador +" cod: "+listaCodigos[iterador]);
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
        }else{
            console.log("He terminado.")

            //console.log(listaNuevaCodigos);
            funcionCallback(listaNuevaCodigos);
        }
    }
}