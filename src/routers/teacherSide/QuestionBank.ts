import Layout from "src/views/common/Layout.vue";

export default {
  path: "QuestionBank",
  component: Layout,
  name: "QuestionBank",
  meta: {
    title: "题库",
    authCode: "QuestionBank",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/teacherModule/QuestionBank/index.vue"),
      meta: {
        title: "题库",
        authCode: "QuestionBank",
      },
    },
  ],
};
