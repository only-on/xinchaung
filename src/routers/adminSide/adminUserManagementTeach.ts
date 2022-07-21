import Layout from 'src/views/common/Layout.vue';
import RouterViews from "src/components/RouterView.vue";
export default {
  path: "adminUserManagementTeach",
  component: Layout,
  name:'adminUserManagementTeach',
  meta: {
    title:'用户管理',
    showInBreadcrumb: true,
    authCode: "adminUserManagementTeach",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/adminModule/adminUserManagement/teacherManagement.vue"),
      meta: {
        title:'教师管理',
        icon: "",
        authCode: "teacherManagement",
      },
    },
    {
      path: "createTeacher",
      component: () => import("src/views/adminModule/adminUserManagement/createTeacher.vue"),
      meta: {
        title:'创建教师',
        icon: "",
        authCode: "createTeacher",
      },
    },
  ]
}