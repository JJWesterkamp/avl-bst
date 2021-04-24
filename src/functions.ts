import type { Orderable } from '../AVLTree'
import { Node } from './Node'

export const enum Ordering {
    LT = -1,
    EQ = 0,
    GT = 1,
}

export const enum BalanceCase {
    LL = 'LL',
    LR = 'LR',
    RL = 'RL',
    RR = 'RR',
}

/**
 * Returns the node within the subtree of given node that ranks lowest.
 * Returns the given node itself if it has no children, or `null`
 * if the given node is itself `null`.
 */
export function minNode<T, K extends Orderable>(node: Node<T, K> | null): Node<T, K> | null {
    return node === null ? null : minNode(node.left) ?? node
}

/**
 * Returns the node within the subtree of given node that ranks highest.
 * Returns the given node itself if it has no children, or `null`
 * if the given node is itself `null`.
 */
export function maxNode<T, K extends Orderable>(node: Node<T, K> | null): Node<T, K> | null {
    return node === null ? null : maxNode(node.right) ?? node
}

/**
 * Performs in-order traversal of the given node's subtree, applying the given
 * `fn` to each contained value.
 */
export function forEach<T, K extends Orderable>(node: Node<T, K> | null, fn: (node: Node<T, K>) => void): void {
    if (node === null) {
        return
    }

    forEach(node.left, fn)
    fn(node)
    forEach(node.right, fn)
}

/**
 * Folds (reduces) the given node's subtree left-to-right using in-order traversal.
 */
export function foldNodesLeft<T, K extends Orderable, U>(node: Node<T, K> | null, fn: (acc: U, curr: Node<T, K>) => U, seed: U): U {
    if (node === null) {
        return seed
    }

    seed = foldNodesLeft(node.left, fn, seed)
    seed = fn(seed, node)
    return foldNodesLeft(node.right, fn, seed)
}

/**
 * Folds (reduces) the given node's subtree right-to-left using reversed in-order traversal.
 */
export function foldNodesRight<T, K extends Orderable, U>(node: Node<T, K> | null, fn: (acc: U, curr: Node<T, K>) => U, seed: U): U {
    if (node === null) {
        return seed
    }

    seed = foldNodesRight(node.right, fn, seed)
    seed = fn(seed, node)
    return foldNodesRight(node.left, fn, seed)
}

/**
 * Search a value by a given `searchKey`, matching against keys of nodes.
 */
export function search<T, K extends Orderable>(node: Node<T> | null, searchKey: K): T | null {
    if (node === null) {
        return null
    }

    switch (scalarCompare(searchKey, node.key)) {
        case Ordering.LT:
            return search(node.left, searchKey)

        case Ordering.EQ:
            return node.value

        case Ordering.GT:
            return search(node.right, searchKey)
    }
}

/**
 * Inserts a value into the tree of a givrn node. Additionally requires a getKey function to
 * extract keys from nodes in the tree for comparison.
 */
 export function insert<T, K extends Orderable>(insertValue: T, insertKey: K, node: Node<T, K> | null): Node<T, K> {

    if (node === null) {
        return new Node(insertValue, insertKey)
    }

    switch (scalarCompare(insertKey, node.key)) {
        case Ordering.LT:
            node.left = insert(insertValue, insertKey, node.left)
            break

        case Ordering.GT:
            node.right = insert(insertValue, insertKey, node.right)
            break
    }

    updateNodeHeight(node)

    switch (getBalanceCase(insertKey, node)) {
        case BalanceCase.LL:
            return rotateRight(node)

        case BalanceCase.LR:
            node.left = rotateLeft(node.left!)
            return rotateRight(node)

        case BalanceCase.RL:
            node.right = rotateRight(node.right!)
            return rotateLeft(node)

        case BalanceCase.RR:
            return rotateLeft(node)

        default:
            return node
    }
}

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
export function updateNodeHeight(node: Node): void {
    node.height = 1 + Math.max(
        nodeHeight(node.left),
        nodeHeight(node.right),
    )
}

/**
 * Returns the given node's balance: the relationship between the heights
 * of its left and right subtrees. Returns zero if the node is `null`.
 */
export function nodeBalance(node: Node | null): number {
    return node ? nodeHeight(node.right) - nodeHeight(node.left) : 0
}

/**
 * Takes two values of type `K extends Orderable` and returns their ordering.
 */
export function scalarCompare<K extends Orderable>(ka: K, kb: K): Ordering {
    return ka < kb ? Ordering.LT :
           ka > kb ? Ordering.GT : Ordering.EQ
}

/**
 * Takes the key of an inserted value and a potentially unbalanced ancestor node, and returns
 * the BalanceCase for re-balancing the node if it is unbalanced after insertion. Returns `null`
 * otherwise.
 */
export function getBalanceCase<T, K extends Orderable>(insertKey: K, node: Node<T, K>): BalanceCase | null {
    const balance = nodeBalance(node)

    if (balance < -1) {
        const subOrdering = scalarCompare(insertKey, node.left!.key)
        return subOrdering === Ordering.LT ? BalanceCase.LL :
               subOrdering === Ordering.GT ? BalanceCase.LR : null
    } else if (balance > 1) {
        const subOrdering = scalarCompare(insertKey, node.right!.key)
        return subOrdering === Ordering.LT ? BalanceCase.RL :
               subOrdering === Ordering.GT ? BalanceCase.RR : null
    } else {
        return null
    }
}

/**
 * Performs a left rotation on the given node.
 * ```text
 *   z                                  y
 *  /  \                              /   \
 * T1   y       rotateLeft(z)        z      x
 *     /  \     - - - - - - - ->    / \    / \
 *    T2   x                       T1  T2 T3  T4
 *        / \
 *      T3  T4
 *
 * ```
 */
export function rotateLeft<T, K extends Orderable>(z: Node<T, K>): Node<T, K> {
    if (z.right === null) {
        throw new Error('Cannot left-rotate a node without a right child')
    }

    const y  = z.right
    const T2 = z.right.left

    y.left  = z
    z.right = T2

    updateNodeHeight(z)
    updateNodeHeight(y)

    return y
}

/**
 * Performs a right rotation on the given node.
 *
 * ```text
 *        z                                      y
 *       / \                                   /   \
 *      y   T4      rotateRight(z)            x      z
 *     / \          - - - - - - - - ->      /  \    /  \
 *    x   T3                               T1  T2  T3  T4
 *   / \
 * T1   T2
 * ```
 */
export function rotateRight<T, K extends Orderable>(z: Node<T, K>): Node<T, K> {
    if (z.left === null) {
        throw new Error('Cannot right-rotate a node without a left child')
    }

    const y  = z.left
    const T3 = z.left.right

    y.right = z
    z.left = T3

    updateNodeHeight(z)
    updateNodeHeight(y)

    return y
}
