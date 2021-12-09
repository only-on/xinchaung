import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "adminUserManagement",
  component: Layout,
  name:'UserManagement',
  meta: {
    title:'用户管理',
    // title: (params?: RouteParams, query?: RouteParams) => {
    //   // console.log(query)
    //   const dataDetailMap = {
    //       '0': '教师管理',
    //       '1': '学生管理',
    //       '2': '助教管理',
    //       '3': '班级管理',
    //   }
    //   return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    // },
    authCode: "UserManagement",
  },
  children: [
    {
      path: "teacherManagement",
      component: () => import("src/views/adminUserManagement/teacherManagement.vue"),
      meta: {
        title:'教师管理',
        icon: "",
        authCode: "teacherManagement",
      },
    },
    {
      path: "studentManagement",
      component: () => import("src/views/adminUserManagement/studentManagement.vue"),
      meta: {
        title:'学生管理',
        icon: "",
        authCode: "studentManagement",
      },
    },
    {
      path: "assistantManagement",
      component: () => import("src/views/adminUserManagement/assistantManagement.vue"),
      meta: {
        title:'助教管理',
        icon: "",
        authCode: "assistantManagement",
      },
    },
    {
      path: "classManagement",
      component: () => import("src/views/adminUserManagement/classManagement.vue"),
      meta: {
        title:'班级管理',
        icon: "",
        authCode: "classManagement",
      },
    },
  ]
}