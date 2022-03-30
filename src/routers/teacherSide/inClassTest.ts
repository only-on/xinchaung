
import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "inClassTest",
    component: Layout,
    name: 'inClassTest',
    children: [
        {
            path: "",
            name: "",
            component: () => import("src/views/teacherModule/teachCourse/inClassTest/index.vue"),
            meta: {
                title: "",
                authCode: ''
            },
        },
    ]
}