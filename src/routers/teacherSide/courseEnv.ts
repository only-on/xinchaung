import Layout from 'src/views/common/Layout.vue';

export default {
  path: "course",
  component: Layout,
  meta: {
    title: "课程",
    authCode: 'course'
  },
  children: [
    {
      path:"courseList",
      name:"",
      component: () => import("src/views/teachCourse/courseList/index.vue"),
      meta: {
        title: "课程列表",
        authCode: 'courseList'
      },
    },
    {
      path: "virtualEnv",
      name: "virtualEnv",
      component: () => import("src/views/teachCourse/virtualEnv.vue"),
      meta: {
        title: "环境",
        authCode: 'virtualEnv'
      },
    },
    {
      path: "evalute",
      name: "evalute",
      component: () => import("src/views/teachCourse/evalute/evalute.vue"),
      meta: {
          title: "评价",
          authCode: 'evalute'
      },
    },
    {
      path: "createTestPaper",
      name: "createTestPaper",
      // component: () => import("src/views/teachCourse/createTestPaper/addMultipleModal.vue"),
      component: () => import("src/views/teachCourse/createTestPaper/create.vue"),
      meta: {
        title: "创建试卷",
        authCode: 'createTestPaper'
      },
    },
    {
      path: "/knowledgeMap",
      component: () => import("src/views/knowledgeMap/index.vue"),
      meta: {
        title: "知识图谱",
        authCode: 'knowledgeMap'
      },
    },
    {
      path: "testPaperList",
      component: () => import("src/views/teachCourse/testPaperList/testPaperList.vue"),
      meta: {
        title: "随堂测试",
        authCode: 'testPaperList'
      },
    },
    {
      path: "result",
      component: () => import("src/views/teachCourse/testPaperList/interationResult.vue"),
      meta: {
        title: "测试结果",
        authCode: 'result'
      },
    },
    {
      path: "create",
      component: () => import("src/views/teachCourse/createCourse/index.vue"),
      meta: {
        title: "创建",
        authCode: 'create'
      },
    },
    {
      path: "detail",
      component: () => import("src/views/teachCourse/courseDetail/index.vue"),
      meta: {
        title: "详情",
        authCode: 'detail'
      },
    },
  ]
}