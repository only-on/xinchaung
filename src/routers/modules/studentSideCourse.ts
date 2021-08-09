import RouterView from "../../components/RouterView.vue";
export default {
  path: "/Course",
  component: () => import("src/views/common/Layout.vue"),
  meta: {
    title: "课程",
    authCode: "Course",
  },
  children: [
    {
      path: "index",
      component: RouterView,
      meta: {
        title: "我的课程",
        icon: "",
        authCode: "index",
      },
      children: [
        {
          path: "",
          name: "index",
          component: () => import("src/views/studentSideCourse/index.vue"),
          meta: {
            title: "我的课程",
            authCode: "",
          },
        },
      ],
    }]
}