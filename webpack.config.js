const path = require("path");

const rules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: [
                    ["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }],
                    "@babel/preset-react",
                ],
            },
        },
    },
    {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
    },
    {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
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
    entry: "./src/js/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "static"),
    },
    module: { rules },
    devServer: {
        contentBase: path.join(__dirname, "static"),
    },
};
