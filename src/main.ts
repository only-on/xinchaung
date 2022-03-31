import { createApp } from 'vue'
import App from './App.vue'
import initProject from 'src/bootstrap/project'
// 公共样式


import 'src/themecss/variable.css'

import 'src/themecss/antdCopy.css'
import "src/assets/theme/common.less"

import '@xianfe/antdv-markdown/dist/style.css'
import '@xianfe/icons/dist/style.css'
import "@xianfe/vue3-quill/dist/style.css"

import moment from 'moment';
import 'moment/dist/locale/zh-cn';
moment.locale('zh-cn');

window.XC_ROLE=1
const app = createApp(App);
initProject(app)

app.mount("#app");
