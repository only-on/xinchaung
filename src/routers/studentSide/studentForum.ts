import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "/studentForum",
  component: Layout,
  name:'studentForum',
  meta: {
    title: (params?: RouteParams, query?: RouteParams) => {
      const dataDetailMap = {
          '0': '随堂论坛',
          '1': '我的提问',
          '2': '我参与的帖子',
      }
      return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    },
    authCode: "forum",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/studentModule/studentForum/index.vue"),
      meta: {
        title: "",
        icon: "",
        authCode: "forum",
      },
    },
    {
      path:'CreatePosts',
      name: "CreatePosts",
      component: () => import("src/views/studentModule/studentForum/CreatePosts.vue"),
      meta: {
        title: "发帖",
      },
    },
    {
      path:'PostsDetailed',
      name: "PostsDetailed",
      component: () => import("src/views/studentModule/studentForum/PostsDetailed.vue"),
      meta: {
        title: "帖子详情",
      },
    }
  ]
}