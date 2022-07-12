import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
export default {
  path: "teacherForum",
  component: Layout,
  name:'forum',
  meta: {
    // title: "公共论坛",
    // title: (params?: RouteParams, query?: RouteParams) => {
    //   // console.log(query)
    //   const dataDetailMap = {
    //       '0': '论坛广场',
    //       '1': '我的帖子',
    //   }
    //   return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    // },
    title: (params?: RouteParams, query?: RouteParams) => {
      const dataDetailMap = {
          '2': '交流问答',
          '3': '学习问答',
          '4': '学习交流',
      }
      return dataDetailMap[role.toString()] || dataDetailMap[3]
    },
    authCode: "forum",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/teacherModule/teacherForum/index.vue"),
      meta: {
        icon: "",
        authCode: "forumList",
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
      path:'ForumnDetail',
      name: "ForumnDetail",
      component: () => import("src/views/teacherModule/teacherForum/ForumnDetail.vue"),
      meta: {
        title: "帖子详情",
      },
    },
  ]
}