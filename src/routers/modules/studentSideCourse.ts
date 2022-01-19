import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "/studentSideCourse",
  name:'studentSideCourse',
  component: Layout,
  meta: {
    // title: "我的课程",
    title: (params?: RouteParams, query?: RouteParams) => {
      const dataDetailMap = {
          '0': '最近学习',
          '1': '我的课程',
      }
      return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    },
    authCode: "studentSideCourse",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/studentSideCourse/index.vue"),
      meta: {
        title: "",
        authCode: "studentSideCourse",
      },
    },
    {
      path: "ContinueDetail",
      name: "ContinueDetail",
      component: () => import("src/views/studentSideCourse/ContinueDetail.vue"),
      meta: {
        title: "课程详情",
        authCode: "",
      }
    },
    {
      path: "Resources",
      name: "Resources",
      component: () => import("src/views/studentSideCourse/Resources.vue"),
      meta: {
        title: "课程资源",
        authCode: "",
      }
    }
  ],
}