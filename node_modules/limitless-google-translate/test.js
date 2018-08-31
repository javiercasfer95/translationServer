var limitless = require('./engine.js')
var fs = require('fs')

fs.readFile('test.txt', 'utf8', (err, data) => {
  limitless.translate(data, {to:'pt'})
  .then( (result) => {
    console.log( result.text )
    console.log( JSON.stringify(result.response) )
  })
  .catch( (err) => {
    console.log( new Error(err) )
  })
})
