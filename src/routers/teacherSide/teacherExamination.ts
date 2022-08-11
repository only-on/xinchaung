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
        title: (params?: RouteParams, query?: RouteParams) => {
          return query!.id?'复用考试':'创建考试'
        },
        authCode: "createExamination",
      },
    },
    {
      path: "reviewExamination",
      name: "reviewExamination",
      component: () => import("src/views/teacherModule/teacherExamination/review.vue"),
      meta: {
        title: '考试评阅',
        authCode: "reviewExamination",
      },
    },
    { 
      path: "teacherExaminationPreview",
      name: "teacherExaminationPreview",
      component: () => import("src/views/teacherModule/teacherExamination/teacherExaminationPreview.vue"),
      meta: {
        title: "考试预览",
        authCode: "teacherExaminationPreview",
      },
    },
    { 
      path: "teacherExaminationAchievement",
      name: "teacherExaminationAchievement",
      component: () => import("src/views/teacherModule/teacherExamination/teacherExaminationAchievement.vue"),
      meta: {
        title: "成绩详情",
        authCode: "teacherExaminationAchievement",
      },                                                                                                                             
    },
    { 
      path: "teacherExaminationEdit",
      name: "teacherExaminationEdit",
      component: () => import("src/views/teacherModule/teacherExamination/teacherExaminationEdit.vue"),
      meta: {
        title: "编辑考试",
        authCode: "teacherExaminationEdit",
      },
    },
  ],
};
