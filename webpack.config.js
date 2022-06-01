const path = require("path");
const globule = require("globule");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const enabledSourceMap = process.env.NODE_ENV !== "production";

const app = {
  // 読み込み先（srcの中のjsフォルダのinit.tsを読み込む）
  entry: path.resolve(__dirname, "src/ts/init.ts"),
  //出力先（distの中のjsフォルダへinit.jsを出力）
  output: {
    filename: "./js/init.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        // 対象となるファイルの拡張子(scssかsassかcss)
        test: /\.(sa|sc|c)ss$/,
        // Sassファイルの読み込みとコンパイル
        use: [
          // CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
          {
            loader: MiniCssExtractPlugin.loader
          },
          // CSSをバンドルするためのローダー
          {
            loader: "css-loader",
            options: {
              // CSS内のurl()メソッドの取り込みを禁止
              url: false,
              // production モードでなければソースマップを有効に
              sourceMap: enabledSourceMap,
              // postcss-loader と sass-loader の場合は2を指定
              importLoaders: 2
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            }
          },
          // PostCSS（autoprefixer）の設定
          {
            loader: "postcss-loader",
            options: {
              // production モードでなければソースマップを有効に
              sourceMap: enabledSourceMap,
              postcssOptions: {
                // ベンダープレフィックスを自動付与
                plugins: [require("autoprefixer")({ grid: true })]
              }
            }
          },
          // Sass を CSS へ変換するローダー
          {
            loader: "sass-loader",
            options: {
              // dart-sass を優先
              implementation: require("sass"),
              //  production モードでなければソースマップを有効に
              sourceMap: enabledSourceMap
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: "pug-loader",
            options: {
              pretty: true
            }
          }
        ]
      }
    ]
  },
  target: "web",
  resolve: {
    // 拡張子を配列で指定
    extensions: [".ts", ".js"]
  },
  //プラグインの設定
  plugins: [],
  //source-map タイプのソースマップを出力
  devtool: "source-map",
  // node_modules を監視（watch）対象から除外
  watchOptions: {
    ignored: /node_modules/ //正規表現で指定
  },
  devServer: {
    //ルートディレクトリの指定
    static: {
      directory: path.join(__dirname, "dist")
    },
    //ブラウザを自動的に起動
    open: true,
    // 監視するかフォルダはどれか
    watchFiles: ["src/**/*"],
  },
  plugins: [
    new MiniCssExtractPlugin({ // distの中にあるcssフォルダにstyle.cssを出力
      filename: "./css/style.css"
    }),

  ],
};

//srcフォルダからpngを探す
const templates = globule.find("./src/templates/**/*.pug", {
  ignore: ["./src/templates/**/_*.pug"]
});

//pugファイルがある分だけhtmlに変換する
templates.forEach((template) => {
  const fileName = template.replace("./src/templates/", "").replace(".pug", ".html");
  app.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${fileName}`,
      template: template,
      inject: false, //false, head, body, trueから選べる
      minify: false //本番環境でも圧縮しない
    })
  );
});

module.exports = app;