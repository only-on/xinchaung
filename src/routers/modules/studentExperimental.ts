import RouterView from "../../components/RouterView.vue";
export default {
  path: "/Experimental",
  component: () => import("src/views/common/Layout.vue"),
  meta: {
    title: "实训",
    authCode: "Experimental",
  },
  children: [
    {
      path: "index",
      component: RouterView,
      meta: {
        title: "我的实训",
        icon: "",
        authCode: "index",
      },
      children: [
        {
          path: "",
          name: "index",
          component: () => {
            const component = import("src/views/studentExperimental/index.vue")
          },
          meta: {
            title: "实训列表",
            authCode: "",
          },
        },
      ],
    }]
}