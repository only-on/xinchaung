import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
export default {
    path: "teacherTrain",
    component: Layout,
    meta: {
        // title: "实训列表",
        title: (params?: RouteParams, query?: RouteParams) => {
            // console.log(query)
            const dataDetailMap = {
                '0': '我的实训',
                '1': '内置实训',
                '2': '归档实训',
            }
            return dataDetailMap[query!.currentTab.toString()] || '我的实训'
          },
        authCode: 'teacherTrain'
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherTrain/index.vue"),
            meta: {
                title: "我的实训",
                authCode: 'teacherTrain'
            },
        },
        {
            path: "creatTrain",
            name: "creatTrain",
            component: () => import("src/views/teacherTrain/creatTrain.vue"),
            meta: {
                title: "创建实训",
                authCode: 'creatTrain'
            },
        },
        {
            path: 'resource',
            name: 'resource',
            component: () => import("src/views/teacherTrain/resource.vue"),
            meta: {
                title: "实训资源",
                authCode: 'resource'
            }
        },
        {
            path: 'evaluate',
            name: 'evaluate',
            component: () => import("src/views/teacherTrain/evaluate.vue"),
            meta: {
                title: "实训考核",
                authCode: 'evaluate'
            }
        },
        {
            path: 'detail',
            name: 'detail',
            component: () => import("src/views/teacherTrain/detail/index.vue"),
            meta: {
                title: "实训详情",
                authCode: 'detail'
            }
        }
    ]
}