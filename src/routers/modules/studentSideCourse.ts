import RouterViews from "../../components/RouterView.vue";
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
      path: "",
      component: RouterViews,
      meta: {
        title: "我的课程",
        icon: "",
        authCode: "CourseList",
      },
      children: [
        {
          path: "",
          name: "CourseList",
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