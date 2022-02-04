
import TokenBuffer from "./token-buffer.js";

/**
 * @typedef {Object} ReaderOptions
 * @property {RegExp} wordPattern
 * @property {RegExp} whitespacePattern
 */

/**
 * An object that helps you read a string.
 */
export default class Reader {
    /**
     * @type {string}
     */
    #text

    /**
     * @type {typeof string[Symbol.iterator]}
     */
    #iterator

    /**
     * @type {TokenBuffer}
     */
    #buffer = new TokenBuffer

    /**
     * Used for setting regex lastIndex.
     */
    #stringIndex = 0

    /**
     * @type {ReaderOptions}
     */
    #options = {
        wordPattern:     /[\p{L}\p{Nd}_\$]/,
        nonwordPattern: /[^\p{L}\p{Nd}_\$]/,
        whitespacePattern: /\s/,
    }

    /**
     * @param {string} text
     * @param {Partial<ReaderOptions>} options
     */
    constructor(text, options) {
        this.#text = text
        Object.assign(this.#options, options)
        this.#iterator = text[Symbol.iterator]()
    }

    /**
     *
     * @returns {string}
     */
    eat() {
        if (this.#buffer.length === 0) {
        const { value, done } = this.#iterator.next()
        if (done) return null
            this.#buffer.enqueue(value)
        }
        const value = this.#buffer.dequeue()
        this.#stringIndex += value.length
        return value
    }

    /**
     * @param {number} n
     * @returns {string}
     */
    peek(n = 0) {
        for (let i = this.#buffer.length - 1; i < n; i++) {
            const { value, done } = this.#iterator.next()
            if (done) return null
            this.#buffer.enqueue(value)
        }
        return this.#buffer.peek(n)
    }

    skip(n) {
        for (let i = 0; i < n; i++) this.eat()
    }

    /**
     *
     * @param {string} ch
     * @returns {string?}
     */
    matchChar(ch) {
        if (this.peek() === ch) return this.eat()
        return null
    }

    /**
     * 
     * @param {RegExp} delimiter 
     * @returns {String}
     */
    until(delimiter) {
        let rv = []
        while (!delimiter.test(this.peek())) {
            rv.push(this.eat())
        }
        return rv.join('')
    }

    /**
     * 
     * @param {RegExp} delimiter 
     * @returns {String}
     */
    while(delimiter) {
        let rv = []
        while (delimiter.test(this.peek())) {
            rv.push(this.eat())
        }
        return rv.join('')
    }

    /**
     *
     */
    hasString(str) {
        let i = 0;
        for (const ch of str) {
            if (this.peek(i++) !== ch) return null
        }
        return i
    }

    matchString(str) {
        const has = this.hasString(str)
        if (has === null) return false
        this.skip(has)
        return true
    }


    matchDelimited(str, delimiter) {
        const has = this.hasString(str)
        if (has === null) return null
        console.log(has)

        const after = this.peek(has + 1)
        if (delimiter.test(after)) {
                this.skip(has)
            return str
        }
    }

    /**
     * Returns the result of `RegExp.prototype.exec` on the unconsumed 
     * characters.
     * 
     * The 'y' and 'u' flags will be added to the regex. 'g' will be removed.
     * 
     * @param {RegExp} re 
     */
    matchRegex(re) {
        let flags = 'y'
        for (const flag of re.flags) switch (flag) {
            case 'g':
            case 'y':
                break
            default:
                flags += flag
        }
        re = new RegExp(re.source, flags)
        re.lastIndex = this.#stringIndex
        const exec = re.exec(this.#text)
        if (exec === null) return null
        while (this.#stringIndex < re.lastIndex && this.eat() !== null) {}
        return exec
    }

    checkpoint() {
        return this.#buffer.checkpoint()
    }

    restore(checkpoint) {
        this.#buffer.restore(checkpoint)
    }
}
