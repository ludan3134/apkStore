const HtmlWebpackPlugin = require('html-webpack-plugin')
const {GriffelCSSExtractionPlugin} = require(
    '@griffel/webpack-extraction-plugin')
const webpack = require('webpack');

const path = require('path')
const source = path.resolve(__dirname, 'src')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
console.log("我是URL", process.env.URL)
console.log("我是port", process.env.URL)
module.exports = {
    devServer: {
        port: 3001,
        historyApiFallback: true,
    },
    entry: './src/main.tsx',
    mode: 'production',
    performance: {
        hints: false
    },
    output: {
        filename: "build/[name].js",
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: "/",  // 向index.html织入<script>时src的前缀。"app.js"-->"/app.js"

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'), // html模板
            filename: 'index.html',
        }),
        new GriffelCSSExtractionPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'report.html',
            openAnalyzer: false, // 不自动打开浏览器
        }),
        new webpack.DefinePlugin({
            'process.env.ENV_BaseURL': JSON.stringify(process.env.URL),
            VERSION: '1.0.0',
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: source,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    // "ts-loader",
                    {
                        loader: GriffelCSSExtractionPlugin.loader,
                    },
                    {
                        loader: '@griffel/webpack-loader',
                        options: {
                            babelOptions: {
                                presets: ['@babel/preset-typescript'],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(js|jsx)$/,
                include: source,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: /node_modules/,
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'], // 自动添加后缀名
        // mainFiles: ['index'],  // 当文件目录时，会找目录内的index文件
        modules: [
            path.resolve(__dirname),
            source,
            path.resolve(__dirname, 'node_modules')],
        preferRelative: true,
        restrictions: [/\.(sass|scss|css|ts|tsx|js|html|mjs|json)$/],
        enforceExtension: false,
    },
    experiments: {
        topLevelAwait: true,
    },
    // stats: {
    //   children: true,
    //   errorDetails: true,
    // },
}
