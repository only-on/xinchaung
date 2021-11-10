import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "/studentExperimental",
  component: Layout,
  meta: {
    // title: "我的实训",
    title: (params?: RouteParams, query?: RouteParams) => {
      // console.log(query)
      const dataDetailMap = {
          '0': '最近实训',
          '1': '我的实训',
      }
      return dataDetailMap[query!.currentTab.toString()] || '我的实训'
    },
    authCode: "studentExperimental",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/studentExperimental/index.vue"),
      meta: {
        title: "",
        icon: "",
        authCode: "studentExperimental",
      }
    }
  ]
}