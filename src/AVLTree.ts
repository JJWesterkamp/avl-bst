/**
 * This module holds the class implementation of the public API interface
 * {@link IAVLTree `IAVLTree`}.
 *
 * @module Internal - AVLTree
 */

import type { GetKey, IAVLTree, Ord } from '../avl-bst'
import { AVLNode as Node } from './AVLNode'
import { deleteKey, foldLeft, foldRight, traverseInOrder, insert, maxNode, minNode, search } from './functions'

/**
 * The class implementation of the public API interface {@link IAVLTree `IAVLTree`}.
 *
 * @typeParam K The key type that is derived from tree values, in order to compare their order.
 * @typeParam V The type of values that are to be stored in the tree.
 */
export class AVLTree<K extends Ord, V> implements IAVLTree<K, V> {

    private root: Node<K, V> | null = null

    constructor(
        private readonly getKey: GetKey<K, V>,
    ) {
    }

    public isEmpty(): boolean {
        return this.root === null
    }

    public size(): number {
        return this.root?.size ?? 0
    }

    public minValue(): V | null {
        return minNode(this.root)?.value ?? null
    }

    public maxValue(): V | null {
        return maxNode(this.root)?.value ?? null
    }

    public search(key: K): V | null {
        return search(this.root, key)?.value ?? null
    }

    public forEach(fn: (element: V) => void): void {
        traverseInOrder(this.root, (node) => fn(node.value))
    }

    public foldLeft<T>(fn: (acc: T, value: V) => T, seed: T): T {
        return foldLeft(this.root, (acc, node) => fn(acc, node.value), seed)
    }

    public foldRight<T>(fn: (acc: T, value: V) => T, seed: T): T {
        return foldRight(this.root, (acc, node) => fn(acc, node.value), seed)
    }

    public keys(): K[] {
        return this.toArray((node) => node.key)
    }

    public values(): V[] {
        return this.toArray((node) => node.value)
    }

    public insert(value: V): boolean {
        const [rootAfterInsertion, isInserted] = insert(this.getKey(value), value, this.root)
        this.root = rootAfterInsertion
        return isInserted
    }

    public delete(key: K): boolean {
        const [rootAfterDeletion, isDeleted] = deleteKey(key, this.root)
        this.root = rootAfterDeletion
        return isDeleted
    }

    private toArray<T>(transformer: (node: Node<K, V>) => T): T[] {
        return foldLeft<K, V, T[]>(this.root, (acc, node) => {
            acc.push(transformer(node))
            return acc
        }, [])
    }
}
