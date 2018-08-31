module.exports = {
    app: null,
    isoCodeObtainer: null,
    init: function (app, isoCodesObtainer) {
        this.isoCodeObtainer = isoCodesObtainer;
        this.app = app;
    }, obtenerCodigosIso: function (funcionCallBack) {
        var allCodes = this.isoCodeObtainer.getAllCodes();
        //console.log(allCodes);
        funcionCallBack(allCodes);
    }, obtenerParCodigoLangIso : function (funcionCallBack) {
        var allCodes = this.isoCodeObtainer.getAllCodes();
        var allLanguages = [];
        var lang = {};
        var code;
        for (var c = 0; c < allCodes.length; c ++) {
            code = allCodes[c].toString();
            var language = this.isoCodeObtainer.getName(code);
            lang = {
                codigo : code,
                idioma : language
            }
            allLanguages.push(lang);
        }
        funcionCallBack(allLanguages);
    }


    // https://www.npmjs.com/package/iso-639-1
}
