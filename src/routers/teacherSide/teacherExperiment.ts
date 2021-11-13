import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "teacherExperiment",
    component: Layout,
    meta: {
        // title: "实验管理",
        title: (params?: RouteParams, query?: RouteParams) => {
            // console.log(query)
            const dataDetailMap = {
                '0': `实验管理${'\xa0\xa0'}/${'\xa0\xa0'}我的实验`,
                '1': `实验管理${'\xa0\xa0'}/${'\xa0\xa0'}内置实验`, 
                '2': `实验管理${'\xa0\xa0'}/${'\xa0\xa0'}共享实验`,
            }
            return dataDetailMap[query!.currentTab && query!.currentTab.toString()] || '实验管理'
          },
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
                title: "我的实验",
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
        {
            path: "ExperimentDetail",
            name: "ExperimentDetail",
            component: () => import("src/views/teacherExperiment/ExperimentDetail.vue"),
            meta: {
                title: "实验详情",
                authCode: 'ExperimentDetail'
            },
        },
        {
            path: "TemplateList",
            name: "TemplateList",
            component: () => import("src/views/teacherExperiment/experimentTemplate/templateList.vue"),
            meta: {
                title: (params?: RouteParams, query?: RouteParams) => {
                    const dataDetailMap = {
                        '0': localStorage.role == 3 ? '我的模板' : '教师创建模板',
                        '1': localStorage.role == 3 ? '内置模板' : '系统内置模板',
                        '2': '共享模板'
                    }
                    return dataDetailMap[query!.currentTab.toString()] || '实验模板'
                },
                authCode: 'TemplateList'
            },
        },
    ]
}