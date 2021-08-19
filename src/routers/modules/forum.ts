import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/forum",
  component: Layout,
  meta: {
    title: "随堂论坛",
    authCode: "forum",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/forum/index.vue"),
      meta: {
        title: "",
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
    },
    {
      path:'PostsDetailed',
      name: "PostsDetailed",
      component: () => import("src/views/forum/PostsDetailed.vue"),
      meta: {
        title: "发帖",
      },
    }
  ]
}