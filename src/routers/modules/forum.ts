import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/",
  component: Layout,
  meta: {
    title: "论坛",
    authCode: "Experimental",
  },
  children: [
    {
      path: "forum",
      component: RouterViews,
      // component: () => import("src/views/studentExperimental/index.vue"),
      meta: {
        title: "论坛",
        icon: "",
        authCode: "forum",
      },
      children:[
        {
          path:'forumList',
          name: "forumList",
          component: () => import("src/views/studentExperimental/index.vue"),
          meta: {
            title: "随堂论坛",
          },
        },
        {
          path:'CreatePosts',
          name: "CreatePosts",
          component: () => import("src/views/studentExperimental/CreatePosts.vue"),
          meta: {
            title: "发帖",
          },
        }
      ]
    }
  ]
}