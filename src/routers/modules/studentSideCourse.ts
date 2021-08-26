import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
export default {
  path: "/studentSideCourse",
  component: Layout,
  // component: () => import("src/views/studentSideCourse/index.vue"),
  meta: {
    title: "课程",
    authCode: "studentSideCourse",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/studentSideCourse/index.vue"),
      meta: {
        title: "课程列表",
        authCode: "studentSideCourse",
      },
    },
    {
      path: "ContinueDetail",
      name: "ContinueDetail",
      component: () => import("src/views/studentSideCourse/ContinueDetail.vue"),
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