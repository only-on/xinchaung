import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from "vue-router";
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
// console.log(role)
export default {
  path: "teacherMaterialResource",
  component: Layout,
  name: "teacherMaterialResource",
  meta: {
    // title: "素材资源",
    title: (params?: RouteParams, query?: RouteParams) => {
      const dataDetailMap = {
          '2': '教学资源管理',
          '3': '素材资源',
          '5': '素材资源',
      }
      return (query && query!.role)?dataDetailMap[query!.role.toString()]:dataDetailMap[3]
    },
    authCode: "teacherMaterialResource",
  },
  children: [
    {
      path: "",
      component: () => {
        if(role===2){
          return import("src/views/adminModule/TeachingResourceManagement/resourcesManagement/resourcesManagement.vue")
        }else{
          return import("src/views/teacherModule/teacherMaterialResource/index.vue")
        }
      },
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
              '1': '我的素材',
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
