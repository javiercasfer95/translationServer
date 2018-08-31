# Limitless Google Translate API for NodeJs
 Translate large texts using the google-translate-api for NodeJS!



### The magic itself:
The google-translate-api uses query string in a GET method to send the text to be translated to the translation service. This limits the amount a characters you can translate at once. This package chops the texts into smaller, coherent sentences, translates them and mount them back together into the text. This is all done asynchronously, so it won't block your code midway!

### The package:
It return an object with a single method: translate. Couldn't be simpler!

# How to install and setup
  Simply run
  ```sh
  $ npm install limitless-google-translate
  ```

  Import it into you project
  ```sh
   var limitless = require('limitless-google-translate')
  ```

  And use it at will!
  ```sh
  limitless.translate(VERY_LARGE_TEXT_HERE, {to: 'pt'})
    .then( (result) => {
      console.log( result.text )
    })
    .catch( (err) => {
      console.log( new Error(err) )
    })
  ```

  Do you wish to use the regular and limited google-translate-api? Just do:
  ```sh
  limitless.legacy(BORING_SMALL_TEXT_HERE, {to: 'pt'})
    .then( (result) => {
      console.log( result.text )
    })
    .catch( (err) => {
      console.log( new Error(err) )
    })
  ```
  The legacy object is a direct import from the regular api, so to use it just refer to <a href="https://www.npmjs.com/package/google-translate-api">here</a>

##The returned result is an object with the following attributes
  ```sh
  result: {
    text:, // Fully translated text
    response: [][] //Ordered 2D array in sequence with all the
                   //sentences translated. The object inside
                   //each element of the array is the as describe here:
                   //https://github.com/matheuss/google-translate-api#returns-an-object
  }
  ```
## Found a bug or want to improve this somehow?
  Feel free to contact me or submit a pull request. I will be thrilled to help you!
