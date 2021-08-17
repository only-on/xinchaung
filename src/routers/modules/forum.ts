import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/forum",
  component: Layout,
  meta: {
    title: "论坛",
    authCode: "forum",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/forum/index.vue"),
      meta: {
        title: "论坛列表",
        icon: "",
        authCode: "forum",
      },
    },
    {
      path:'CreatePosts',
      name: "CreatePosts",
      component: () => import("src/views/forum/CreatePosts.vue"),
      meta: {
        title: "发帖",
      },
    }
  ]
}