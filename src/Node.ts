import type { Ord } from '../AVLTree'

export class Node<K extends Ord = Ord, V = unknown> {
    public height: number = 1
    public left: Node<K, V> | null = null
    public right: Node<K, V> | null = null

    constructor(
        public readonly key: K,
        public readonly value: V,
    ) {
    }
}
