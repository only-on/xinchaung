import Layout from "src/views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';

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
    {
      path: "createExamination",
      name: "createExamination",
      component: () => import("src/views/teacherModule/teacherExamination/create.vue"),
      meta: {
        title: '创建考试',
        authCode: "createExamination",
      },
    },
  ],
};
