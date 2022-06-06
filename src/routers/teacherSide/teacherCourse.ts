import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "teacherCourse",
  component: Layout,
  name:'teacherCourse',
  meta: {
    // title: (params?: RouteParams, query?: RouteParams) => {
    //   // console.log(query)
    //   const dataDetailMap = {
    //       '0': '课程',
    //       '1': '内置课程',
    //       '2': '归档课程',
    //   }
    //   return dataDetailMap[query!.currentTab && query!.currentTab.toString()] || dataDetailMap[0]
    // },
    title:'教学过程',
    authCode: 'courseList'
  },
  children: [
    {
      path:"",
      name:"",
      component: () => import("src/views/teacherModule/teachCourse/courseList/index.vue"),
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