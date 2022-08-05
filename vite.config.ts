import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteRawPlugin from "vite-raw-plugin";
import viteCompression from 'vite-plugin-compression';
const proxyTarget={
  130:'http://192.168.101.130',
  221:'http://192.168.101.221:81',
  // 221:'http://192.168.101.123'
}
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    vueJsx(),
    viteCompression(),
    viteRawPlugin({
      fileRegex: /\.md$/,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {},
      less: {},
    },
  },
  resolve: {
    // rollup的别名配置：https://github.com/rollup/plugins/tree/master/packages/alias#entries
    alias: [
      { find: /^~/, replacement: "" },
      { find: /^src/, replacement: resolve(__dirname, "./src") },
      { find: /^packages/, replacement: resolve(__dirname, "./packages") },
      { find: /^vue-i18n$/, replacement: "vue-i18n/dist/vue-i18n.cjs.js" },
    ],
  },
  server: {
    proxy: {
      "/proxyPrefix": {
        // target: proxyTarget[222],
        target: proxyTarget[221],
        // target: "http://xinchuang.local/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxyPrefix/, ""),
      },
      "/api": {
        // target: proxyTarget[130]",
        target: proxyTarget[221],
        // target: proxyTarget[222],
        changeOrigin: true,
      },
      // "/report": {
      //   // target: proxyTarget[130]",
      //   target: proxyTarget[221],
      //   changeOrigin: true,
      // },
      "/timetable": {
        // target: proxyTarget[130]",
        target: proxyTarget[221],
        changeOrigin: true,
      },
      "/dmc": {
        // target: proxyTarget[130]",
        target: proxyTarget[221],
        changeOrigin: true,
      },
      "/uploadfiles": {
        // target: proxyTarget[130]",
        target: proxyTarget[221],
        changeOrigin: true,
      },
      "/professor": {
        // target: proxyTarget[130]",
        target: proxyTarget[221],
        changeOrigin: true,
      },
      "/knowledge-map1": {
        target: proxyTarget[130],
        changeOrigin: true,
      },
      '/wssh': {
        target: proxyTarget[221],
        changeOrigin: true,
      },
      '/ws': {
        target: "ws://192.168.101.221:84",
        // target: 'ws://192.168.101.130',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, '')
      },
    },
    port: 3010,
    host: "0.0.0.0",
    open: true,
    force: true,
  },
  build: {
    sourcemap: true,
    brotliSize: false,
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // return id
            //   .toString()
            //   .split("node_modules/")[1]
            //   .split("/")[0]
            //   .toString();
            const arr=id.toString().split('node_modules/')[1].split('/')
            // console.log(arr);
            if (arr[0].includes("@xianfe")) {
                return arr[1].toString()
            }
            else{
              switch (arr[0]) {
              case "ant-design-vue":
              case "ace-builds":
              case "lodash":
              case "@novnc":
                return '_'+arr[0]
                break;
              default:
                return '__vendor'
                break;
              }
            }

            // return arr[0].toString();
          }
        },
      },
    },
  },
});
// "pretty-quick": "^3.1.3",
// "husky": {
//   "hooks": {
//     "pre-commit": "pretty-quick --staged"
//   }
// }
