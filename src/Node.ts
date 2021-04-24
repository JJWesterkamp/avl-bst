import type { Orderable } from './types'

export class Node<T = unknown, K extends Orderable = Orderable> {
    public height: number = 1
    public left: Node<T> | null = null
    public right: Node<T> | null = null

    constructor(
        public readonly value: T,
        public readonly key: K,
    ) {
    }
}