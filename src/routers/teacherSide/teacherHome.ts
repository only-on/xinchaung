import Layout from 'src/views/common/Layout.vue';
import extStorage from "src/utils/extStorage";
import { LocationQuery, RouteParams } from 'vue-router';
const { lStorage } = extStorage
const role = lStorage.get('role')

export default {
  path: "home",
  component: Layout,
  name:'home',
  meta: {
    title: "首页",
    authCode: 'home'
  },
  children: [
    {
      path: "",
      component: () => import("src/views/teacherModule/teacherHome/index.vue"),
      meta: {
        title: "首页",
        authCode: 'home'
      },
    },
  ]
}