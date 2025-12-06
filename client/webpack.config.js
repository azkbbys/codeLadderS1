//@ts-ignore
const path = require("path");
const Dotenv = require("dotenv-webpack");
/** @type import('webpack').Configuration */
const webpackConfig = {
  plugins: [
    // 环境变量
    new Dotenv({
      // 指向项目根目录下的.env文件
      path: "../../.env",
    }),
  ],
  resolve: {
    /**
     * 本配置以当前文件夹（client）为基准目录。
     * 别名配置直接指向源代码目录/文件。
     */

    alias: {
      "@src": path.resolve(__dirname, "src"), // 指向于 client/src 目录
      "@shares": path.resolve(__dirname, "../shares"), // 指向于 shares 目录
      "@client": path.resolve(__dirname, "."), // 指向于 client 目录
      "@root": path.resolve(__dirname, "../"), // 指向于 最上层 目录
    },
  },
};
module.exports = webpackConfig;
