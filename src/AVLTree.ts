import type { GetKey, IAVLTree, Ord } from '../AVLTree'
import { Node } from './Node'
import { foldNodesLeft, foldNodesRight, forEach, insert, maxNode, minNode, search } from './functions'

export class AVLTree<K extends Ord, V> implements IAVLTree<K, V> {

    private root: Node<K, V> | null = null

    constructor(
        private readonly getKey: GetKey<K, V>,
    ) {
    }

    public minValue(): V | null {
        return minNode(this.root)?.value ?? null
    }

    public maxValue(): V | null {
        return maxNode(this.root)?.value ?? null
    }

    public search(key: K): V | null {
        return search(this.root, key)
    }

    public forEach(fn: (element: V) => void): void {
        forEach(this.root, (node) => fn(node.value))
    }

    public foldLeft<T>(fn: (acc: T, value: V) => T, seed: T): T {
        return foldNodesLeft(this.root, (acc, node) => fn(acc, node.value), seed)
    }

    public foldRight<T>(fn: (acc: T, value: V) => T, seed: T): T {
        return foldNodesRight(this.root, (acc, node) => fn(acc, node.value), seed)
    }

    public keys(): K[] {
        return this.toArray((node) => node.key)
    }

    public values(): V[] {
        return this.toArray((node) => node.value)
    }

    public insert(value: V): void {
        this.root = insert(this.getKey(value), value, this.root)
    }

    public delete(key: K): void {
        // Todo ...
    }

    private toArray<T>(transformer: (node: Node<K, V>) => T): T[] {
        return foldNodesLeft<K, V, T[]>(this.root, (acc, node) => {
            acc.push(transformer(node))
            return acc
        }, [])
    }
}
