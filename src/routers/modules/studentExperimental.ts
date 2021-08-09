import RouterView from "../../components/RouterView.vue";
export default {
  path: "/Experimental",
  component: () => import("src/views/common/Layout.vue"),
  meta: {
    title: "首页",
  },
  children: [
    {
      path: "",
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
          component: () => {
            const component = import("src/views/studentExperimental/index.vue")
            console.log('[router]: ', component)
          },
          meta: {
            title: "我的课程",
            authCode: "",
          },
        },
        {
          path: "Create",
          name: "Create",
          component: () => import("src/views/studentSideCourse/Create.vue"),
          meta: {
            title: "新建课程",
            authCode: "",
          },
        },
        {
          path: "Detail",
          name: "Detail",
          component: () => import("src/views/studentSideCourse/Detail.vue"),
          meta: {
            title: "课程详情",
            authCode: "",
          },
        },
      ],
    }]
}