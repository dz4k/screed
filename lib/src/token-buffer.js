
export default class TokenBuffer {
    /**
     * The tokens that have been inserted. Only elements after index
     * {@link #start} are actually in the buffer, the rest are stored for
     * restoring.
     * @type {string[]}
     */
    #arr = []

    /**
     * The index of the first item in the buffer.
     * @type {number}
     */
    #start = 0

    /**
     * The number of items in the buffer.
     * @type {number}
     */
    get length() {
        return this.#arr.length - this.#start
    }

    /**
     * Remove the first item from the buffer.
     * @returns {string} The removed item.
     */
    dequeue() {
        return this.#arr[this.#start++]
    }

    /**
     * Add an item to the end of the buffer.
     * @param {string} x The item to add.
     * @returns {TokenBuffer} This buffer.
     */
    enqueue(x) {
        this.#arr.push(x)
        return this
    }

    /**
     * Get the nth item from the start, without mutating the buffer.
     * @param {number} n Which item to peek. Passing 0 will return the same
     *   value that will be returned by {@link dequeue}.
     * @returns {string}
     */
    peek(n = 0) {
        return this.#arr[this.#start + n]
    }

    /**
     * Dequeue n items.
     * @param {number} [n=1] The number of items to dequeue.
     */
    skip(n = 1) {
        this.#start += n
    }

    /**
     * Get a checkpoint that can be used to restore the buffer to its current
     * state in the future.
     * @returns {number} A checkpoint, which can be passed to {@link TokenBuffer.restore}.
     */
    checkpoint() {
        return this.#start
    }

    /**
     * Restore the buffer to a previous state.
     * @param {number} checkpoint A checkpoint, obtained via {@link TokenBuffer.checkpoint}.
     */
    restore(checkpoint) {
        this.#start = checkpoint
    }
}
