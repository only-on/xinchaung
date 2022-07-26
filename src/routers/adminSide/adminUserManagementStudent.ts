import Layout from 'src/views/common/Layout.vue';
import RouterViews from "src/components/RouterView.vue";
export default {
  path: "adminUserManagementStudent",
  component: Layout,
  name:'adminUserManagementStudent',
  meta: {
    title:'用户管理',
    showInBreadcrumb: true,
    authCode: "adminUserManagementStudent",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/adminModule/adminUserManagement/studentManagement.vue"),
      meta: {
        title:'学生管理',
        icon: "",
        authCode: "studentManagement",
      },
    },
    {
      path: "createStudent",
      component: () => import("src/views/adminModule/adminUserManagement/createStudent.vue"),
      meta: {
        title:'创建学生',
        icon: "",
        authCode: "createStudent",
      },
    },
  ]
}