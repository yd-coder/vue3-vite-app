### 环境准备

- 服务端：node.js（版本建议：>= v14.19.3）、兼容s3的对象存储（用于存储图片、视频等文件）
- web端：node.js（版本建议：>= v14.19.3）
- 数据库：mysql（版本建议：>= v5.6.21，可导入sql文件即可）



### 技术栈

| 前端             | 描述                             | 后端                | 描述                                |
| ---------------- | -------------------------------- | ------------------- | ----------------------------------- |
| Vue3             | 渐进式 JavaScript 框架           | express             | 基于Nodejs平台的 Web 开发服务端框架 |
| TypeScript       | JavaScript 的一个超集            | socket.io           | 基于webSocket的node库               |
| Vite             | 构建工具                         | cors                | 配置浏览器跨域库                    |
| Element Plus     | 基于Vue 3组件库                  | bcryptjs            | 加盐加密密码库                      |
| Pinia            | 新一代状态管理工具               | express-session     | 操作管理session库                   |
| Vue Router       | Vue.js 的官方路由                | express-validator   | 校验邮箱规则库                      |
| Vueuse           | Vue的hooks库，以此实现了暗夜模式 | jsonwebtoken        | 加密生成token库                     |
| Uno css          | 即时按需原子 CSS 引擎            | express-jwt         | 解析token库                         |
| sass             | CSS扩展语言                      | nodemailer          | 提供邮箱smtp服务库                  |
| socket.io-client | 基于webSocket的库                | joi                 | 定义校验规则库                      |
| vue-i18n         | 基于vue的国际化库                | @escook/express-joi | 自动对表单数据进行验证中间件        |
| axios            | 基于promise的网络请求库          | mysql               | 数据库语言                          |
| js-cookie        | 操作cookie使用库                 |                     |                                     |
| prettier         | 代码规范库                       |                     |                                     |
| commitizen       | 提交规范库                       |                     |                                     |
| nprogress        | 全局加载进度条                   |                     |                                     |
| wangeditor       | 富文本编辑器                     |                     |                                     |

 

### 启动项目

#### 前端

- 进入web端目录

- 安装依赖

```
npm install
```

- 运行项目

```
npm run dev
```

- 打包项目

```
npm run build
```

#### 后端

- 进入server项目
- 安装依赖

```
npm install
```

- 运行项目

```
npm start
```

