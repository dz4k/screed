
/**
 * @template T
 */
export default class Queue {
    /**
     * @type {T[]}
     */
    #arr

    /**
     * @type {number}
     */
    #modMask

    /**
     * @type {number}
     */
    #count = 0

    /**
     * @type {number}
     */
    #start = 0

    /**
     * 
     * @param {number} bound log_2 of the max length of the array, i.e. if the 
     *   bound is n, the maximum number of elements of the queue will be 2^n.
     */
    constructor(bound) {
        this.#modMask = 2 ** bound - 1
        this.#arr = new Array(this.#modMask + 1)
    }

    get length() {
        return this.#count
    }

    /**
     * 
     * @param {T} x 
     * @returns {Queue<T>}
     */
    enqueue(x) {
        if (this.count === this.#modMask + 1) throw "Queue full"
        this.#arr[this.#modMask & (this.#start + this.#count++)] = x
        return this
    }

    /**
     * 
     * @returns T
     */
    dequeue() {
        this.#count--
        return this.#arr[this.#modMask & (this.#start++)]
    }

    /**
     * 
     * @param {number} n 
     * @returns T
     */
    peek(n = 0) {
        return this.#arr[this.#modMask & (this.#start + n)]
    }

    /**
     * 
     * @param {number} [n=1] 
     */
    skip(n = 1) {
        this.#start = this.#modMask & (this.#start += n)
    }
}
