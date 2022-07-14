
var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './public/src/main.tsx',
    output: {
        path: path.join(__dirname, 'public/dist'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    module: {
        rules: [{
            test: /\.js|jsx$/,
            include: path.join(__dirname, 'public'),
            exclude: [path.join(__dirname, 'public/dist'), path.join(__dirname, 'node_modules')],
            use: 'babel-loader'
        }, {
            test: /\.css$/,
            include: path.join(__dirname, 'public/css'),
            exclude: [path.join(__dirname, 'public/dist'), path.join(__dirname, 'node_modules')],
            use: [
                devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                 'css-loader'
            ]
        }, {
            test: /\.ts|\.tsx?$/,
            use: {
              loader: "babel-loader",
            },
            include: [path.join(__dirname, 'public/src'), path.join(__dirname, 'server')],
            exclude: [path.join(__dirname, 'public/dist'), path.join(__dirname, 'node_modules')]
        }]
    },
    plugins: [new MiniCssExtractPlugin()],
    mode: "development"

};
