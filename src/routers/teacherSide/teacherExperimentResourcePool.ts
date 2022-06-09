import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from "vue-router";
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
export default {
  path: "teacherExperimentResourcePool",
  component: Layout,
  name: "teacherExperimentResourcePool",
  meta: {
    // title: "实验资源库",
    title: (params?: RouteParams, query?: RouteParams) => {
      const dataDetailMap = {
          '2': '教学资源管理',
          '3': '实验资源库',
      }
      return dataDetailMap[query!.role && query!.role.toString()] || dataDetailMap[3]
    },
    authCode: "teacherExperimentResourcePool",
  },
  children: [
    {
      path: "",
      component: () => {
        if(role===2){
          return import("src/views/adminModule/TeachingResourceManagement/experimentManagement/experimentManagement.vue")
        }else{
          return import( "src/views/teacherModule/teacherExperimentResourcePool/index.vue")
        }
      },
      meta: {
        icon: "",
        authCode: "experimentList",
      },
    },
    {
      path: "CreateExperiment",
      name: "CreateExperiment",
      component: () =>
        import(
          "src/views/teacherModule/teacherExperimentResourcePool/CreateExperiment.vue"
        ),
      meta: {
        title: "新建实验",
        icon: "",
        authCode: "CreateExperiment",
      },
    },
    {
      path: "experimentDetail",
      component: () =>
        import(
          "src/views/teacherModule/teacherExperimentResourcePool/experimentDetail.vue"
        ),
      meta: {
        title: "实验详情",
        icon: "",
        authCode: "experimentDetail",
      },
    },
    {
      path: "experimentReportTemplate",
      component: () =>
        import(
          "src/views/teacherModule/teacherExperimentResourcePool/experimentReportTemplate.vue"
        ),
      meta: {
        title: "报告模板预览",
        icon: "",
        authCode: "experimentReportTemplate",
      },
    },
  ],
};
