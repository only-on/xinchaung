import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "adminUserManagement",
  component: Layout,
  name:'UserManagement',
  meta: {
    title:'用户',
    showInBreadcrumb: false,
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
      component: () => import("src/views/adminModule/adminUserManagement/teacherManagement.vue"),
      meta: {
        // title:'教师管理',
        title:`用户${'\xa0\xa0'}/${'\xa0\xa0'}教师管理`,
        icon: "",
        authCode: "teacherManagement",
      },
    },
    {
      path: "studentManagement",
      component: () => import("src/views/adminModule/adminUserManagement/studentManagement.vue"),
      meta: {
        // title:'学生管理',
        title:`用户${'\xa0\xa0'}/${'\xa0\xa0'}学生管理`,
        icon: "",
        authCode: "studentManagement",
      },
    },
    {
      path: "assistantManagement",
      component: () => import("src/views/adminModule/adminUserManagement/assistantManagement.vue"),
      // component: () => import("src/views/teacherAssistant/assistant.vue"),
      meta: {
        // title:'助教管理',
        title:`用户${'\xa0\xa0'}/${'\xa0\xa0'}助教管理`,
        icon: "",
        authCode: "assistantManagement",
      },
    },
    // {
    //   path: "assistantManagement2",
    //   // component: () => import("src/views/teacherAssistant/assistant.vue"),
    //   meta: {
    //     title:'助教管理',
    //     icon: "",
    //     authCode: "assistantManagement2",
    //   },
    // },
    {
      path: "classManagement",
      name:'classManagement',
      component: RouterViews,
      meta: {
        // title:'班级管理',
        title:`用户${'\xa0\xa0'}/${'\xa0\xa0'}班级管理`,
        icon: "",
        authCode: "classManagement",
      },
      children:[
        {
          path: "",
          component: () => import("src/views/adminModule/adminUserManagement/classManagement.vue"),
          meta: {
            title:'',
            icon: "",
            authCode: "classManagement",
          },
        },
        {
          path: "classEdit",
          component: () => import("src/views/adminModule/adminUserManagement/classEdit.vue"),
          meta: {
            title:'编辑班级',
            icon: "",
            authCode: "classEdit",
          },
        },
      ]
    },
  ]
}