import Layout from 'src/views/common/Layout.vue';

export default {
  path: "home",
  component: Layout,
  name:'adminHome',
  meta: {
    title: "首页",
    authCode: 'adminHome'
  },
  children: [
    {
      path: "",
      component: () => import("src/views/adminModule/admin/index.vue"),
      meta: {
        title: "首页",
        authCode: 'adminHome'
      },
    },
  ]
}