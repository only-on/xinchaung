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
    redirect: '/admin/TeachingResourceManagement/DirectionPlanning',
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
            name: "courseManagement",
            component: RouterViews,
            meta: {
                title: "课程管理",
                authCode: 'courseManagement'
            },
            children: [
                {
                    path: '',
                    name: 'courseManagement',
                    component: () => import("src/views/adminModule/TeachingResourceManagement/courseManagement/courseManagement.vue"),
                    meta: {
                        authCode: 'courseManagement'
                    },
                },
                {
                    path: "courseManagementDetail",
                    name: "courseManagementDetail",
                    component: () => import("src/views/teacherModule/teachCourse/courseDetail/index.vue"),
                    meta: {
                        title: "课程详情",
                        authCode: 'courseManagementDetail'
                    },
                },
            ]
        },
        {
            path: "experimentManagement",
            name: "experimentManagement",
            component: RouterViews,
            meta: {
                title: "实验管理",
                authCode: 'experimentManagement'
            },
            children: [
                {
                    path: '',
                    name: 'experimentManagement',
                    component: () => import("src/views/adminModule/TeachingResourceManagement/experimentManagement/experimentManagement.vue"),
                    meta: {
                        authCode: 'experimentManagement'
                    },
                },
                {
                    path: "experimentDetail",
                    name: "",
                    component: () => import("src/views/teacherModule/teacherExperimentResourcePool/experimentDetail.vue"),
                    meta: {
                        title: "实验详情",
                        authCode: ''
                    },
                },
            ]
        },
        {
            path: "resourcesManagement",
            name: "resourcesManagement",
            component: RouterViews,
            meta: {
                title: "素材资源管理",
                authCode: 'resourcesManagement'
            },
            children: [
                {
                    path: '',
                    name: 'resourcesManagement',
                    component: () => import("src/views/adminModule/TeachingResourceManagement/resourcesManagement/resourcesManagement.vue"),
                    meta: {
                        authCode: 'resourcesManagement'
                    },
                },
                {
                    path: "setDataDetail",
                    name: "",
                    component: () => import("src/views/teacherModule/teacherMaterialResource/setDataDetail.vue"),
                    meta: {
                        title: "素材资源详情",
                        authCode: ''
                    },
                },
                {
                    path: "resourcesDetail",
                    name: "",
                    component: () => import("src/views/teacherModule/teacherMaterialResource/Detail.vue"),
                    meta: {
                        title: "素材资源详情",
                        authCode: ''
                    },
                },
            ]
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
