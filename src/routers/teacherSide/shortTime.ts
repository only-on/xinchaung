import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "shortTime",
    component: Layout,
    name:'shortTime',
    children: [
        {
          path:"",
          name:"",
          component: () => import("src/views/teacherModule/teachCourse/courseDetail/components/correct.vue"),
          meta: {
            title: "评阅",
            authCode: 'correct'
          },
        },
    ]
}