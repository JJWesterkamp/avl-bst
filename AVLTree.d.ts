/**
 * The native orderable types whose relative order can be compared with `>` and `<`.
 */
export type Ord = string | number

/**
 * The signature for functions that derive orderable keys from complex values.
 */
export type GetKey<K extends Ord = Ord, V = unknown> = (element: V) => K

/**
 * The creation methods for AVL tree instances.
 */
export interface AVLTreeFactories {

	/**
	 * Build an AVL tree for complex values. Requires a `getKey` function that takes such
	 * a complex value, and returns the key by which that value is identified.
	 * @example
	 * ```typescript
	 *
	 * import AVLTree, { IAVLTree } from '@jjwesterkamp/avl-tree'
	 *
	 * interface Foo {
	 *     id: number
	 * }
	 *
	 * // Note: there are multiple ways the types can be specified - pick your poison :)
	 *
	 * // 1. using a type guard (note the additional interface import)
	 * const myTree: IAVLTree<number, Foo> = AVLTree.create((foo) => foo.id))
	 *
	 * // 2. using explicit arguments
	 * const myTree = AVLTree.create<number, Foo>((foo) => foo.id))
	 *
	 * // 3. inferred from the given function
	 * const myTree = AVLTree.create((foo: Foo) => foo.id))
	 * ```
	 * @param getKey The function that derives the key of a given value of type T
	 * @typeParam T The type of values that are to be stored in the tree.
	 * @typeParam K The key type that is derived from tree values, in order to compare their order.
	 */
 	create<K extends Ord, V>(getKey: GetKey<K, V>): IAVLTree<K, V>

	/**
	 * Build an AVL tree for scalar - orderable - values. Note that (in typescript)
	 * the type argument for the scalar type is required for successive operations
	 * to properly type-check.
	 *
	 * @example
	 * ```typescript
	 * const scalarTree = AVLTree.scalar<number>()
	 * ```
	 *
	 * @typeParam T The (scalar, orderable) type of tree values.
	 */
	scalar<V extends Ord>(): IAVLTree<V, V>
}

/**
 * The AVL tree's instance interface.
 * @typeParam T The type of values that are to be stored in the tree.
 * @typeParam K The key type that is derived from tree values, in order to compare their order.
 */
export interface IAVLTree<K extends Ord, V> {

	/**
	 * Returns the value within the tree that ranks lowest, or `null`
	 * if the tree is empty.
	 */
	minValue(): V | null

	/**
	 * Returns the value within the tree that ranks highest, or `null`
	 * if the tree is empty.
	 */
	maxValue(): V | null

	/**
	 * Search a value by a given `searchKey`, matching against keys of nodes.
	 */
	search(key: K): V | null

	/**
	 * Performs in-order traversal of the given node's subtree, applying the given `fn`
	 * to each contained value.
	 */
	forEach(fn: (element: V) => void): void

	/**
	 * Folds (reduces) the tree left-to-right using in-order traversal.
	 */
	foldLeft<U>(fn: (acc: U, curr: V) => U, seed: U): U

	/**
	 * Folds (reduces) the tree right-to-left using reversed in-order traversal.
	 */
	foldRight<U>(fn: (acc: U, curr: V) => U, seed: U): U

	/**
	 * Returns a list of all keys within the tree as an array, in-order.
	 */
	keys(): K[]

	/**
	 * Returns a list of all values within the tree as an array, in-order.
	 */
	values(): V[]

	/**
	 * Inserts a new value into the tree.
	 */
	insert(value: V): void

	/**
	 * Deletes the node with given key from the tree.
	 */
	delete(key: K): void
}

declare const factories: AVLTreeFactories
export default factories
