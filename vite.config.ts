import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path';
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteComponents({
      // 有效的组件后缀
      extensions: ['vue'],
      // 对自动导入的组件实施TypeScript支持，需要vscode安装Volar插件
      globalComponentsDeclaration: true,
      // 自动导入组件
      // https://www.npmjs.com/package/vite-plugin-components
      // https://2x.antdv.com/docs/vue/introduce-cn
      // https://github.com/antfu/vite-plugin-components/blob/main/src/resolvers/antdv.ts
      customComponentResolvers: [AntDesignVueResolver({
        importStyle: 'less' // 导入less文件，以便后面的less modifyVars可以生效
      })],
    }),
    // https://www.npmjs.com/package/@vitejs/plugin-vue-jsx
    vueJsx()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 发送给css预处理器的配置项，这里配置了一个全局样式，这个动作是prepend，往前加
        // additionalData: `@import "element-plus/packages/theme-chalk/src/base.scss";`
      },
      less: {
        // 通过less modifyVars来定制主题，可以使用less变量对象的方式来修改，但这里没有
        // https://2x.antdv.com/docs/vue/customize-theme-cn
        // https://github.com/vitejs/vite/issues/1107
        modifyVars: {
          hack: `true; @import (reference) "${resolve('src/assets/theme/purple.less')}";`,
        },
        javascriptEnabled: true // 想要less的modifyVars生效，这个必须启用
      }
    }
  },
  resolve: {
    // rollup的别名配置：https://github.com/rollup/plugins/tree/master/packages/alias#entries
    alias: [
      { find: /^~/, replacement: '' },
      { find: /^src/,replacement:resolve(__dirname,'./src') }
    ],
  },
  server:{
    proxy:{
      '/proxyPrefix': {
        target: 'http://192.168.101.150:85',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxyPrefix/, '')
      },
      '/ws': {
        target: 'http://192.168.101.150:9034',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, '')
      },
    },
    port: 3000,
    host:'0.0.0.0',
    open:true,
    force:true
  }
})
