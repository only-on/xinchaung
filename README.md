# Vue 3 + Typescript + Vite

vue3版本前端工程模板。

这个模板帮助大家使用Vite来基于Vue3、Typescript来开发。
## 框架特性支持清单

| 特性 | 维护者 | 状态 | 计划截止时间 | 链接 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 主题管理 |  | 💤 |  |  |  |
| 代码生成工具 |  | 💤 |  |  |  |
| 路由管理 |  | 💤 |  |  |  |
| 状态管理 |  | 💤 |  |  |  |
| 国际化支持 |  | 💤 |  |  |  |
| eslint |  | 💤 |  |  |  |
| husky | 江月 | ✅ |  |  |  |
| 提交注释检查 | 江月 | ✅ |  |  |  |
| 提交前代码检查 |  | 💤 |  |  |  |
| api proxy |  | 💤 |  |  |  |
| http库 |  | 💤 |  |  |  |
| 日志代码清除 |  | 💤 |  |  |  |
| 配置管理 |  | 💤 |  |  |  |
| element-plus集成 | 江月 | ✅ |  |  |  |

## 规范

- 代码规范参考：http://192.168.50.14:8081/xiandev/principle/-/blob/master/代码/前端审查标准.md
- 提交注释规范参考：http://192.168.50.14:8081/xiandev/principle/-/blob/master/版本控制/提交注释规范.md
- 分支规范：http://192.168.50.14:8081/xiandev/principle/-/blob/master/版本控制/提交规范-MR版.md#分支要求
## 推荐的IDE设置

[VSCode](https://code.visualstudio.com/) + [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur). Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

### 若使用 `<script setup>`

[`<script setup>`](https://github.com/vuejs/rfcs/pull/227) is a feature that is currently in RFC stage. To get proper IDE support for the syntax, use [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) instead of Vetur (and disable Vetur).

## 对TS中的`.vue`导入的类型支持

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can use the following:

### 若使用Volar

Run `Volar: Switch TS Plugin on/off` from VSCode command palette.

### 若使用Vetur

1. Install and add `@vuedx/typescript-plugin-vue` to the [plugins section](https://www.typescriptlang.org/tsconfig#plugins) in `tsconfig.json`
2. Delete `src/shims-vue.d.ts` as it is no longer needed to provide module info to Typescript
3. Open `src/main.ts` in VSCode
4. Open the VSCode command palette
5. Search and run "Select TypeScript version" -> "Use workspace version"
