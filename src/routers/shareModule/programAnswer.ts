import RouterViews from "src/components/RouterView.vue";

export default {
  path: "/programAnswer",
  component: RouterViews,
  meta: {
    title: "编程题",
    authCode: "programAnswer",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/shareModule/programAnswer/index.vue"),
      meta: {
        title: "vm",
        authCode: "",
      },
    }
  ],
};
