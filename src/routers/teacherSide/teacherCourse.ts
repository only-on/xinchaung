import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
export default {
  path: "teacherCourse",
  component: Layout,
  name:'teacherCourse',
  meta: {
    // title: (params?: RouteParams, query?: RouteParams) => {
    //   const dataDetailMap = {
    //       '2': '教学资源管理',
    //       '3': '教学过程',
    //       '4': '教学过程',
    //       '5': '教学过程',
    //   }
    //   return dataDetailMap[query!.role && query!.role.toString()] || dataDetailMap[3]
    // },
    title:'教学过程',
    authCode: 'courseList'
  },
  children: [
    {
      path:"",
      name:"",
      component: () => {
        // if(role===2){
        //   return import("src/views/adminModule/TeachingResourceManagement/courseManagement/courseManagement.vue")
        // }else{
          return import("src/views/teacherModule/teachCourse/courseList/index.vue")
        // }
      },
      meta: {
        title: "课程列表",
        authCode: 'courseList'
      },
    },
    {
      path:"CreateCourse",
      name:"CreateCourse",
      component: () => import("src/views/teacherModule/teachCourse/createCourse/index.vue"),
      meta: {
        title: "创建课程",
        authCode: 'CreateCourse'
      },
    },
    {
      path: "knowledgeMap",
      // component: () => import("src/views/teacherModule/knowledgeMap/index.vue"),
      meta: {
        title: "知识图谱",
        authCode: 'knowledgeMap'
      },
    },
    {
      path: "Detail",
      name:'课程详情',
      component: () => import("src/views/teacherModule/teachCourse/courseDetail/index.vue"),
      meta: {
        title: "课程详情",
        authCode: 'Detail'
      },
    },
    {
      path: "open-vnc",
      component: () => import("src/views/teacherModule/teachCourse/openEnvironment/openVnc.vue"),
      meta: {
          title: "镜像",
          authCode: 'open-vnc'
      },
    },
    {
        path: "open-jupyte",
        component: () => import("src/views/teacherModule/teachCourse/openEnvironment/openJupyte.vue"),
        meta: {
            title: "镜像",
            authCode: 'open-jupyte'
        },
    }, 
  ]
}