import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/Experimental",
  component: Layout,
  // component: () => import("src/views/studentExperimental/index.vue"),
  meta: {
    title: "实训",
    authCode: "Experimental",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/studentExperimental/index.vue"),
      meta: {
        title: "我的实训",
        icon: "",
        authCode: "Experimental",
      }
    }
  ]
}