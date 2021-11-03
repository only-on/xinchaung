import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/teacherForum",
  component: Layout,
  meta: {
    title: "论坛",
    authCode: "forum",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/teacherForum/index.vue"),
      meta: {
        title: "",
        icon: "",
        authCode: "forum",
      },
    },
    {
      path:'CreatePosts',
      name: "teacherCreatePosts",
      component: () => import("src/views/teacherForum/CreatePosts.vue"),
      meta: {
        title: "发帖",
      },
    },
    {
      path:'PostsDetailed',
      name: "teacherPostsDetailed",
      component: () => import("src/views/teacherForum/PostsDetailed.vue"),
      meta: {
        title: "帖子详情",
      },
    }
  ]
}