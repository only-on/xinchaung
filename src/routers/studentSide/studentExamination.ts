import Layout from "src/views/common/Layout.vue";
import RouterViews from "src/components/RouterView.vue";
export default {
  path: "studentExamination",
  component: Layout,
  name: "studentExamination",
  meta: {
    title: "考试列表",
    authCode: "studentExamination",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/studentModule/studentExamination/index.vue"),
      meta: {
        title: "考试列表",
        authCode: "studentExamination",
      },
    },
    {
      path: "Examinationanswerques",
      name: "Examinationanswerques",
      component: RouterViews,
      // component: () => import("src/views/studentModule/studentAssignment/answerQues/index.vue"),
      meta: {
        title: "开始考试",
        authCode: "answerQues",
      },
      children:[
        {
          path: "",
          name: "",
          component: () => import("src/views/studentModule/studentAssignment/answerQues/index.vue"),
          meta: {
            title: "开始考试",
            authCode: "studentExamination",
          },
        },
        {
          path: "studentModelAnswer",
          name: "studentModelAnswer",
          component: () => import("src/views/studentModule/studentExamination/studentModelAnswer.vue"),
          meta: {
            title: "模型题作答",
            authCode: "studentModelAnswer",
          },
        },
      ]
    },
    
  ],
};
