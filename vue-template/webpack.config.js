const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    context:__dirname + '/src',
    entry:{
        'test':'./app/test/index.js'
    },
    output:{
        filename:'[name].bound.js',
        path:path.resolve(__dirname,'src/wpk-res')
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
                 name: 'manifest'
        })
    ]
};