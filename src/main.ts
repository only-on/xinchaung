import { createApp } from 'vue'
import App from './App.vue'
import initProject from 'src/bootstrap/project'
// 公共样式


import 'src/themecss/variable.css'

// import 'src/themecss/antdCopy.css'
import 'src/themecss/antdCopy2.css'
import "src/assets/theme/common.less"

import '@xianfe/antdv-markdown/dist/style.css'
import '@xianfe/icons/dist/style.css'
import "@xianfe/vue3-quill/dist/style.css"

// import moment from 'moment';
// import 'moment/dist/locale/zh-cn';
// moment.locale('zh-cn');

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import  isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek)

dayjs.locale('en');

const app = createApp(App);
initProject(app)

app.mount("#app");
