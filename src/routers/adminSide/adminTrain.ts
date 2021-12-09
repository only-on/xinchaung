import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
import RouterViews from "src/components/RouterView.vue";

export default {
    path: "adminTrain",
    name: "adminTrain",
    component: Layout,
    meta: {
        title: "实训管理",
        authCode: 'adminTrain'
    },
    children: [
        {
            path: "",
            name: "",
            component: () => import("src/views/adminTrain/index.vue"),
            meta: {
                title: "教师实训信息管理",
                authCode: ''
            },
        },
        {
            path: "trainInfo",
            name: "trainInfo",
            component: () => import("src/views/adminTrain/adminTrainDetail/index.vue"),
            meta: {
                title: "实训详情",
                authCode: 'trainInfo'
            },
        },
        {
            path: "/trainResult",
            name: "trainResult",
            component: () => import("src/views/adminTrain/teacherTrainInfo/trainResult/index.vue"),
            meta: {
                title: "实训成果",
                authCode: 'trainResult'
            },
        },
    ]
}
