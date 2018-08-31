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
                funcionCallBack(result);
            }
        ).catch((err) => {
            funcionCallBack(null);
        })
    },
    traducirListaTextos: function (listaObjetosTextosJson, langFrom, langTo, funcionCallBack) {
        console.log(listaObjetosTextosJson)
        var nto = langTo.toLowerCase();
        var nfrom = langFrom.toLowerCase();
        console.log("From: " + langFrom + " to " + langTo)
        var langs = {
            from: nfrom,
            to: nto
        }
        var textosTraducidos = [];
        console.log("Voy a la iteracion: ");
        var it = 0;
        this.traduccionIterativa(listaObjetosTextosJson, textosTraducidos, langs, it, funcionCallBack);

    }, traduccionIterativa : function (listaTextos, listaNuevosTextos, langs, iterador, funcionCallBack) {
        var miTexto = listaTextos[iterador];
        console.log("Mi texto: ");
        console.log(miTexto);
        var nText = miTexto;
        this.limitless.translate(miTexto["texto"], langs).then(
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
            funcionCallBack(null);
        })
    }
}