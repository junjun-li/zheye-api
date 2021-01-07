# zheye-api

```json
{
  "scripts": {
    "webpack:debug": "npx node --inspect-brk ./node_modules/.bin/webpack",
    "build": "cross-env NODE_ENV=prod webpack --config config/webpack.config.prod.js",
    "build:dev": "cross-env NODE_ENV=dev webpack --config config/webpack.config.dev.js",
    "dev": "cross-env NODE_ENV=dev nodemon --exec babel-node --inspect=9229 src/index.js",
    "clean": "rimraf dist"
  }
}
```

[webpack 命令行接口（CLI）](https://webpack.docschina.org/api/cli/)

## 修改端口

"dev": "cross-env NODE_ENV=dev nodemon --exec babel-node --inspect=9230 src/index.js"

`inspect`指定运行端口

## 调试webpack

"webpack:debug": "npx node --inspect-brk ./node_modules/.bin/webpack",

## 打包

"build": "cross-env NODE_ENV=prod webpack --config config/webpack.config.prod.js"
"build:dev": "cross-env NODE_ENV=dev webpack --config config/webpack.config.dev.js"

build: 生产环境打包

build:dev: 开发环境打包

## 运行

"dev": "cross-env NODE_ENV=dev nodemon --exec babel-node --inspect=9229 src/index.js"

`cross-env NODE_ENV=dev` 定义环境变量为dev

使用nodemon来启动我们的服务

## 使用了@路径,  修改一下配置

"watch": "cross-env NODE_ENV=dev webpack --watch --progress --config config/webpack.config.dev.js",

"runServe": "nodemon --inspect ./dist/server.bundle.js"

增加如下两个命令, 使用webpack来编译我们的js, 使用nodemon, 来执行我们编译好的server.bundle.js

使用`npm-run-all`批量运行我们的脚本

"serve": "npm-run-all -p watch runServe"
