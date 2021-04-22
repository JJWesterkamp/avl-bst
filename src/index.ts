enum Ordering {
    LT = -1,
    EQ = 0,
    GT = 1,
}

type Orderable = string | number
type GetKey<T, K extends Orderable> = (element: T) => K

enum BalanceCase {
    LL,
    LR,
    RL,
    RR,
}

// ------------------------------------------------------------------------
//      Functions
// ------------------------------------------------------------------------

/**
 * Returns the height of given node or zero if the node is `null`.
 */
function nodeHeight(node: Node | null): number {
    return node?.height ?? 0
}

/**
 * Returns the given node's balance: the relationship between the heights
 * of its left and right subtrees. Returns zero if the node is `null`.
 */
function nodeBalance(node: Node | null): number {
    return node ? nodeHeight(node.rgt) - nodeHeight(node.lft) : 0
}

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
function min<T>(node: Node<T> | null): T | null {
    return node === null ? null : min(node.lft) ?? node.val
}

/**
 * Returns the value if the node within the subtree of given node containing the value that ranks highest.
 * Returns the value of the given node itself if it has no children.
 */
function max<T>(node: Node<T> | null): T | null {
    return node === null ? null : max(node.rgt) ?? node.val
}

/**
 * Performs in-order traversal of the given node's subtree, calling the given `fn` for each
 * contained value.
 */
function forEach<T>(node: Node<T> | null, fn: (val: T) => void): void {
    if (node === null) {
        return
    }

    forEach(node.lft, fn)
    fn(node.val)
    forEach(node.rgt, fn)
}

/**
 * Folds (reduces) the given node's subtree left-to-right using in-order traversal.
 */
function foldLeft<T, U>(node: Node<T> | null, fn: (acc: U, curr: T) => U, seed: U): U {
    if (node === null) {
        return seed
    }

    seed = foldLeft(node.lft, fn, seed)
    seed = fn(seed, node.val)
    return foldLeft(node.rgt, fn, seed)
}

/**
 * Folds (reduces) the given node's subtree right-to-left using reversed in-order traversal.
 */
function foldRight<T, U>(node: Node<T> | null, fn: (acc: U, curr: T) => U, seed: U): U {
    if (node === null) {
        return seed
    }

    seed = foldRight(node.rgt, fn, seed)
    seed = fn(seed, node.val)
    return foldRight(node.lft, fn, seed)
}

/**
 * Search a value by a given `searchKey`, matching against keys of node values. Uses the
 * given `getKey` function to extract keys (orderable values) from node values.
 */
function search<T, K extends Orderable>(node: Node<T> | null, searchKey: K, getKey: GetKey<T, K>): T | null {
    if (node === null) {
        return null
    }

    switch (scalarCompare(searchKey, getKey(node.val))) {
        case Ordering.LT:
            return search(node.lft, searchKey, getKey)
        case Ordering.EQ:
            return node.val
        case Ordering.GT:
            return search(node.rgt, searchKey, getKey)
    }
}

/**
 *
 */
function insert<T, K extends Orderable>(value: T, node: Node<T> | null, getKey: GetKey<T, K>): Node<T> {

    if (node === null) {
        return new Node(value)
    }

    switch (scalarCompare(getKey(value), getKey(node.val))) {
        case Ordering.LT:
            node.lft = insert(value, node.lft, getKey)
            break

        case Ordering.GT:
            node.rgt = insert(value, node.rgt, getKey)
            break
    }

    node.height = 1 + Math.max(
        nodeHeight(node.lft),
        nodeHeight(node.rgt),
    )

    // https://www.geeksforgeeks.org/avl-tree-set-1-insertion/

    const balance = nodeBalance(node)

    // Left - (Left | Right) case
    if (balance < -1) {
        const subOrdering = scalarCompare(getKey(value), getKey(node.lft!.val))

        // Left - Left case
        //          z                                      y
        //         / \                                   /   \
        //        y   T4      Right Rotate (z)          x      z
        //       / \          - - - - - - - - ->      /  \    /  \
        //      x   T3                               T1  T2  T3  T4
        //     / \
        //   T1   T2
        if (subOrdering === Ordering.LT) {
            return rotateRight(node)
        }

        // Left - Right case
        //      z                               z                           x
        //     / \                            /   \                        /  \
        //    y   T4  Left Rotate (y)        x    T4  Right Rotate(z)    y      z
        //   / \      - - - - - - - - ->    /  \      - - - - - - - ->  / \    / \
        // T1   x                          y    T3                    T1  T2 T3  T4
        //     / \                        / \
        //   T2   T3                    T1   T2
        if (subOrdering === Ordering.GT) {
            node.lft = rotateLeft(node.lft!)
            return rotateRight(node)
        }
    }

    // Right - (Left | Right) case
    if (balance > 1) {
        const subOrdering = scalarCompare(getKey(value), getKey(node.rgt!.val))

        // Right - Right case
        //      z                                y
        //     /  \                            /   \
        //    T1   y     Left Rotate(z)       z      x
        //        /  \   - - - - - - - ->    / \    / \
        //       T2   x                     T1  T2 T3  T4
        //           / \
        //         T3  T4
        if (subOrdering === Ordering.GT) {
            return rotateLeft(node)
        }

        // Right - Left case
        //      z                            z                            x
        //     / \                          / \                          /  \
        //   T1   y   Right Rotate (y)    T1   x      Left Rotate(z)   z      y
        //       / \  - - - - - - - - ->     /  \   - - - - - - - ->  / \    / \
        //      x   T4                      T2   y                  T1  T2  T3  T4
        //     / \                              /  \
        //   T2   T3                           T3   T4
        if (subOrdering === Ordering.LT) {
            node.rgt = rotateRight(node.rgt!)
            return rotateLeft(node)
        }
    }

    return node
}

/**
 * Performs a left rotation on the given node.
 */
function rotateLeft<T>(node: Node<T>): Node<T> {
    return node // Todo ...
}

/**
 * Performs a right rotation on the given node.
 */
function rotateRight<T>(node: Node<T>): Node<T> {
    return node // Todo ...
}

// ------------------------------------------------------------------------
//      Tree class wrapper
// ------------------------------------------------------------------------

export default class Tree<T, K extends Orderable> {

    private root: Node<T> | null = null

    constructor(private readonly getKey: GetKey<T, K>) {
    }

    public min(): T | null {
        return min(this.root)
    }

    public max(): T | null {
        return max(this.root)
    }

    public search(key: K): T | null {
        return search(this.root, key, this.getKey)
    }

    public forEach(fn: (element: T) => void): void {
        forEach(this.root, fn)
    }

    public foldLeft<U>(fn: (acc: U, curr: T) => U, seed: U): U {
        return foldLeft(this.root, fn, seed)
    }

    public foldRight<U>(fn: (acc: U, curr: T) => U, seed: U): U {
        return foldRight(this.root, fn, seed)
    }

    // Great video: https://www.youtube.com/watch?v=TbvhGcf6UJU

    public insert(value: T): void {
        this.root = insert(value, this.root, this.getKey)
    }

    public delete(key: K): void {
        // Todo ...
    }

    private balance(): void {
        // Todo ...
    }
}

// ------------------------------------------------------------------------
//      Node class
// ------------------------------------------------------------------------

class Node<T = unknown> {
    public height: number = 1
    public lft: Node<T> | null = null
    public rgt: Node<T> | null = null

    constructor(public readonly val: T) {
    }
}
