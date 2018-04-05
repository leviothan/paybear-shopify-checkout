const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        // app: './src/index.tsx',
        checkout: './src/checkout.ts',
    },
    devtool: "source-map",
    devServer: {
        contentBase: './dist',
    },
    resolve: {
        extensions: [".ts", ".js", ".json", "css"],
    },
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders')
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/dist/',
        // publicPath: '/dist/js/',
        filename: '[name].js',
        chunkFilename: 'chunks/chunk-[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
                // use: [{
                //     loader: "awesome-typescript-loader",
                //     options: {"useBabel": true, "useCache": true, "cacheDirectory": ".awcache"}
                // }]
            },
            {
                test: /\.css$/,
                use: 'raw-loader'
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            },
        ]
    }
};
