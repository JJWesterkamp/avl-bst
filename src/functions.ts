import type { Ord } from '../AVLTree'
import { Node } from './Node'

// ------------------------------------------------------------------------------
//      AVLTree functions
// ------------------------------------------------------------------------------
//
//      The functional recursive algorithms used by the AVLTree class, and
//      some additional helper functions. These perform outside of the tree
//      class context, and take nodes to operate on. This makes them reusable
//      for many more applications.
//
//      While the AVLTree interface only exposes its contained values -- I
//      consider nodes an implementation detail -- the functions here return
//      nodes with these values within, so that internally we can easily
//      traverse subtrees and otherwise operate on them.

export const enum Ordering {
    LT = -1,
    EQ = 0,
    GT = 1,
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
 * of its left and right subtrees. Returns a negative number if the node's
 * left child is the higher height child, or a positive number if the right
 * child is the higher height child. Returns zero if either the node is `null`
 * or both its children have equal height.
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
 * Inserts the given key an corresponding value into the sub-tree of the given node.
 * Returns an array of length 2 with at:
 * - index 0 = the node that takes the place of given node after insertion and re-balancing,
 *   which might also be the given node itself.
 * - index 1 = A boolean indicating whether the new key and value were actually inserted.
 *   This will be `false` if the key was already in the tree prior to insertion.
 */
 export function insert<K extends Ord, V>(key: K, val: V, node: Node<K, V> | null): [Node<K, V>, boolean] {
    if (node === null) {
        return [new Node(key, val), true]
    }

    let isInserted: boolean

    switch (scalarCompare(key, node.key)) {
        case Ordering.EQ:
            return [node, false]

        case Ordering.LT:
            [node.left, isInserted] = insert(key, val, node.left)
            break

        case Ordering.GT:
            [node.right, isInserted] = insert(key, val, node.right)
            break
    }

    if (! isInserted) {
        return [node, false]
    }

    updateNodeHeight(node)
    return [balanceNode(node), true]
}

/**
 * Deletes the node by given key from the subtree of given node. Returns the node
 * that takes the place of the given node after deletion and re-balancing, which
 * might also be the given node itself.
 */
export function deleteKey<K extends Ord, V>(key: K, node: Node<K, V>): Node<K, V> {
    return node // Todo ...
}

/**
 * Balances the given node if it is unbalanced. Returns the node that takes the place of the
 * given node after balancing, which is the given node itself if no balancing is required.
 */
function balanceNode<K extends Ord, V>(node: Node<K, V>): Node<K, V> {
    const zBalance = nodeBalance(node)
    const lBalance = nodeBalance(node.left)
    const rBalance = nodeBalance(node.right)

    /*────────────────────────────────────────────────────────────────────────────────────────┐
    │                                  Left - Left case                                       │
    ├─────────────────────────────────────────────────────────────────────────────────────────┤
    │                      z                                      y                           │
    │                     / \                                   /   \                         │
    │                    y   T4      Right Rotate (z)          x      z                       │
    │                   / \          - - - - - - - - ->      /  \    /  \                     │
    │                  x   T3                               T1  T2  T3  T4                    │
    │                 / \                                                                     │
    │               T1   T2                                                                   │
    └────────────────────────────────────────────────────────────────────────────────────────*/
    if (zBalance < -1 && lBalance <= 0) {
        return rotateRight(node)
    }

    /*────────────────────────────────────────────────────────────────────────────────────────┐
    │                                 Left - Right case                                       │
    ├─────────────────────────────────────────────────────────────────────────────────────────┤
    │         z                                  z                                x           │
    │        / \                               /   \                             /  \         │
    │       y   T4    Left Rotate (y)         x     T4   Right Rotate(z)       y      z       │
    │      / \        - - - - - - - - ->     /  \        - - - - - - - ->     / \    / \      │
    │    T1   x                             y    T3                         T1  T2  T3  T4    │
    │        / \                           / \                                                │
    │      T2   T3                       T1   T2                                              │
    └────────────────────────────────────────────────────────────────────────────────────────*/
    if (zBalance < -1 && lBalance > 0) {
        node.left = rotateLeft(node.left!)
        return rotateRight(node)
    }

    /*────────────────────────────────────────────────────────────────────────────────────────┐
    │                                  Right - Left case                                      │
    ├─────────────────────────────────────────────────────────────────────────────────────────┤
    │      z                                z                                 x               │
    │     / \                              / \                               /  \             │
    │   T1   y     Right Rotate (y)      T1   x        Left Rotate(z)      z      y           │
    │       / \    - - - - - - - - ->       /  \     - - - - - - - ->     / \    / \          │
    │      x   T4                         T2    y                       T1  T2  T3  T4        │
    │     / \                                  /  \                                           │
    │   T2   T3                               T3   T4                                         │
    └────────────────────────────────────────────────────────────────────────────────────────*/
    if (zBalance > 1 && rBalance < 0) {
        node.right = rotateRight(node.right!)
        return rotateLeft(node)
    }

    /*────────────────────────────────────────────────────────────────────────────────────────┐
    │                                 Right - Right case                                      │
    ├─────────────────────────────────────────────────────────────────────────────────────────┤
    │                       z                                   y                             │
    │                      /  \                               /   \                           │
    │                    T1    y       Left Rotate(z)        z      x                         │
    │                         /  \     - - - - - - - ->     / \    / \                        │
    │                       T2    x                        T1  T2 T3  T4                      │
    │                             / \                                                         │
    │                           T3   T4                                                       │
    └────────────────────────────────────────────────────────────────────────────────────────*/
    if (zBalance > 1 && rBalance >= 0) {
        return rotateLeft(node)
    }

    return node
}

/**
 * Performs a left rotation on the given node. Returns the node that takes the
 * place of the given node after rotation.
 *
 * ```text
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ argument -> z                                      y <- return   │
 * │            /  \                                  /   \           │
 * │           T1   y         rotateLeft(z)          z      x         │
 * │               /  \       - - - - - - - ->      / \    / \        │
 * │              T2   x                           T1  T2 T3  T4      │
 * │                  / \                                             │
 * │                T3  T4                                            │
 * └──────────────────────────────────────────────────────────────────┘
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
 * Performs a right rotation on the given node. Returns the node that takes the
 * place of the given node after rotation.
 *
 * ```text
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ argument -> z                                      y <- return   │
 * │            / \                                   /   \           │
 * │           y   T4      rotateRight(z)            x      z         │
 * │          / \          - - - - - - - - ->      /  \    /  \       │
 * │         x   T3                               T1  T2  T3  T4      │
 * │        / \                                                       │
 * │      T1   T2                                                     │
 * └──────────────────────────────────────────────────────────────────┘
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
