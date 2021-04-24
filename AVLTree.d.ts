export type Orderable = string | number

export type GetKey<T = any, K extends Orderable = Orderable> = (element: T) => K

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
	 * const myTree: IAVLTree<Foo, number> = AVLTree.create((foo) => foo.id))
	 *
	 * // 2. using explicit arguments
	 * const myTree = AVLTree.create<Foo, number>((foo) => foo.id))
	 *
	 * // 3. inferred from the given function
	 * const myTree = AVLTree.create((foo: Foo) => foo.id))
	 * ```
	 * @param getKey The function that derives the key of a given value of type T
	 * @typeParam T The type of values that are to be stored in the tree.
	 * @typeParam K The key type that is derived from tree values, in order to compare their order.
	 */
 	create<T, K extends Orderable>(getKey: GetKey<T, K>): IAVLTree<T, K>

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
	scalar<T extends Orderable>(): IAVLTree<T, T>
}

/**
 * The AVL tree's instance interface.
 * @typeParam T The type of values that are to be stored in the tree.
 * @typeParam K The key type that is derived from tree values, in order to compare their order.
 */
export interface IAVLTree<T, K extends Orderable> {

	/**
	 * Returns the value within the tree that ranks lowest, or `null`
	 * if the tree is empty.
	 */
	minValue(): T | null

	/**
	 * Returns the value within the tree that ranks highest, or `null`
	 * if the tree is empty.
	 */
	maxValue(): T | null

	/**
	 * Search a value by a given `searchKey`, matching against keys of nodes.
	 */
	search(key: K): T | null

	/**
	 * Performs in-order traversal of the given node's subtree, applying the given `fn`
	 * to each contained value.
	 */
	forEach(fn: (element: T) => void): void

	/**
	 * Folds (reduces) the tree left-to-right using in-order traversal.
	 */
	foldLeft<U>(fn: (acc: U, curr: T) => U, seed: U): U

	/**
	 * Folds (reduces) the tree right-to-left using reversed in-order traversal.
	 */
	foldRight<U>(fn: (acc: U, curr: T) => U, seed: U): U

	/**
	 * Returns a list of all keys within the tree as an array, in-order.
	 */
	keys(): K[]

	/**
	 * Returns a list of all values within the tree as an array, in-order.
	 */
	values(): T[]

	/**
	 * Inserts a new value into the tree.
	 */
	insert(value: T): void

	/**
	 * Deletes the node with given key from the tree.
	 */
	delete(key: K): void
}

declare const factories: AVLTreeFactories
export default factories
