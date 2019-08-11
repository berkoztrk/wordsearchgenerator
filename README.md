# wordsearchgenerator
Word search puzzle generator


### Installing
```
npm install wordsearchgenerator
```
### Usage
```
const wsg = require("wordsearchgenerator")
const puzzle = wsg.generate(options);

```
### Options
Options with default values given below. You can change the values according to your puzzle.
```
{
  width : 12                                  // Board width
  height: 12                                  // Board height
  words : []                                  // Words to put to the puzzle
  writeToFile : true                          // Write generated puzzle to file
  outputPath : "./puzzle.txt"                 // Output file path if writeToFile option is true
  charPool : "ABCDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"   // Character pool for filling empty spaces after puzzle created.
}
```
