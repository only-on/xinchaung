import Layout from "src/views/common/Layout.vue";

export default {
  path: "teacherExamination",
  component: Layout,
  name: "teacherExamination",
  meta: {
    title: "考试",
    authCode: "teacherExamination",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/teacherModule/teacherExamination/index.vue"),
      meta: {
        title: "考试",
        authCode: "teacherExamination",
      },
    },
  ],
};
