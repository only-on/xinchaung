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
        authCode: "materialList",
      },
    },
    {
      path: "createMaterial",
      name:'createMaterial',
      component: () =>
        import(
          "src/views/teacherModule/teacherMaterialResource/createMaterial.vue"
        ),
      meta: {
        title: "创建素材",
        icon: "",
        authCode: "createMaterial",
      },
    },
    {
      path: "ResourceDetail",
      name:'ResourceDetail',
      component: () =>
        import("src/views/teacherModule/teacherMaterialResource/Detail.vue"),
      meta: {
        authCode: "ResourceDetail",
        // title: "数据集详情",
        title: (params?: RouteParams, query?: RouteParams) => {
          const dataDetailMap = {
              '0': '公有素材',
              '1': '私有素材',
          }
          return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
        },
      },
    },
    {
      path: "setDataDetail",
      name:'setDataDetail',
      component: () =>
        import("src/views/teacherModule/teacherMaterialResource/setDataDetail.vue"),
      meta: {
        authCode: "setDataDetail",
        // title: "数据集详情",
        title: (params?: RouteParams, query?: RouteParams) => {
          const dataDetailMap = {
              '0': '公有素材',
              '1': '私有素材',
          }
          return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
        },
      },
    },
  ],
};
