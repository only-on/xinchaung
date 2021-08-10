import RouterView from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/Experimental",
  component: Layout,
  meta: {
    title: "实训",
    authCode: "Experimental",
  },
  children: [
    {
      path: "ExperimentalList",
      component: RouterView,
      meta: {
        title: "我的实训",
        icon: "",
        authCode: "index",
      },
      children: [
        {
          path: "list",
          name: "index",
          component: () => import("src/views/studentExperimental/index.vue"),
          // component: () => {
          //   const component = import("src/views/studentExperimental/index.vue")
          // },
          meta: {
            title: "实训列表",
            authCode: "",
          },
        },
      ],
    }
  ]
}