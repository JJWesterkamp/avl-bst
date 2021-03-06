const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
          include: /\.min\.js$/,
          uglifyOptions: {
              mangle: {
                  reserved: ['AVLTree', 'Node']
              },
          }
        })]
    },
    entry: {
        "avl-bst": "./src/index.ts",
        "avl-bst.min": "./src/index.ts",
    },
    output: {
        path: resolve(__dirname, 'umd'),
        filename: '[name].js',
        library: {
            name: 'AVLTree',
            type: 'umd',
            export: 'default',
        },
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new webpack.BannerPlugin([
            `AVL Binary search trees`,
            `https://jjwesterkamp.github.io/avl-bst`,
            `(c) 2021 Jeffrey Westerkamp`,
            `This software may be freely distributed under the MIT license.`,
        ].join('\n')),
    ]
};
