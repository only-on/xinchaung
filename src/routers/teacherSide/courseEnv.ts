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
      path: "virtualEnv",
      name: "virtualEnv",
      component: () => import("src/views/teachCourse/virtualEnv.vue"),
      meta: {
        title: "环境",
        authCode: 'virtualEnv'
      },
      // beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
      //     console.log(to, from);
      //     next(false)
      // }
    },
    {
      path: 'tsx',
      // component: () => import('src/views/teachCourse/experienceTsx')
    }
  ]
}