import Layout from "src/views/common/Layout.vue";

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
