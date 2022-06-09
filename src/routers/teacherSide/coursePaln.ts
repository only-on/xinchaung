import RouterViews from "src/components/RouterView.vue";
import Layout from "src/views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
export default {
  path: "coursePlan",
  component: Layout,
  name:'coursePlan',
  meta: {
    // title: "教学过程",
    title: (params?: RouteParams, query?: RouteParams) => {
      console.log(role);
      
      const dataDetailMap = {
          '3': '教学过程',
          '2': '资源预约',
      }
      return dataDetailMap[role.toString()] || dataDetailMap[3]
      // return dataDetailMap[query!.role && query!.role.toString()] || dataDetailMap[3]
    },
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