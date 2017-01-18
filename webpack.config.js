module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "public/bundle.js"
    },
    module: {
        loaders: [
      { test: /\.json$/, loader: 'json-loader'},
       {
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
              presets: ["es2015", "react"]
            }
        }]
    }
}
