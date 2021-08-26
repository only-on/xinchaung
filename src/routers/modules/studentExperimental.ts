import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/studentExperimental",
  component: Layout,
  meta: {
    title: "我的实训",
    authCode: "studentExperimental",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/studentExperimental/index.vue"),
      meta: {
        title: "我的实训",
        icon: "",
        authCode: "studentExperimental",
      }
    }
  ]
}