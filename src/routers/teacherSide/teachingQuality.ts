
import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "teachingQuality",
    component: Layout,
    name: 'teachingQuality',
    children: [
        {
            path: "",
            name: "",
            component: () => import("src/views/teacherModule/teachingQuality/index.vue"),
            meta: {
                title: "教学质量",
                authCode: '教学质量'
            },
        },
    ]
}