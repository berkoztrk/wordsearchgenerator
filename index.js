const _ = require("lodash");
const randomChar = require("random-char");
const write = require("write");
const {
    table
} = require("table");
let instance = null;

const DEFAULTS = {
    SIZE: 12,
    UPPERCASE: true,
    CHAR_POOL: "ABCDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",
    OUTPUT_PATH: "./puzzle.txt",
    WRITE_TO_FILE: true
}

class WordSearchGenerator {
    constructor() {}

    static getInstance() {
        if (!instance) {
            instance = new WordSearchGenerator();
        }
        return instance;
    }

    _init(opts) {
        if (!opts.words) {
            throw `WORDS EXCEPTION : Please provide "words" property in options`;
        }

        this.width = opts.width || DEFAULTS.SIZE;
        this.height = opts.height || DEFAULTS.SIZE;
        this.words = opts.words || [];
        this.charPool = opts.charPool || DEFAULTS.CHAR_POOL;
        this.outputPath = opts.outputPath || DEFAULTS.OUTPUT_PATH;
        this.writeToFile = opts.writeToFile || DEFAULTS.WRITE_TO_FILE;
        this._initPuzzle();
        this._initWords();
    }

    _initWords() {
        this.words = _.orderBy(this.words, (item) => item.length, "desc");
        if (this.isUppercase)
            this.words = _.map(this.words, (word) => word.toLocaleUpperCase());
    }

    _initPuzzle() {
        this.puzzle = _.times(this.height, () => _.times(this.width, () => null));
    }

    _getRandomWordSlot() {
        return {
            dx: _.random(-1, 1),
            dy: _.random(-1, 1),
            x: _.random(0, this.width - 1),
            y: _.random(0, this.height - 1)
        }
    }

    _findWordToWordslot() {
        let slotFound = false;
        while (!slotFound) {
            const wordSlot = this._getRandomWordSlot();
            _.forEach(this.words, (word) => {
                const put = this._tryPutWordToWordSlot(word, wordSlot);
                if (put) {
                    slotFound = true;
                    _.remove(this.words, (item) => item === word);
                    return;
                }
            });
        }
    }

    _tryPutWordToWordSlot(word, wordSlot) {
        let wordPut = false;
        let previousStates = [];
        try {
            let iteration = 0;
            let x = wordSlot.x;
            let y = wordSlot.y;
            while (iteration < word.length) {
                const value = this.puzzle[y][x];
                const previousState = {
                    x,
                    y,
                    value
                };
                if (value !== null && value !== word[iteration])
                    throw "Word not fit to the slot.";

                this.puzzle[y][x] = word[iteration];
                previousStates.push(previousState);
                y += wordSlot.dy;
                x += wordSlot.dx;
                iteration++;
            }
            wordPut = true;
        } catch (error) {
            this._setToPreviousState(previousStates);
            wordPut = false;
        }
        return wordPut;
    }

    _setToPreviousState(previousStates) {
        for (let state of previousStates) {
            this.puzzle[state.y][state.x] = state.value;
        }
    }

    _appendRandomToRest() {
        let index = 0;
        for (let array of this.puzzle) {
            this.puzzle[index++] = _.map(array, (item, i) => {
                if (item === null) {
                    item = randomChar({
                        pool: this.charPool
                    })
                }
                return item;
            })
        }
    }

    _writeToFile() {
        if (!this.puzzle || !this.puzzle.length)
            throw "Before writing to file generate puzzle first.";
        try {
            const tablePuzzle = table(this.puzzle);
            write.sync(this.outputPath, tablePuzzle);
            console.log(`Puzzle successfully written to file named : ${this.outputPath}`)
        } catch (error) {
            console.log(`Writing puzzle to file named : ${this.outputPath} failed.`)
        }
    }

    generate(opts) {
        this._init(opts);
        while (this.words.length) {
            this._findWordToWordslot();
        }
        this._appendRandomToRest();

        if (this.writeToFile) {
            this._writeToFile();
        }
        return this.puzzle;
    }

}

module.exports = WordSearchGenerator.getInstance();