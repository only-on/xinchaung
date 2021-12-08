import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "adminUserManagement",
  component: Layout,
  name:'UserManagement',
  meta: {
    title: (params?: RouteParams, query?: RouteParams) => {
      // console.log(query)
      const dataDetailMap = {
          '0': '教师管理',
          '1': '学生管理',
          '2': '助教管理',
          '3': '班级管理',
      }
      return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    },
    authCode: "UserManagement",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/adminUserManagement/index.vue"),
      meta: {
        icon: "",
        authCode: "UserManagement",
      },
    },
  ]
}