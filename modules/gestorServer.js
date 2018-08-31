module.exports = {
    gestorDB: null,
    app: null,
    limitless: null,
    langCodes: null,
    init: function (app, gestorDB, traductor) {
        this.gestorDB = gestorDB;
        this.app = app;
        this.traductor = traductor;
    },
    getLangNames: function () {
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
    }
}