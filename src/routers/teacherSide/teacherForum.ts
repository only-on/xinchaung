import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "teacherForum",
  component: Layout,
  name:'forum',
  meta: {
    // title: "公共论坛",
    title: (params?: RouteParams, query?: RouteParams) => {
      // console.log(query)
      const dataDetailMap = {
          '0': '论坛广场',
          '1': '我的帖子',
      }
      return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    },
    authCode: "forum",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/teacherModule/teacherForum/index.vue"),
      meta: {
        icon: "",
        authCode: "forum",
      },
    },
    {
      path:'CreatePosts',
      name: "teacherCreatePosts",
      component: () => import("src/views/teacherModule/teacherForum/CreatePosts.vue"),
      meta: {
        title: "发帖",
      },
    },
    {
      path:'PostsDetailed',
      name: "teacherPostsDetailed",
      component: () => import("src/views/teacherModule/teacherForum/PostsDetailed.vue"),
      meta: {
        title: "帖子详情",
      },
    }
  ]
}