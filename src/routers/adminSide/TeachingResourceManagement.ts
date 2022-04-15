import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
import RouterViews from "src/components/RouterView.vue";

export default {
    path: "TeachingResourceManagement",
    name: "TeachingResourceManagement",
    component: Layout,
    meta: {
        title: "教学资源管理",
        authCode: 'TeachingResourceManagement'
    },
    children: [
        {
            path: "DirectionPlanning",
            name: "",
            component: () => import("src/views/adminModule/TeachingResourceManagement/DirectionPlanning/index.vue"),
            meta: {
                title: "方向规划",
                authCode: ''
            },
        },
        {
            path: "courseManagement",
            name: "",
            component: () => import("src/views/adminModule/TeachingResourceManagement/courseManagement/courseManagement.vue"),
            meta: {
                title: "课程管理",
                authCode: ''
            },
        },
        {
            path: "experimentManagement",
            name: "",
            component: () => import("src/views/adminModule/TeachingResourceManagement/experimentManagement/experimentManagement.vue"),
            meta: {
                title: "实验管理",
                authCode: ''
            },
        },
        {
            path: "resourcesManagement",
            name: "",
            component: () => import("src/views/adminModule/TeachingResourceManagement/resourcesManagement/resourcesManagement.vue"),
            meta: {
                title: "素材资源管理",
                authCode: ''
            },
        },
        {
            path: "mirrorImageManagement",
            name: "",
            component: () => import("src/views/adminModule/TeachingResourceManagement/mirrorImageManagement/mirrorImageManagement.vue"),
            meta: {
                title: "镜像管理",
                authCode: ''
            },
        },
    ]
}
