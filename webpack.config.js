const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env", "@babel/preset-react"],
      },
    },
  },
  // Wanted by
  // https://dev.to/siradji/react-without-create-react-app-start-building-your-react-project-like-a-professional-1hih
  // for css processing stuff. Leaving out for minimalism here.
  // {
  //   test: /\.css$/,
  //   exclude: /node_modules/,
  //   use: ["style-loader", "css-loader"],
  // }
];

module.exports = {
  mode: "development",
  entry: "src/js/index.js",
  output: {
    filename: "bundle.js",
    publicPath: "static",
  },
  module: { rules },
};
