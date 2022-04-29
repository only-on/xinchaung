import Layout from 'src/views/common/Layout.vue';
import RouterViews from "src/components/RouterView.vue";
export default {
  path: "adminUserManagement",
  component: Layout,
  name:'UserManagement',
  meta: {
    title:'用户管理',
    showInBreadcrumb: true,
    authCode: "UserManagement",
  },
  children: [
    {
      path: "teacherManagement",
      component: () => import("src/views/adminModule/adminUserManagement/teacherManagement.vue"),
      meta: {
        title:'教师管理',
        icon: "",
        authCode: "teacherManagement",
      },
    },
    {
      path: "studentManagement",
      component: () => import("src/views/adminModule/adminUserManagement/studentManagement.vue"),
      meta: {
        title:'学生管理',
        icon: "",
        authCode: "studentManagement",
      },
    }
  ]
}