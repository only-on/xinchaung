import RouterView from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/Course",
  component: Layout,
  meta: {
    title: "课程",
    authCode: "Course",
  },
  children: [
    {
      path: "CourseList",
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
    }
  ]
}