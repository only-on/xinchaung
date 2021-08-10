import { createApp } from 'vue'
import App from './App.vue'

import router from "./routers/index";
import store from "./store/index";


import NavTab from './components/NavTab.vue'

import $router from "./routers/index";

const app = createApp(App);
app.use(router);
// app.use(store);

app.config.globalProperties.$router = $router
app.use(store);
app.mount("#app");
app.component('NavTab',NavTab)

