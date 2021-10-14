import { createApp } from 'vue'
import App from './App.vue'
import initProject from 'src/bootstrap/project'
// 公共样式
import "src/assets/theme/common.less"
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
moment.locale('zh-cn');

const app = createApp(App);
initProject(app)

app.mount("#app");
