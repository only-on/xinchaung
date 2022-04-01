import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "coursePlan",
  component: Layout,
  name:'coursePlan',
  children: [
    {
      path: "",
      component: () => import("src/views/teacherModule/teachCourse/coursePlan/index.vue"),
      meta: {
        icon: "",
        authCode: "coursePlan",
      },
    },
  ]
}