import type { GetKey, IAVLTree, Orderable } from '../AVLTree'
import { Node } from './Node'
import { foldNodesLeft, foldNodesRight, forEach, insert, maxNode, minNode, search } from './functions'

export class AVLTree<T, K extends Orderable> implements IAVLTree<T, K> {

    private root: Node<T, K> | null = null

    constructor(
        private readonly getKey: GetKey<T, K>,
    ) {
    }

    public minValue(): T | null {
        return minNode(this.root)?.value ?? null
    }

    public maxValue(): T | null {
        return maxNode(this.root)?.value ?? null
    }

    public search(key: K): T | null {
        return search(this.root, key)
    }

    public forEach(fn: (element: T) => void): void {
        forEach(this.root, (node) => fn(node.value))
    }

    public foldLeft<U>(fn: (acc: U, value: T) => U, seed: U): U {
        return foldNodesLeft(this.root, (acc, node) => fn(acc, node.value), seed)
    }

    public foldRight<U>(fn: (acc: U, value: T) => U, seed: U): U {
        return foldNodesRight(this.root, (acc, node) => fn(acc, node.value), seed)
    }

    public keys(): K[] {
        return this.toArray((node) => node.key)
    }

    public values(): T[] {
        return this.toArray((node) => node.value)
    }

    public insert(value: T): void {
        this.root = insert(value, this.getKey(value), this.root)
    }

    public delete(key: K): void {
        // Todo ...
    }

    private balance(): void {
        // Todo ...
    }

    private toArray<U>(transformer: (node: Node<T, K>) => U): U[] {
        return foldNodesLeft<T, K, U[]>(this.root, (acc, node) => {
            acc.push(transformer(node))
            return acc
        }, [])
    }
}
