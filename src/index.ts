enum Ordering {
    LT = -1,
    EQ = 0,
    GT = 1,
}

type Orderable = string | number
type GetKey<T, K extends Orderable> = (element: T) => K


// ------------------------------------------------------------------------
//      Functions
// ------------------------------------------------------------------------

/**
 * Takes two values of type `K extends Orderable` and returns their ordering.
 */
function scalarCompare<K extends Orderable>(ka: K, kb: K): Ordering {
    return ka < kb ? Ordering.LT :
           ka > kb ? Ordering.GT : Ordering.EQ
}

/**
 * Returns the node within the subtree of given node containing the value that ranks lowest.
 * Returns the given node itself if it has no children.
 */
function min<T>(node: Node<T>): Node<T> {
    return node.lft ? min(node.lft) : node
}

/**
 * Returns the node within the subtree of given node containing the value that ranks highest.
 * Returns the given node itself if it has no children.
 */
function max<T>(node: Node<T>): Node<T> {
    return node.rgt ? max(node.rgt) : node
}

/**
 * Performs in-order traversal of the given node's subtree, calling the given `fn` for each
 * contained value.
 */
function forEach<T>(node: Node<T>, fn: (val: T) => void): void {
    node.lft && forEach(node.lft, fn)
    fn(node.val)
    node.rgt && forEach(node.rgt, fn)
}

// Research: Reductions in binary search trees
// https://core.ac.uk/download/pdf/81125203.pdf

/**
 * Folds (reduces) the given node's subtree left-to-right using in-order traversal.
 */
function foldLeft<T, U>(node: Node<T>, fn: (acc: U, curr: T) => U, seed: U): U {
    return seed // Todo ...
}

/**
 * Folds (reduces) the given node's subtree right-to-left using reversed in-order traversal.
 */
function foldRight<T, U>(node: Node<T>, fn: (acc: U, curr: T) => U, seed: U): U {
    return seed // Todo ...
}

/**
 * Search a value by a given `searchKey`, matching against keys of node values. Uses the
 * given `getKey` function to extract keys (orderable values) from node values.
 */
function search<T, K extends Orderable>(node: Node<T>, searchKey: K, getKey: GetKey<T, K>): T | null {
    switch (scalarCompare(searchKey, getKey(node.val))) {
        case Ordering.LT:
            return node.lft && search(node.lft, searchKey, getKey)
        case Ordering.EQ:
            return node.val
        case Ordering.GT:
            return node.rgt && search(node.rgt, searchKey, getKey)
    }
}

// ------------------------------------------------------------------------
//      Tree class wrapper
// ------------------------------------------------------------------------

/**
 *
 */
export default class Tree<T, K extends Orderable> {

    private root: Node<T> | null = null

    constructor(private readonly getKey: GetKey<T, K>) {
    }

    public min(): T | null {
        return this.root && min(this.root)?.val
    }

    public max(): T | null {
        return this.root && max(this.root)?.val
    }

    public search(key: K): T | null {
        return this.root && search(this.root, key, this.getKey)
    }

    public forEach(fn: (element: T) => void): void {
        this.root && forEach(this.root, fn)
    }

    public foldLeft<U>(fn: (acc: U, curr: T) => U, seed: U): U {
        return this.root ? foldLeft(this.root, fn, seed) : seed
    }

    public foldRight<U>(fn: (acc: U, curr: T) => U, seed: U): U {
        return this.root ? foldRight(this.root, fn, seed) : seed
    }

    public insert(value: T): void {
        const node = new Node(value)
        // Todo ...
    }

    private balance(): void {
        // Todo ...
    }
}

// ------------------------------------------------------------------------
//      Node class
// ------------------------------------------------------------------------

class Node<T> {
    public height: number
    public lft: Node<T> | null = null
    public rgt: Node<T> | null = null

    constructor(public readonly val: T) {
    }
}
