import type { IAVLTree, GetKey, Orderable } from "../AVLTree"
import { Node } from './Node'
import { foldLeft, foldRight, forEach, insert, max, min, search } from './functions'

export class AVLTree<T, K extends Orderable> implements IAVLTree<T, K> {

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
        return search(this.root, key)
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

    public keys(): K[] {
        return this.foldLeft((acc: K[], curr: T) => [...acc, this.getKey(curr)], [])
    }

    public toArray(): T[] {
        return this.foldLeft((acc: T[], curr:T) => [...acc, curr], [])
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
}
