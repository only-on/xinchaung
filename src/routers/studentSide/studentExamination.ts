import Layout from "src/views/common/Layout.vue";

export default {
  path: "studentExamination",
  component: Layout,
  name: "studentExamination",
  meta: {
    title: "考试",
    authCode: "studentExamination",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/studentModule/studentExamination/index.vue"),
      meta: {
        title: "考试",
        authCode: "studentExamination",
      },
    },
  ],
};
