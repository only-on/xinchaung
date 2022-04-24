import Layout from "src/views/common/Layout.vue";

export default {
  path: "statistics",
  component: Layout,
  name: "studentStatistics",
  meta: {
    title: "学生端首页",
    authCode: "studentStatistics",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/studentModule/student/index.vue"),
      meta: {
        title: "学生端首页",
        authCode: "studentStatistics",
      },
    },
  ],
};
