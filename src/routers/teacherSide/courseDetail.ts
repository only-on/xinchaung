import Layout from 'src/views/common/customLayout.vue';

export default {
  path: "course1",
  component: Layout,
  meta: {
    title: "课程",
    authCode: 'course'
  },
  children: [
    {
      path: "detail",
      component: () => import("src/views/teachCourse/courseDetail/index.vue"),
      meta: {
        title: "课程详情",
        authCode: 'courseDetail'
      },
    },
  ]
}