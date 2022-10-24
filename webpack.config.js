var path = require("path");

module.exports = {
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname),
    filename: "_bundle.js",
    libraryTarget: "var",
    library: "EntryPoint",
    sourceMapFilename: "_bundle.js.map",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};
