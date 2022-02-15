import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from "vue-router";
export default {
  path: "teacherImageResourcePool",
  component: Layout,
  name: "teacherImageResourcePool",
  meta: {
    title: "镜像资源库",
    // title: (params?: RouteParams, query?: RouteParams) => {
    //   const dataDetailMap = {
    //       '0': '',
    //       '1': '',
    //   }
    //   return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    // },
    authCode: "teacherImageResourcePool",
  },
  children: [
    {
      path: "",
      component: () =>
        import("src/views/teacherModule/teacherImageResourcePool/index.vue"),
      meta: {
        icon: "",
        authCode: "teacherImageResourcePool",
      },
    },
    {
      path: "localCreated",
      name: "localCreated",
      component: () =>
        import(
          "src/views/teacherModule/teacherImageResourcePool/localCreated.vue"
        ),
      meta: {
        title: "本地上传",
      },
    },
    // localCreated
  ],
};
