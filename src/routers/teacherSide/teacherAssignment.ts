import Layout from "src/views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';

export default {
  path: "teacherAssignment",
  component: Layout,
  name: "teacherAssignment",
  meta: {
    title: "作业",
    authCode: "teacherAssignment",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/teacherModule/teacherAssignment/index.vue"),
      // component: () => import("src/views/teacherModule/teacherAssignment/teacherAssignmentPreview.vue"),
      meta: {
        title: "作业",
        authCode: "teacherAssignment",
      },
    },
    // {
    //   path: "createAssignment",
    //   name: "createAssignment",
    //   component: () => import("src/views/teacherModule/teacherAssignment/create.vue"),
    //   meta: {
    //     title: (params?: RouteParams, query?: RouteParams) => {
    //       return query!.id?'复用作业':'创建作业'
    //     },
    //     authCode: "createAssignment",
    //   },
    // },
    // {
    //   path: "reviewAssignment",
    //   name: "reviewAssignment",
    //   component: () => import("src/views/teacherModule/teacherAssignment/review.vue"),
    //   meta: {
    //     title: '作业评阅',
    //     authCode: "reviewAssignment",
    //   },
    // },
    { 
      path: "teacherAssignmentPreview",
      name: "teacherAssignmentPreview",
      component: () => import("src/views/teacherModule/teacherAssignment/teacherAssignmentPreview.vue"),
      meta: {
        title: "作业预览",
        authCode: "teacherAssignmentPreview",
      },
    },
    { 
      path: "teacherAssignmentAchievement",
      name: "teacherAssignmentAchievement",
      component: () => import("src/views/teacherModule/teacherAssignment/teacherAssignmentAchievement.vue"),
      meta: {
        title: "成绩详情",
        authCode: "teacherAssignmentAchievement",
      },
    },
    { 
      path: "teacherAssignmentEdit",
      name: "teacherAssignmentEdit",
      component: () => import("src/views/teacherModule/teacherAssignment/teacherAssignmentEdit.vue"),
      meta: {
        title: "编辑作业",
        authCode: "teacherAssignmentEdit",
      },
    },
    //
  ],
};
