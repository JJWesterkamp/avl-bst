const enum Ordering {
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
 * Updates the given node's height property based on the current heights
 * of its left and right subtrees.
 */
function updateNodeHeight(node: Node): void {
    node.height = 1 + Math.max(
        nodeHeight(node.left),
        nodeHeight(node.right),
    )
}

/**
 * Returns the given node's balance: the relationship between the heights
 * of its left and right subtrees. Returns zero if the node is `null`.
 */
function nodeBalance(node: Node | null): number {
    return node ? nodeHeight(node.right) - nodeHeight(node.left) : 0
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
    return node === null ? null : min(node.left) ?? node.value
}

/**
 * Returns the value if the node within the subtree of given node containing the value that ranks highest.
 * Returns the value of the given node itself if it has no children.
 */
function max<T>(node: Node<T> | null): T | null {
    return node === null ? null : max(node.right) ?? node.value
}

/**
 * Performs in-order traversal of the given node's subtree, calling the given `fn` for each
 * contained value.
 */
function forEach<T>(node: Node<T> | null, fn: (val: T) => void): void {
    if (node === null) {
        return
    }

    forEach(node.left, fn)
    fn(node.value)
    forEach(node.right, fn)
}

/**
 * Folds (reduces) the given node's subtree left-to-right using in-order traversal.
 */
function foldLeft<T, U>(node: Node<T> | null, fn: (acc: U, curr: T) => U, seed: U): U {
    if (node === null) {
        return seed
    }

    seed = foldLeft(node.left, fn, seed)
    seed = fn(seed, node.value)
    return foldLeft(node.right, fn, seed)
}

/**
 * Folds (reduces) the given node's subtree right-to-left using reversed in-order traversal.
 */
function foldRight<T, U>(node: Node<T> | null, fn: (acc: U, curr: T) => U, seed: U): U {
    if (node === null) {
        return seed
    }

    seed = foldRight(node.right, fn, seed)
    seed = fn(seed, node.value)
    return foldRight(node.left, fn, seed)
}

/**
 * Search a value by a given `searchKey`, matching against keys of node values. Uses the
 * given `getKey` function to extract keys (orderable values) from node values.
 */
function search<T, K extends Orderable>(node: Node<T> | null, searchKey: K, getKey: GetKey<T, K>): T | null {
    if (node === null) {
        return null
    }

    switch (scalarCompare(searchKey, getKey(node.value))) {
        case Ordering.LT:
            return search(node.left, searchKey, getKey)
        case Ordering.EQ:
            return node.value
        case Ordering.GT:
            return search(node.right, searchKey, getKey)
    }
}

/**
 *
 */
function insert<T, K extends Orderable>(value: T, node: Node<T> | null, getKey: GetKey<T, K>): Node<T> {

    if (node === null) {
        return new Node(value)
    }

    switch (scalarCompare(getKey(value), getKey(node.value))) {
        case Ordering.LT:
            node.left = insert(value, node.left, getKey)
            break

        case Ordering.GT:
            node.right = insert(value, node.right, getKey)
            break
    }

    updateNodeHeight(node)

    const balance = nodeBalance(node)

    // Left - (Left | Right) case
    if (balance < -1) {
        const subOrdering = scalarCompare(getKey(value), getKey(node.left!.value))

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
            node.left = rotateLeft(node.left!)
            return rotateRight(node)
        }
    }

    // Right - (Left | Right) case
    if (balance > 1) {
        const subOrdering = scalarCompare(getKey(value), getKey(node.right!.value))

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
            node.right = rotateRight(node.right!)
            return rotateLeft(node)
        }
    }

    return node
}

/**
 * Performs a left rotation on the given node.
 */
function rotateLeft<T>(node: Node<T>): Node<T> {
    const rightChild          = node.right!
    const rightLeftGrandchild = node.right!.left

	rightChild.left = node
	node.right = rightLeftGrandchild

    updateNodeHeight(node)
    updateNodeHeight(rightChild)

	return rightChild
}

/**
 * Performs a right rotation on the given node.
 */
function rotateRight<T>(node: Node<T>): Node<T> {
    const leftChild           = node.left!
    const leftRightGrandchild = node.left!.right

	leftChild.right = node
	node.left = leftRightGrandchild

    updateNodeHeight(node)
    updateNodeHeight(leftChild)

    return leftChild
}

// ------------------------------------------------------------------------
//      Tree class wrapper
// ------------------------------------------------------------------------

export default class AVLTree<T, K extends Orderable> {

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
    public left: Node<T> | null = null
    public right: Node<T> | null = null

    constructor(public readonly value: T) {
    }
}
