const google_translate = require('google-translate-api')
const _ = require('lodash')
const q = require('q')
const chars = 1000

/**
  * Analyzes the string input to make sure that no array item has more than 254 characters
  * @method splitString
  * @param  {String}  	string    string to analyse
  * @return {Array}     array2d   2D array with the text
  */
var splitString = (string) => {
  var dfd = q.defer()

  var count = 0
  var amount = 0
  var array = string.replace(/(\r\n|\n|\r)/g, '').split('. ') // Replaces escaping
  var length = array.length
  var array2d = []

  _.forEach(array, (text, i) => {
    amount++
    if (text.length >= chars) {
      array[i] = array[i].split(', ')
      count += array[i].length
    } else {
      array[i] = [array[i]]
      count += array[i].length
    }
    array2d[i] = array[i]
    if (amount == length) {
      dfd.resolve({array: array2d, count: count})
    }
  })

  return dfd.promise
}

/**
  * Translates array of sentences and returns a promise with the translated array as argument
  * @method translateArray
  * @param  {String}  string    	String to be translated
  * @param  {String}  language    Language that the array will be translated to. i.e: 'en' for English, 'fr' for French.
  * @return {Promise}             Returns a promise after it is finished
  */
var translate = (string, options) => {
  var dfd = q.defer()

  splitString(string)
    .then((coreObj) => {

      var array = coreObj.array
      var totalLength = coreObj.count

      var translatedArray = _.cloneDeep(array) // Creates copy of array to another part of the memory
      var objectArray = _.cloneDeep(array) // Creates copy of array to another part of the memory
      var amount = 0

      _.map(translatedArray, (outside, i) => {

        return _.map(outside, (inside, j) => {

          google_translate(inside, options).then((res) => {

            objectArray[i][j] = {
              text: res.text,
              from: {
                language: {
                  didYouMean: res.from.language.didYouMean,
                  iso: res.from.language.iso
                },
                text: {
                  autoCorrected: res.from.text.autoCorrected,
                  value: res.from.text.value,
                  didYouMean: res.from.text.didYouMean
                }
              },
              raw: res.raw
            }
            translatedArray[i][j] = res.text

            amount++

            if (amount == totalLength) {
              for (var k = 0; k < translatedArray.length; k++) {
                translatedArray[k] = translatedArray[k].join(', ')
              }

              dfd.resolve({text: translatedArray.join('. '), response: objectArray})
            }
          }).catch((err) => {
            dfd.reject(err)
          })
        })
      })
    })
    .catch((err) => {
      dfd.reject(err)
    })

  return dfd.promise
}

module.exports = {
  translate: translate,
  legacy: google_translate
}
