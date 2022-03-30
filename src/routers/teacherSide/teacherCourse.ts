import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
export default {
  path: "teacherCourse",
  component: Layout,
  name:'teacherCourse',
  meta: {
    title: (params?: RouteParams, query?: RouteParams) => {
      // console.log(query)
      const dataDetailMap = {
          '0': '课程',
          '1': '内置课程',
          '2': '归档课程',
      }
      return dataDetailMap[query!.currentTab && query!.currentTab.toString()] || dataDetailMap[0]
    },
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
      path: "virtualEnv",
      name: "virtualEnv",
      // component: () => import("src/views/teacherModule/teachCourse/virtualEnv.vue"),
      meta: {
        title: "环境",
        authCode: 'virtualEnv'
      },
    },
    {
      path: "evalute",
      name: "evalute",
      // component: () => import("src/views/teacherModule/teachCourse/evalute/evalute.vue"),
      meta: {
          title: "评价",
          authCode: 'evalute'
      },
    },
    {
      path: "createTestPaper",
      name: "createTestPaper",
      // component: () => import("src/views/teacherModule/teachCourse/createTestPaper/addMultipleModal.vue"),
      // component: () => import("src/views/teacherModule/teachCourse/createTestPaper/create.vue"),
      meta: {
        title: "创建试卷",
        authCode: 'createTestPaper'
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
      path: "testPaperList",
      // component: () => import("src/views/teacherModule/teachCourse/testPaperList/testPaperList.vue"),
      meta: {
        title: "随堂测试",
        authCode: 'testPaperList'
      },
    },
    {
      path: "result",
      // component: () => import("src/views/teacherModule/teachCourse/testPaperList/interationResult.vue"),
      meta: {
        title: "测试结果",
        authCode: 'result'
      },
    },
    {
      path: "create",
      // component: () => import("src/views/teacherModule/teachCourse/createCourse/index.vue"),
      meta: {
        title: "创建",
        authCode: 'create'
      },
    },
    {
      path: "detail",
      // component: () => import("src/views/teacherModule/teachCourse/courseDetail/index.vue"),
      meta: {
        title: "详情",
        authCode: 'detail'
      },
    },
    {
      path: "archive-detail",
      // component: () => import("src/views/teacherModule/teachCourse/courseDetail/archivedDetail.vue"),
      meta: {
        title: "归档详情",
        authCode: 'archive-detail'
      },
    },
    {
      path: "analysis",
      name: "analysis",
      // component: () => import("src/views/teacherModule/teacherCourseAnalysis/analysis.vue"),
      meta: {
        title: "分析",
        authCode: 'analysis'
      },
    },
    {
      path: "teachingSchedule",
      // component: () => import("src/views/teacherModule/teachCourse/courseSchedule/teachingScheduleList.vue"),
      meta: {
        title: "排课管理",
        authCode: 'teachingSchedule'
      }, 
    }, 
    {
      path: 'scheduleCreate',
      name: 'scheduleCreate',
      // component: () => import('src/views/teacherModule/teachCourse/courseSchedule/scheduleCreate.vue'),
      meta: {
        title: "创建排课",
        authCode: 'scheduleCreate'
      },
    },
    {
      path: 'scheduleEdit',
      name: 'scheduleEdit',
      // component: () => import('src/views/teacherModule/teachCourse/courseSchedule/scheduleCreate.vue'),
      meta: {
        title: "编辑排课",
        authCode: 'scheduleEdit'
      },
    },
    {
      path: 'envMonitoring',
      name: 'envMonitoring',
      // component: () => import('src/views/teacherModule/teachCourse/courseSchedule/EnvMonitoring.vue'),
      meta: {
        title: "环境监控",
        authCode: 'envMonitoring'
      },
    },
  ]
}