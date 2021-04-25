/**
 * ------------------------------------------------------------------------------
 * ## AVLNode class
 * ------------------------------------------------------------------------------
 *
 * This module holds the class implementation of the AVLNode tree nodes.
 *
 * @module Internal - AVLNode
 */

import type { Ord } from '../avl-bst'


/**
 * This is the class implementation of the AVL tree nodes.
 *
 * @typeParam K The key type of the node.
 * @typeParam V The value type of the node.
 */
export class AVLNode<K extends Ord = Ord, V = unknown> {

    /**
     * The height of the node: 1 plus the height of the greater height child of the node.
     * Nodes without children have a height of 1.
     */
    public height: number = 1

    /**
     * The size of the node: the amount of nodes (including this node itself)
     * within the node's subtree.
     * @type {number}
     */
    public size: number = 1

    /**
     * The left child of the node.
     */
    public left: AVLNode<K, V> | null = null

    /**
     * The right child of the node.
     */
    public right: AVLNode<K, V> | null = null

    /**
     * @param key The key of the new node.
     * @param value The value of the new node.
     */
    constructor(
        public key: K,
        public value: V,
    ) {
    }
}
