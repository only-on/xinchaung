import Layout from "../../views/common/Layout.vue";
export default {
  path: "/dev",
  component: Layout,
  meta: {
    title: "开发测试",
    authCode: 'dev'
  },
  children: [
    {
      path: "",
      component: () => import('src/components/dev/I18n.vue'),
      meta: {
        title: "国际化",
        authCode: 'i18n'
      }
    },
    {
      path: "menu",
      component: () => import('src/components/MenuBar.vue'),
      meta: {
        title: "菜单",
        authCode: 'menu'
      }
    },
    {
      path: "test",
      component: () => import('src/components/Test.vue'),
      meta: {
        title: "功能测试",
        authCode: 'test'
      }
    },
    {
      path: "login",
      component: () => import('src/views/common/Login.vue'),
      meta: {
        title: "登录",
        authCode: 'login'
      }
    },
    {
      path: "webmsg",
      component: () => import('src/components/dev/Webmsg.vue'),
      meta: {
        title: "推送测试",
        authCode: 'webmsg'
      }
    },
    // {
    //   path: "markdown",
    //   component: () => import('src/components/dev/Markdown.vue'),
    //   meta: {
    //     title: "markdown",
    //     authCode: 'markdown'
    //   }
    // }
  ]
}