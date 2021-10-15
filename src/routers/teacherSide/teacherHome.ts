import Layout from 'src/views/common/Layout.vue';

export default {
  path: "home",
  component: Layout,
  meta: {
    title: "首页",
    authCode: 'home'
  },
  children: [
    {
      path: "",
      // component: () => import("src/views/teacherHome/index.vue"),
      meta: {
        title: "首页",
        authCode: 'home'
      },
    },
  ]
}