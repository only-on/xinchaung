import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "/studentExperimental",
  component: Layout,
  name: "studentExperimental",
  meta: {
    title: (params?: RouteParams, query?: RouteParams) => {
      const dataDetailMap = {
          '0': '最近实训',
          '1': '我的实训',
      }
      return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    },
    authCode: "studentExperimental",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/studentModule/studentExperimental/index.vue"),
      meta: {
        title: "",
        icon: "",
        authCode: "studentExperimental",
      }
    }
  ]
}