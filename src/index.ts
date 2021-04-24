import type { GetKey, Orderable } from './types'
import { Node } from './Node'
import { identity, foldLeft, foldRight, forEach, insert, max, min, search } from './functions'

export default class AVLTree<T, K extends Orderable> {

    /**
     * Build an AVL tree for complex values. Requires a `getKey` function that takes such
     * a complex value, and returns the key by which that value is identified.
     * @example
     * ```typescript
     * interface Foo {
     *     id: number
     * }    
     *
     * // Note: there are multiple ways the types can be specified; pick your poison!
     *
     * const myTree: AVLTree<Foo, number> = AVLTree.create((foo) => foo.id)) // using a type guard
     * const myTree = AVLTree.create<Foo, number>((foo) => foo.id))          // using explicit arguments
     * const myTree = AVLTree.create((foo: Foo) => foo.id))                  // inferred from the given function
     * ```
     */
     public static create<T, K extends Orderable>(getKey: GetKey<T, K>): AVLTree<T, K> {
        return new AVLTree(getKey)
    }

    /**
     * Build an AVL tree for scalar - orderable - values. Note that the type argument for
     * the scalar type is required for successive operations to properly type-check.
     *
     * @example
     * ```
     * const scalarTree = AVLTree.scalar<number>()
     * ```
     */
     public static scalar<T extends Orderable = never>(): AVLTree<T, T> {
        return new AVLTree(identity)
    }

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
