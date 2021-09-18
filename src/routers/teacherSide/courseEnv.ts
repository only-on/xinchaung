import Layout from 'src/views/common/Layout.vue';

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
    },
    {
      path: "evalute",
      name: "evalute",
      component: () => import("src/views/teachCourse/evalute.vue"),
      meta: {
          title: "评价",
          authCode: 'evalute'
      },
  },
  ]
}