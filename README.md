<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-04-17 14:52:44
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-04-17 14:56:49
 * @FilePath: /micro-child-vue3-enterprise/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# micro-child-vue3-enterprise

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 项目启动

```bash

```

## 更新日志

### 2024-04-17
- 配置开发服务器端口为8083
- 添加跨域支持
- 配置Sass样式系统
  - 安装sass依赖
  - 创建样式文件结构（variables.scss, mixins.scss, reset.scss, main.scss）
  - 添加变量系统（颜色、字体、间距等）
  - 添加常用mixins（flex布局、文本省略、响应式等）
  - 添加重置样式
  - 支持暗色模式
  - 添加响应式工具类
- 集成normalize.css
  - 安装normalize.css依赖
  - 在样式系统中引入normalize.css
- 优化构建配置
  - 配置CSS预处理器自动导入变量
  - 启用开发环境sourcemap
  - 优化代码分割策略
  - 配置样式文件打包优化
- 配置路由系统
  - 设置默认路由为企业列表页面
  - 添加企业列表路由（/enterprise）
  - 添加企业详情路由（/enterprise/:id）
  - 配置页面标题自动更新
- 封装axios请求库
  - 安装axios依赖
  - 创建请求配置文件（config.ts）
  - 配置请求和响应拦截器（interceptors.ts）
  - 封装通用请求方法（index.ts）
  - 创建企业相关API接口（enterprise.ts）
  - 支持请求取消、错误处理、token认证等功能
- 集成Element Plus
  - 安装element-plus和图标依赖
  - 配置Element Plus全局设置
  - 注册Element Plus图标组件
  - 配置Element Plus中文语言包
