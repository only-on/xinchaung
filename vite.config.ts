import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteRawPlugin from "vite-raw-plugin";
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    vueJsx(),
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
      // "/proxyPrefix": {
      //   // target: "http://192.168.101.130",
      //   target: "http://192.168.101.221:84",
      //   // target: "http://xinchuang.local/",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/proxyPrefix/, ""),
        
      // },
      "/api": {
        target: "http://192.168.101.221:84",
        changeOrigin: true,
      },   
      "/dmc": {
        target: "http://192.168.101.130",
        changeOrigin: true,
      },         
      "/knowledge-map1": {
        target: "http://192.168.101.130",
        changeOrigin: true,
      },
      '/ws': {
        target: "ws://192.168.101.221:84",
        // target: 'ws://192.168.101.130',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, '')
      }
    },
    port: 3010,
    host: "0.0.0.0",
    open: true,
    force: true,
  },
  build: {
    sourcemap: false,
    brotliSize: false,
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
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
