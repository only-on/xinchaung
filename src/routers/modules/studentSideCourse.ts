import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/",
  component: Layout,
  // component: () => import("src/views/studentSideCourse/index.vue"),
  meta: {
    title: "首页",
    authCode: "Course",
  },
  children: [
    {
      path: "Course",
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
        {
          path: "ContinueLearning",
          name: "ContinueLearning",
          component: () => import("src/views/studentSideCourse/ContinueLearning.vue"),
          meta: {
            title: "继续学习",
            authCode: "",
          },
        },
      ],
    }
  ]
}