import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from "vue-router";
export default {
  path: "teacherExperimentResourcePool",
  component: Layout,
  name: "teacherExperimentResourcePool",
  meta: {
    title: "实验资源库",
    // title: (params?: RouteParams, query?: RouteParams) => {
    //   const dataDetailMap = {
    //       '0': '',
    //       '1': '',
    //   }
    //   return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
    // },
    authCode: "teacherExperimentResourcePool",
  },
  children: [
    {
      path: "",
      component: () =>
        import(
          "src/views/teacherModule/teacherExperimentResourcePool/index.vue"
        ),
      meta: {
        icon: "",
        authCode: "teacherExperimentResourcePool",
      },
    },
    {
      path: "experimentDetail",
      component: () =>
        import(
          "src/views/teacherModule/teacherExperimentResourcePool/experimentDetail.vue"
        ),
      meta: {
        icon: "",
        authCode: "teacherExperimentResourcePool",
      },
    },
  ],
};
