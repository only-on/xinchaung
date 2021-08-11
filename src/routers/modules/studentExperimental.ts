import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/",
  component: Layout,
  // component: () => import("src/views/studentExperimental/index.vue"),
  meta: {
    title: "实训",
    authCode: "Experimental",
  },
  children: [
    {
      path: "Experimental",
      component: RouterViews,
      // component: () => import("src/views/studentExperimental/index.vue"),
      meta: {
        title: "我的实训",
        icon: "",
        authCode: "Experimental",
      },
      children:[
        {
          path:'ExperimentalList',
          name: "ExperimentalList",
          component: () => import("src/views/studentExperimental/index.vue"),
          meta: {
            title: "实训列表",
          },
        },
        {
          path:'ExperimentalDetail',
          name: "ExperimentalDetail",
          component: () => import("src/views/studentExperimental/ExperimentalDetail.vue"),
          meta: {
            title: "实训详情",
          },
        }
      ]
    }
  ]
}