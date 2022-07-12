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
  redirect: '/admin/adminUserManagement/teacherManagement',
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
      path: "createTeacher",
      component: () => import("src/views/adminModule/adminUserManagement/createTeacher.vue"),
      meta: {
        title:'创建教师',
        icon: "",
        authCode: "createTeacher",
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