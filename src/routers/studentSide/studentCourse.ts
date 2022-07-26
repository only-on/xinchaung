import Layout from "src/views/common/Layout.vue";

export default {
  path: "studentCourse",
  component: Layout,
  name: "studentCourse",
  meta: {
    title: "学生课程",
    authCode: "studentCourse",
  },
  children: [
    {
      path: "",
      name: "",
      component: () => import("src/views/studentModule/studentCourse/courseList/index.vue"),
      meta: {
        title: "学生课程",
        authCode: "studentCourse",
      },
    },
    {
      path: "Detail",
      name:'学生课程详情',
      component: () => import("src/views/studentModule/studentCourse/courseDetail/index.vue"),
      meta: {
        title: "详情",
        authCode: 'Detail'
      },
    },
    {
      path: "StuCourseExperimentDetail",
      name: "StuCourseExperimentDetail",
      component: () =>import("src/views/teacherModule/teacherExperimentResourcePool/experimentDetail.vue"),
      meta: {
        title: "推荐实验详情",
        icon: "",
      },
    },
  ],
};
