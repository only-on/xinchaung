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
      meta: {
        title: "作业",
        authCode: "teacherAssignment",
      },
    },
    { 
      path: "teacherAssignmentPreview",
      name: "teacherAssignmentPreview",
      component: () => import("src/views/teacherModule/teacherAssignmentPreview/index.vue"),
      meta: {
        title: "作业预览",
        authCode: "teacherAssignmentPreview",
      },
    }
  ],
};
