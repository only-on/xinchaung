import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
import RouterViews from "src/components/RouterView.vue";

export default {
    path: "adminTrain",
    name: "adminTrain",
    component: Layout,
    meta: {
        title: "管理端实训",
        authCode: 'adminTrain',
        showInBreadcrumb: false
    },
    children: [
        {
            path: "",
            name: "exerciseList",
            component: () => import("src/views/adminTrain/index.vue"),
            meta: {
                title: " ",
                authCode: 'exerciseList'
            },
        },
        // {
        //     path: '/exercisesDetail',
        //     name: 'exercisesDetail',
        //     component: () => import("src/views/teacherDataExercises/exercisesDetail/index.vue"),
        //     meta: {
        //         title: "习题目录详情",
        //         authCode: 'exerciseList'
        //     },
        // }
    ]
}
