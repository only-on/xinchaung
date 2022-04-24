export default {
  path: "statistics",
  component: () => import("src/views/studentModule/student/index.vue"),
  name:'studentStatistics',
  meta: {
    title:'学生端首页',
    authCode: 'studentStatistics'
  },
  children: []
}