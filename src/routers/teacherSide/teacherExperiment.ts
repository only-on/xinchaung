import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "teacherExperiment",
    component: Layout,
    meta: {
        title: "实验管理",
        authCode: 'experiment'
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherExperiment/experimentalList.vue"),
            meta: {
                title: "实验列表",
                authCode: 'experiment'
            },
        },
        {
            path: "creatExperiment",
            name: "creatExperiment",
            component: () => import("src/views/teacherExperiment/creatExperiment.vue"),
            meta: {
                title: "创建实验",
                authCode: 'creatExperiment'
            },
        },
        {
            path: "creatTypeExperiment",
            name: "creatTypeExperiment",
            component: () => import("src/views/teacherExperiment/create/creatTypeExperiment.vue"),
            meta: {
                // title: "创建实验",
                title: (params?: RouteParams, query?: RouteParams) => {
                    // console.log(query)
                    const dataDetailMap = {
                        'vnc': '创建桌面实验',
                        'note': '创建交互实验',
                    }
                    return dataDetailMap[query!.type.toString()] || '创建实验'
                },
                authCode: 'creatTypeExperiment'
            },
        },
        // ExperimentDetail
        {
            path: "ExperimentDetail",
            name: "ExperimentDetail",
            component: () => import("src/views/teacherExperiment/ExperimentDetail.vue"),
            meta: {
                title: "实验详情",
                authCode: 'ExperimentDetail'
            },
        },
    ]
}