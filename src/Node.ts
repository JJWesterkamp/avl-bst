import type { Orderable } from '../AVLTree'

export class Node<T = unknown, K extends Orderable = Orderable> {
    public height: number = 1
    public left: Node<T, K> | null = null
    public right: Node<T, K> | null = null

    constructor(
        public readonly value: T,
        public readonly key: K,
    ) {
    }
}