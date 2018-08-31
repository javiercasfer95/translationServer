module.exports = {
    limitless: null,
    app: null,
    init: function (app, traductor) {
        this.traductor = traductor;
        this.app = app;
    },
    translateEStoEN: function (texto, funcionCallback) {
        this.traductor.translate(texto, 'es', 'en', function (err, translation) {
            if (err) {
                funcionCallback(null);
            } else {
                funcionCallback(translation);
                console.log('Traduccion de ES a EN: ' + translation.translatedText);
            }
        });
    },
    translateSometoOther: function (texto, lOrigen, lDestino, funcionCallback) {
        this.traductor.translate(texto, lOrigen, lDestino, function (err, translation) {
            if (err) {
                funcionCallback(null);
            } else {
                funcionCallback(translation);
                console.log('Traduccion de ' + lOrigen + ' a ' + lDestino + ': ' + translation.translatedText);
            }
        });
    },
    translateDetecttoOther: function (texto, lDestino, funcionCallback) {
        this.traductor.detectLanguage(texto, function (err, detection) {
            console.log(detection.language);
            var lOrigen = detection.language;
            if (err) {
                funcionCallback(null);
            } else {
                this.traductor.translate(texto, lOrigen, lDestino, function (err2, translation) {
                    if (err2) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(translation);
                        console.log('Traduccion de ' + lOrigen + ' a ' + lDestino + ': ' + translation.translatedText);
                    }
                });
            }
        });
    },
    getSupportedLanguages: function (funcionCallback) {
        this.traductor.getSupportedLanguages(app.get('appLang'), function (err, languageCodes) {
            if (err) {
                funcionCallback(null);
            } else {
                funcionCallback(languageCodes);
                //console.log(languageCodes);
                //Va a obtener los nombres en 'es' definido en app.js
                // => [{ language: "en", name: "Englisch" }, ...]
            }
        });
    },
    getSupportedLanguagesCodes: function (funcionCallback) {
        this.traductor.getSupportedLanguages(function (err, languageCodes) {
            if (err) {
                funcionCallback(null);
            } else {
                funcionCallback(languageCodes);
            }
        })
    }
}