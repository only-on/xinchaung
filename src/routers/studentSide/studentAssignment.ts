import Layout from "src/views/common/Layout.vue";

export default {
  path: "studentAssignment",
  component: Layout,
  name: "studentAssignment",
  meta: {
    title: "作业",
    authCode: "studentAssignment",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/studentModule/studentAssignment/index.vue"),
      meta: {
        title: "作业",
        authCode: "studentAssignment",
      },
    },{
    path: "answerques",
    name: "答题",
    component: () => import("src/views/studentModule/studentAssignment/answerQues/index.vue"),
    meta: {
      title: "答题",
      authCode: "answerQues",
    },
  }
  ]
};
