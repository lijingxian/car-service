# biz-mgmt

> 卡欧科技业务管理前端项目

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report
```

## 项目结构

```bash

├── README.md                       项目介绍
├── package.json                    安装、启动文件，npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
├── .eslintrc.js                    代码检测规则定制
├── .babelrc                        babel编译插件配置
├── .vue.config.js                  开发环境配置
├── index.html                      入口页面
├── config                          项目配置
│   └── dev-config.js                   开发环境变量
│
├── src                             源码目录
│   ├── assets                          资源目录，这里的资源会被wabpack构建
│   ├── components                      公共组件目录
│   ├── libs                            第三方工具类库
│   ├── pages                           页面目录
│   ├── router                          前端路由
│   ├── main.js                         入口js文件
│   ├── app.vue                         根组件
│   ├── service                         接口请求封装
│   ├── store                           状态管理
│   │   ├── index.js                        入口
│   │   ├── actions.js                      顶级actions
│   │   ├── getters.js                      顶级getters
│   │   ├── mutations.js                    顶级mutations
│   │   └── modules                         模块级的状态
│   │       └──CommunicationCard.js
│   ├── style                           库样式
│   └── utils.js                        工具类
├── public                           纯静态资源，不会被wabpack构建
│   └── index.html                      入口页面
└── dist                                编译后文件目录

```
