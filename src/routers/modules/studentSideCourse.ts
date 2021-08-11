import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/",
  component: Layout,
  // component: () => import("src/views/studentSideCourse/index.vue"),
  meta: {
    title: "课程",
    authCode: "Course",
  },
  children: [
    {
      path: "Course",
      component: RouterViews,
      // component: () => import("src/views/studentSideCourse/index.vue"),
      meta: {
        title: "我的课程",
        icon: "",
        authCode: "CourseList",
      },
      children: [
        {
          path: "CourseList",
          name: "CourseList",
          component: () => import("src/views/studentSideCourse/index.vue"),
          meta: {
            title: "课程列表",
            authCode: "",
          },
        },
        {
          path: "ContinueLearning",
          name: "ContinueLearning",
          component: () => import("src/views/studentSideCourse/ContinueLearning.vue"),
          meta: {
            title: "课程详情",
            authCode: "",
          },
          children:[
            {
              path: "ContinueLearningSon",
              name: "ContinueLearningSon",
              component: () => import("src/views/studentSideCourse/ContinueLearningSon.vue"),
              meta: {
                title: "详情儿子",
                authCode: "",
              },
            },
          ]
        },
      ],
    }
  ]
}