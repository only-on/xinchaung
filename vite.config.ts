import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
import {resolve} from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [{
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`
        },
        resolveComponent: (name) => {
          return `element-plus/lib/${name}`
        }
      }]
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
    }
  }
})
