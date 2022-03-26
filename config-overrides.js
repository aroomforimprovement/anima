const webpack = require('webpack');

module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve;
    let plugs = config.plugins;
    loaders.fallback = {
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/")
    };
    plugs.push(new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }));
    plugs.push(new webpack.ProvidePlugin({
        process: 'process/browser'
    }))
    
    return config
}