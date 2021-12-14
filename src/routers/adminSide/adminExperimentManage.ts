import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  // path: "adminExperimentManage",
  // component: Layout,
  // name:'adminExperimentManage',
  // meta: {
  //   title: (params?: RouteParams, query?: RouteParams) => {
  //     // console.log(query)
  //     const dataDetailMap = {
  //         '0': '教师实验管理',
  //         '1': '基础实验管理',
  //         '2': '共享实验管理',
  //         '3': '技术方向管理',
  //     }
  //     return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
  //   },
  //   authCode: "adminExperimentManage",
  // },
  // children: [
  //   {
  //     path: "",
  //     name:'adminExperimentManage',
  //     component: RouterViews,
  //     meta: {
  //       icon: "",
  //       authCode: "adminExperimentManage",
  //     },
  //     children:[
  //       {
  //         path:'',
  //         component: () => import("src/views/adminExperimentManage/index.vue"),
  //         meta: {
  //           icon: "",
  //           authCode: "adminExperimentManage",
  //         },
  //       },
  //       {
  //         path:'ExperimentList',
  //         name:'ExperimentList',
  //         component: () => import("src/views/adminExperimentManage/ExperimentList.vue"),
  //         meta: {
  //           title:'实验列表',
  //           icon: "",
  //           authCode: "ExperimentList",
  //         },
  //       },
  //       {
  //         path:'ChapterList',
  //         name:'ChapterList',
  //         component: () => import("src/views/adminExperimentManage/ChapterList.vue"),
  //         meta: {
  //           title:'章节列表',
  //           icon: "",
  //           authCode: "ChapterList",
  //         },
  //       },
  //       {
  //         path: "ExperimentDetail",
  //         name: "ExperimentDetail",
  //         component: () => import("src/views/teacherExperiment/ExperimentDetail.vue"),
  //         meta: {
  //             title: "实验详情",
  //             authCode: 'ExperimentDetail'
  //         },
  //       },
  //     ]
  //   },
  // ]
}