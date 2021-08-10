import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path';
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteComponents({
      // 对自动导入的组件实施TypeScript支持，需要vscode安装Volar插件
      globalComponentsDeclaration: true,
      // 自动导入组件
      // https://www.npmjs.com/package/vite-plugin-components
      // https://2x.antdv.com/docs/vue/introduce-cn
      customComponentResolvers: [AntDesignVueResolver()],
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 发送给css预处理器的配置项，这里配置了一个全局样式，这个动作是prepend，往前加
        // additionalData: `@import "element-plus/packages/theme-chalk/src/base.scss";`
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
      '/api/': {
        target: 'http://192.168.101.150',
        changeOrigin: true,
      },
    },
    port: 3000
  }
})
