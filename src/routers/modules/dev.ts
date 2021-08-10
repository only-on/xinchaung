import Layout from "../../views/common/Layout.vue";
export default {
  path: "/dev",
  component: Layout,
  meta: {
    title: "开发测试",
    authCode: "dev",
  },
  children: [
    {
      path: "i18n",
      component: () => import('src/components/dev/I18n.vue'),
      meta: {
        title: "国际化",
      }
    },
    {
      path: "menu",
      component: () => import('src/components/Menu.vue'),
      meta: {
        title: "菜单",
      }
    }
  ]
}