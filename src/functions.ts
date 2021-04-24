import type { Ord } from '../AVLTree'
import { Node } from './Node'

export const enum Ordering {
    LT = -1,
    EQ = 0,
    GT = 1,
}

/**
 * Returns the node within the subtree of given node that ranks lowest.
 * Returns the given node itself if it has no children, or `null`
 * if the given node is itself `null`.
 */
export function minNode<K extends Ord, V>(node: Node<K, V> | null): Node<K, V> | null {
    return node === null ? null : minNode(node.left) ?? node
}

/**
 * Returns the node within the subtree of given node that ranks highest.
 * Returns the given node itself if it has no children, or `null`
 * if the given node is itself `null`.
 */
export function maxNode<K extends Ord, V>(node: Node<K, V> | null): Node<K, V> | null {
    return node === null ? null : maxNode(node.right) ?? node
}

/**
 * Performs in-order traversal of the given node's subtree, applying the given
 * `fn` to each contained value.
 */
export function forEach<K extends Ord, V>(node: Node<K, V> | null, fn: (node: Node<K, V>) => void): void {
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
export function foldNodesLeft<K extends Ord, V, T>(node: Node<K, V> | null, fn: (acc: T, curr: Node<K, V>) => T, seed: T): T {
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
export function foldNodesRight<K extends Ord, V, T>(node: Node<K, V> | null, fn: (acc: T, curr: Node<K, V>) => T, seed: T): T {
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
export function search<K extends Ord, V>(node: Node<K, V> | null, searchKey: K): V | null {
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
 * Inserts the given key an corresponding value into the tree of the given node.
 */
 export function insert<K extends Ord, V>(key: K, val: V, node: Node<K, V> | null): Node<K, V> {

    if (node === null) {
        return new Node(key, val)
    }

    switch (scalarCompare(key, node.key)) {
        case Ordering.LT:
            node.left = insert(key, val, node.left)
            break

        case Ordering.GT:
            node.right = insert(key, val, node.right)
            break
    }

    updateNodeHeight(node)

    if (nodeBalance(node) < -1) {
        switch (scalarCompare(key, node.left!.key)) {

            /*────────────────────────────────────────────────────────────────────────────────────────┐
            │      Left - Left case                                                                   │
            ├─────────────────────────────────────────────────────────────────────────────────────────┤
            │           z                                      y                                      │
            │          / \                                   /   \                                    │
            │         y   T4      Right Rotate (z)          x      z                                  │
            │        / \          - - - - - - - - ->      /  \    /  \                                │
            │       x   T3                               T1  T2  T3  T4                               │
            │      / \                                                                                │
            │    T1   T2                                                                              │
            └────────────────────────────────────────────────────────────────────────────────────────*/
            case Ordering.LT:
                return rotateRight(node)

            /*────────────────────────────────────────────────────────────────────────────────────────┐
            │      Left - Right case                                                                  │
            ├─────────────────────────────────────────────────────────────────────────────────────────┤
            │         z                                  z                                x           │
            │        / \                               /   \                             /  \         │
            │       y   T4    Left Rotate (y)         x     T4   Right Rotate(z)       y      z       │
            │      / \        - - - - - - - - ->     /  \        - - - - - - - ->     / \    / \      │
            │    T1   x                             y    T3                         T1  T2  T3  T4    │
            │        / \                           / \                                                │
            │      T2   T3                       T1   T2                                              │
            └────────────────────────────────────────────────────────────────────────────────────────*/
            case Ordering.GT:
                node.left = rotateLeft(node.left!)
                return rotateRight(node)
        }
    }

    if (nodeBalance(node) > 1) {
        switch (scalarCompare(key, node.right!.key)) {

            /*────────────────────────────────────────────────────────────────────────────────────────┐
            │      Right - Left case                                                                  │
            ├─────────────────────────────────────────────────────────────────────────────────────────┤
            │      z                                z                                 x               │
            │     / \                              / \                               /  \             │
            │   T1   y     Right Rotate (y)      T1   x        Left Rotate(z)      z      y           │
            │       / \    - - - - - - - - ->       /  \     - - - - - - - ->     / \    / \          │
            │      x   T4                         T2    y                       T1  T2  T3  T4        │
            │     / \                                  /  \                                           │
            │   T2   T3                               T3   T4                                         │
            └────────────────────────────────────────────────────────────────────────────────────────*/
            case Ordering.LT:
                node.right = rotateRight(node.right!)
                return rotateLeft(node)

            /*────────────────────────────────────────────────────────────────────────────────────────┐
            │      Right - Right case                                                                 │
            ├─────────────────────────────────────────────────────────────────────────────────────────┤
            │       z                                   y                                             │
            │      /  \                               /   \                                           │
            │    T1    y       Left Rotate(z)        z      x                                         │
            │         /  \     - - - - - - - ->     / \    / \                                        │
            │       T2    x                        T1  T2 T3  T4                                      │
            │             / \                                                                         │
            │           T3   T4                                                                       │
            └────────────────────────────────────────────────────────────────────────────────────────*/
            case Ordering.GT:
                return rotateLeft(node)
        }
    }

    return node
}

/**
 * Returns the height of given node or zero if the node is `null`.
 */
 export function nodeHeight(node: Node | null): number {
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
export function scalarCompare<K extends Ord>(ka: K, kb: K): Ordering {
    return ka < kb ? Ordering.LT :
           ka > kb ? Ordering.GT : Ordering.EQ
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
 * ```
 */
export function rotateLeft<K extends Ord, V>(node: Node<K, V>): Node<K, V> {
    if (node.right === null) {
        throw new Error('Cannot left-rotate a node without a right child')
    }

    const R  = node.right
    const RL = node.right.left

    R.left = node
    node.right = RL

    updateNodeHeight(node)
    updateNodeHeight(R)

    return R
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
export function rotateRight<K extends Ord, V>(node: Node<K, V>): Node<K, V> {
    if (node.left === null) {
        throw new Error('Cannot right-rotate a node without a left child')
    }

    const L  = node.left
    const LR = node.left.right

    L.right = node
    node.left = LR

    updateNodeHeight(node)
    updateNodeHeight(L)

    return L
}
