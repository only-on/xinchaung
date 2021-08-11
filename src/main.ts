import { createApp } from 'vue'
import App from './App.vue'
import router from "./routers/index";
import i18n from './i18n'
import store from "./store/index";
import "src/assets/theme/purple.less"
// 公共样式
import "./style/common.scss"

const app = createApp(App);
app.use(router);
app.use(i18n);
// app.use(store);
app.use(store);
app.mount("#app");