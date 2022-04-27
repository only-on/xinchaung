import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "home",
  component: Layout,
  name:'adminHome',
  meta: {
    title: "",
    authCode: 'adminHome'
  },
  children: [
    {
      path: "",
      component: () => import("src/views/adminModule/home/index.vue"),
      meta: {
        title: "",
        authCode: 'adminHome'
      },
    },
  ]
}