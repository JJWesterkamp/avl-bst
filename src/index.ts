import type { AVLTreeFactories, GetKey, Orderable } from '../AVLTree'
import { AVLTree } from './AVLTree'

const factories: AVLTreeFactories = {
    create<T, K extends Orderable>(getKey: GetKey<T, K>): AVLTree<T, K> {
        return new AVLTree(getKey)
    },

    scalar<T extends Orderable = never>(): AVLTree<T, T> {
        return new AVLTree((x) => x)
    },
}

export default factories
