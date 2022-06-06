import RouterViews from "src/components/RouterView.vue";
import Layout from "src/views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "coursePlan",
  component: Layout,
  name:'coursePlan',
  meta: {
    title: "教学课程",
    authCode: "coursePlan",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/teacherModule/teachCourse/coursePlan/index.vue"),
      meta: {
        icon: "",
        authCode: "coursePlan",
      },
    },
    {
      path: "environmental",
      name:'environmental',
      component: () => import("src/views/teacherModule/teachCourse/coursePlan/environmentalManagement.vue"),
      meta: {
        icon: "",
        title: "课程安排",
        authCode: "environmental",
      },
    },
    {
      path: "createCoursePlan",
      name:'createCoursePlan',
      component: () => import("src/views/teacherModule/teachCourse/coursePlan/createCoursePlan.vue"),
      meta: {
        icon: "",
        title: "课程安排", 
        authCode: "createCoursePlan",
      },
    },
  ]
}