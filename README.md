# TS package boilerplate

A boilerplate package for Typescript NPM package development. This boilerplate targets Javascript-only packages, and thus
has no Sass-loaders, extract-text plugins and the lot configured. Features include:

### Multiple builds

The boilerplate comes with various build scripts:

- `npm run build:cjs` builds CommonJS modules into the `cjs` folder with the typescript compiler
- `npm run build:esm` builds ES Modules into the `esm` folder with the typescript compiler
- `npm run build:umd` builds UMD bundles (minified and non-minified) into the `umd` folder with webpack + ts-loader

All builds are run concurrently with `npm run build`. If some builds are unnecessary for your project you can simply
remove the scripts from package.json.

### Declaration file

There's a dummy declaration file in place in the project root. It is linked to from the `types` key in package.json,
and imported by `/src/index.ts`.

### Included testing setup

By default a Jest testing setup is included using [ts-jest](https://github.com/kulshekhar/ts-jest). Code coverage is
measured over the `/src` folder, and reported into the (ignored) `coverage` folder.

### Included CI setup

There's a `.travis.yml` file that configures TravisCI to run the test suite remotely. For coverage reporting a line
is included in the `.travis.yml` file which calls the npm script `coveralls`, sending coverage information
to [coveralls.io](https://coveralls.io/). This is my standard setup, but if you want to remove it follow these steps:

- Remove the .travis.yml file
- Remove the `coveralls` devDependency from package.json
- Remove the `coveralls` script from package.json

## Getting started

1. To get started quickly [generate your repository][generator] from template on Github, or alternatively setup manually
by cloning the repository and setup your git configuration:

    ```text
    $ git clone git@github.com:JJWesterkamp/ts-package-boilerplate.git
    $ cd ts-package-boilerplate
    $ rm -rf .git
    $ git init

    ...setup your repo, remotes etc.

    $ npm install
    ```

2. Edit file contents as follows:

    The boilerplate uses values as `"package-name"` and `"PackageName"` as default values for various pointers, hooks etc. Rename these to your preference:

    - Rename entry point keys in `webpack.config.js`
    - Rename `output.library.name` in `webpack.config.js`
    - Rename `PackageName` in `package-name.d.ts`
    - Rename `package-name.d.ts` to your package name
    - Update update `package.json:types` value to point to renamed declaration file.

## License

The MIT License (MIT). See [license file] for more information.

[license file]: https://github.com/JJWesterkamp/ts-package-boilerplate/blob/master/LICENSE

[generator]: https://github.com/JJWesterkamp/ts-package-boilerplate/generate
