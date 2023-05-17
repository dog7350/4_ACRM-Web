
const path = require('path') 
const { VueLoaderPlugin } = require('vue-loader');


module.exports = {
    mode: 'development',
    devtool: 'eval', 
    resolve:{ 
        extensions: ['.js', '.vue']
    },
    entry: { 
        Z01V: path.join(__dirname, 'VFF', 'VE4H', 'vueMain.js'), 
    }, 
    module: {
        rules:[
            { 
                test: /\.vue$/, 
                use: ['vue-loader']
            },
            { 
                test: /\.css$/, 
                use: ['vue-style-loader', 'css-loader']
            },
        ]
    }, 
    plugins: [
        new VueLoaderPlugin()
    ], 
    output: {
        filename: '[name].js', 
        path: path.join(__dirname, 'public', 'dist')
    }
};