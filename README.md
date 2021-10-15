- [Vue 3 + Typescript + Vite](#vue-3--typescript--vite)
    - [框架特性支持清单](#框架特性支持清单)
    - [规范](#规范)
    - [推荐的 IDE 设置](#推荐的-ide-设置)
        - [若使用 `<script setup>`](#若使用-script-setup)
    - [对 TS 中的`.vue`导入的类型支持](#对-ts-中的vue导入的类型支持)
        - [若使用 Volar](#若使用-volar)
        - [若使用 Vetur](#若使用-vetur)
    - [开发指南](#开发指南)
        - [主题变更](#主题变更)
        - [国际化支持](#国际化支持)

# Vue 3 + Typescript + Vite

vue3 版本前端工程模板。

这个模板帮助大家使用 Vite 来基于 Vue3、Typescript 来开发。

## 框架特性支持清单

| 特性              | 维护者 | 状态 | 计划截止时间 | 链接 | 备注 |
| ----------------- | ------ | ---- | ------------ | ---- | ---- |
| 主题管理          | 江月   | ✅   |              |      |      |
| 代码生成工具      |        | 💤   |              |      |      |
| 路由管理          |   元皓    | ✅   |              |      |      |
| 状态管理          |   元皓     |  ✅  |              |      |      |
| 国际化支持        | 江月   | ✅   |              |      |      |
| eslint            |        | 💤   |              |      |      |
| husky             | 江月   | ✅   |              |      |      |
| 提交注释检查      | 江月   | ✅   |              |      |      |
| 提交前代码检查    |        | 💤   |              |      |      |
| api proxy         |   全体     | ✅   |              |      |      |
| http 库           |  元皓      | ✅   |              |      |      |
| 日志代码清除      |        | 💤   |              |      |      |
| 配置管理          |        | 💤   |              |      |      |
| ant-design 集成 | 全体   | ✅   |              |      |      |

## 规范

- 代码规范参考：http://192.168.50.14:8081/xiandev/principle/-/blob/master/代码/前端审查标准.md
- 提交注释规范参考：http://192.168.50.14:8081/xiandev/principle/-/blob/master/版本控制/提交注释规范.md
- 分支规范：http://192.168.50.14:8081/xiandev/principle/-/blob/master/版本控制/提交规范-MR版.md#分支要求

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur).
Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

### 若使用 `<script setup>`

[`<script setup>`](https://github.com/vuejs/rfcs/pull/227) is a feature that is currently in RFC stage. To get proper
IDE support for the syntax, use [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) instead
of Vetur (and disable Vetur).

## 对 TS 中的`.vue`导入的类型支持

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type
by default. In most cases this is fine if you don't really care about component prop types outside of templates.
However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using
manual `h(...)` calls), you can use the following:

### 若使用 Volar

Run `Volar: Switch TS Plugin on/off` from VSCode command palette.

### 若使用 Vetur

1. Install and add `@vuedx/typescript-plugin-vue` to
   the [plugins section](https://www.typescriptlang.org/tsconfig#plugins) in `tsconfig.json`
2. Delete `src/shims-vue.d.ts` as it is no longer needed to provide module info to Typescript
3. Open `src/main.ts` in VSCode
4. Open the VSCode command palette
5. Search and run "Select TypeScript version" -> "Use workspace version"

## 开发指南

### 主题变更

本框架使用`vite`结合 less 预处理起的`modifyVars`选项来进行 less 变量的替换以达到更换主题的效果，操作方式如下：

1. 首先设置 vite 的动态载入组件插件的`importStyle`为`less`，这样才能让后面的`less`预处理器的`modifyVars`设置生效，因为这个`ViteComponents`默认载入的样式文件是`css`。

   ```ts
   ViteComponents({
     globalComponentsDeclaration: true,
     customComponentResolvers: [
       AntDesignVueResolver({
         importStyle: "less", // 导入less文件，以便后面的less modifyVars可以生效
       }),
     ],
   });
   ```

2. 修改`vite`配置项中的`css`选项，将其设置为：

   ```ts
   less: {
   modifyVars: {
       hack: `true; @import (reference) "${resolve('src/assets/theme/purple.less')}";`,
   },
   javascriptEnabled: true // 想要less的modifyVars生效，这个必须启用
   }
   ```

   因此，后面若想调整主题，只需要修改`src/assets/theme/purple.less`即可

### 国际化支持

- `ant-design-vue`自身的国际化使用`ConfigProvider`全局配置组件来完成
- 业务自身的国际化工作由`vue-i18n@next`来完成

对于业务自身的国际化工作，其国际化文件位置位于：`src/i18n`内部，在整个项目中已经将`vue-i18n`配置好了（具体查看源代码），在组件中使用方式如下：

```html

<template>
    <div>
        <p>{{ t("home.hello") }}</p>
        <a-calendar :fullscreen="false" :value="moment()"/>
    </div>
</template>
<script lang="ts">
    import {defineComponent} from "vue";
    import moment from "moment";
    import "moment/dist/locale/zh-cn";
    import {useI18n} from "vue-i18n";

    export default defineComponent({
        name: "I18n",
        setup(props) {
            // 这段代码必须在setup的顶部执行
            const {t} = useI18n();
            return {moment, t};
        },
    });
</script>
```

`t`方法使用方式：其参数为以`.`拼接的字符串，第一段为翻译文件名，第二段为对应文件中的消息键（`json path`）。

> 注意：为了保持整个系统翻译方向一致，需要严格保证`ant-design-vue`的`ConfigProvider`和`vue-i18n`使用同样的`locale`值，这个工作已经做好了，现在只需要修改`src/i18n/index.ts`中`i18n`的`locale`就可以了。

### api

#### $message

全局消息提示，通过`inject`可以得到全局`$message`对象来使用，它就是`ant-design-vue`的message。

```ts
import {MessageApi} from "ant-design-vue/lib/message";
const $message: MessageApi = inject('$message')!
$message.success('你删除了一条数据')
```

#### $confirm

`$confirm`确认框，通过`inject`可以得到全局`$confirm`对象，它是`ant-design-vue`的`Modal.confirm`

```ts
import {ModalFunc} from "ant-design-vue/lib/modal/Modal";
const $confirm: ModalFunc = inject('$confirm')!
$confirm({
    title: '确认删除吗？',
    content: '删除后不可恢复',
    okText: '确认无疑',
    cancelText: '我再想想',
    onOk: () => {
      $message.success('你删除了一条数据')
    }
})
```
