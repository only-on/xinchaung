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
    {
      path: "createQues",
      name: "",
      component: () =>
        import("src/views/teacherModule/QuestionBank/createQues/index.vue"),
      meta: {
        title: "创建题目",
        authCode: "createQues",
      },
    },
    {
      path: "batchImport",
      name: "",
      component: () =>
        import("src/views/teacherModule/QuestionBank/batchImport/index.vue"),
      meta: {
        title: "创建题目",
        authCode: "batchImport",
      },
    },
    {
      path: "createProgramming",
      name: "",
      component: () =>
        import(
          "src/views/teacherModule/QuestionBank/createProgramming/index.vue"
        ),
      meta: {
        title: "创建题目",
        authCode: "createProgramming",
      },
    },
    {
      path: "createModelQuestion",
      name: "",
      component: () =>
        import(
          "src/views/teacherModule/QuestionBank/createModelQuestion/index.vue"
        ),
      meta: {
        title: "创建题目",
        authCode: "createModelQuestion",
      },
    },
    {
      path: "trialModel",
      name: "trialModel",
      component: () =>
        import(
          "src/views/teacherModule/QuestionBank/trialSubject/trialModel.vue"
        ),
      meta: {
        title: "试用模型题",
        authCode: "trialModel",
      },
    },
  ],
};
