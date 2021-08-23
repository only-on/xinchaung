import { createApp } from 'vue'
import App from './App.vue'
import initProject from 'src/utils/project'
// 公共样式
import "src/assets/theme/common.less"

const app = createApp(App);
initProject(app)

app.mount("#app");