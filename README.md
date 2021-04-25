# AVL Binary search trees

An AVL Binary search tree implementation in typescript.

[![npm version](https://badgen.net/npm/v/avl-bst?label=npm%20package&color=green&cache=600)][npm]
[![MIT](https://badgen.net/badge/license/MIT/green)][license file]
> This is initially foremost a research exercise, but I'm working towards a stable production-ready
> implementation.

## Quick links
- [npm][npm]
- [Github][gh]
- [API documentation][docs]
- [Changelog][changelog]

## Installation

Install the package with npm:

```text
npm install --save avl-bst
```

## Usage

I will add more elaborate documentation here shortly. For now, you can visit the [API documentation][docs], and the
[public API page][docs-api] in particular for further directions on how to use this package.
Below is a brief overview of the available methods on tree instances.

You can import the package and instantiate a new tree as follows:
```typescript
import AVLTree from 'avl-bst'

interface Foo {
    id: number;
    name: string;
}

// Create a new tree, providing a function that determines the key
// for values of type Foo:
const tree = AVLTree.create<number, Foo>((foo) => foo.id) 
    // > IAVLTree<number, Foo>

// Alternatively you can create a search tree for strings or numbers
// with the scalar() method, which does not require the function to
// derive a key from complex values:
const scalarTree = AVLTree.scalar<number>()
    // > IAVLTree<number, number>
```

**Inserting values**

_O (log n)_
```typescript
tree.insert({ id: 8, name: 'a' })   // > true
tree.insert({ id: 3, name: 'b' })   // > true
tree.insert({ id: 19, name: 'c' })  // > true
tree.insert({ id: 2, name: 'd' })   // > true
tree.insert({ id: 11, name: 'e' })  // > true
tree.insert({ id: 5, name: 'f' })   // > true
tree.insert({ id: 7, name: 'g' })   // > true
tree.insert({ id: 14, name: 'h' })  // > true
tree.insert({ id: 18, name: 'i' })  // > true
tree.insert({ id: 9, name: 'j' })   // > true
tree.insert({ id: 15, name: 'k' })  // > true
tree.insert({ id: 10, name: 'l' })  // > true

// Inserting values with duplicate keys is not possible:
tree.insert({ id: 10, name: 'm' })  // > false
```

**Checking the size of the tree**

_O (1)_
```typescript
tree.size() // > 12
tree.isEmpty() // false
```

**Searching values**

_O (log n)_
```typescript
tree.search(14)  // > { id: 14, name: 'h' }
tree.search(100) // > null
```

**To get the min and max values (by key):**
  
_O (log n)_
```typescript
tree.minValue() // > { id: 2, name: 'd' }
tree.maxValue() // > { id: 19, name: 'c' }
```

**Get lists of keys or values**

_O (n)_
```typescript
// Get all keys in the tree, in-order:
tree.keys() // > [2, 3, 5, 7, 8, 9, 10, 11, 14, 15, 18, 19]

// Get all the values in the tree, in-order:
tree.values() /* > 
[
  { id: 2, name: 'd' },
  { id: 3, name: 'b' },
  { id: 5, name: 'f' },
  { id: 7, name: 'g' },
  { id: 8, name: 'a' },
  { id: 9, name: 'j' },
  { id: 10, name: 'l' },
  { id: 11, name: 'e' },
  { id: 14, name: 'h' },
  { id: 15, name: 'k' },
  { id: 18, name: 'i' },
  { id: 19, name: 'c' }
]
*/
```

**To iterate over all values, in-order:**

_O (n)_
```typescript
tree.forEach((value: Foo) => doSomething(value))
```

**To fold / reduce the tree:** 

_O (n)_
```typescript
// Fold (reduce) the tree left-to-right:
tree.foldLeft((acc, curr) => acc + '-' + curr.name , 'NAMES')
// > 'NAMES-d-b-f-g-a-j-l-e-h-k-i-c'

// Fold (reduce) the tree from right-to-left:
tree.foldRight((acc, curr) => acc + '-' + curr.name , 'REVERSED-NAMES')
// > 'REVERSED-NAMES-c-i-k-h-e-l-j-a-g-f-b-d'
```
**To delete values:**

_O (log n)_
```typescript
tree.delete(10) // > true

// Returns false if no node to be deleted was found:
tree.delete(10) // > false
```



## Development / build

To locally build the package, clone the repository and then run the following command. 
This will build ES modules in `esm/`,
CommonJS modules in `cjs/`, and minified + non-minified UMD bundles in `umd/`.

```
$ npx yarn && npx yarn build
```

## License

The MIT license (MIT). See the [license file] for more information.

[license file]: https://github.com/JJWesterkamp/avl-tree/blob/master/LICENSE

[changelog]: https://github.com/JJWesterkamp/avl-bst/blob/master/CHANGELOG.md
[npm]: https://www.npmjs.com/package/avl-bst
[gh]: https://github.com/JJWesterkamp/avl-bst
[docs]: https://jjwesterkamp.github.io/avl-bst/index.html
[docs-api]: https://jjwesterkamp.github.io/avl-bst/modules/public_api.html
