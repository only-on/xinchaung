import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "teacherForum",
  component: Layout,
  meta: {
    // title: "公共论坛",
    title: (params?: RouteParams, query?: RouteParams) => {
      // console.log(query)
      const dataDetailMap = {
          '0': '公共论坛',
          '1': '我的提问',
          '2': '我参与的帖子',
      }
      return dataDetailMap[query!.currentTab.toString()] || '论坛'
    },
    authCode: "forum",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/teacherForum/index.vue"),
      meta: {
        // title: "",
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