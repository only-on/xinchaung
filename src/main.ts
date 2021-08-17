import { createApp } from 'vue'
import App from './App.vue'
import initProject from 'src/utils/project'
import "src/assets/theme/purple.less"

// 公共样式
import "./style/common.scss"

const app = createApp(App);
initProject(app)

app.mount("#app");