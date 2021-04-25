import type { AVLTreeFactories, GetKey, Ord } from '../avl-bst'
import { AVLTree } from './AVLTree'

const factories: AVLTreeFactories = {
    create<K extends Ord, V>(getKey: GetKey<K, V>): AVLTree<K, V> {
        return new AVLTree(getKey)
    },

    scalar<T extends Ord = never>(): AVLTree<T, T> {
        return new AVLTree((x) => x)
    },
}

export default factories
