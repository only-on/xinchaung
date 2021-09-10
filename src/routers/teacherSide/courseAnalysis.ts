import Layout from 'src/views/common/Layout.vue';
import { RouteLocationNormalized } from 'vue-router'

export default {
  path: "course",
  component: Layout,
  meta: {
    title: "课程",
    authCode: 'course'
  },
  children: [
    {
      path: "analysis",
      name: "analysis",
      component: () => import("src/views/teacherCourseAnalysis/analysis.vue"),
      meta: {
        title: "分析",
        authCode: 'analysis'
      },
      // beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
      //     console.log(to, from);
      //     next(false)
      // }
    },
  ]
}