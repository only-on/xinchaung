import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from "vue-router";
export default {
  path: "teacherMaterialResource",
  component: Layout,
  name: "teacherMaterialResource",
  meta: {
    title: "素材资源",
    // title: (params?: RouteParams, query?: RouteParams) => {
    //   const dataDetailMap = {
    //       '0': '',
    //       '1': '',
    //   }
    //   return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    // },
    authCode: "teacherMaterialResource",
  },
  children: [
    {
      path: "",
      component: () =>
        import("src/views/teacherModule/teacherMaterialResource/index.vue"),
      meta: {
        icon: "",
        authCode: "teacherMaterialResource",
      },
    },
  ],
};
