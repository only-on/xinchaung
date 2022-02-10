import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
export default {
    path: "/dataSet",
    component: Layout,
    name:'dataSet',
    meta: {
        // title: (params?: RouteParams, query?: RouteParams) => {
        //     const dataDetailMap = {
        //         '0': '公共数据',
        //         '1': '我的数据',
        //     }
        //     return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
        // },
        title:'数据集管理',
        authCode: 'dataSet'  
    },
    children: [
        {
            path: "",
            component: () => import("src/views/shareModule/dataSet/index.vue"),
            meta: {
                title: "",
                authCode: 'dataSet'
            },
        },
        {
            path: "Create",
            name: "CreateDataSet",
            component: () => import("src/views/shareModule/dataSet/Create.vue"),
            meta: {
                title: "新建数据集",
                authCode: 'CreateDataSet'
            },
        },
        {
            path: 'DataSetDetail',
            name: 'DataSetDetail',
            component: () => import ("src/views/shareModule/dataSet/DataSetDetail.vue"),
            meta: {
                title: "数据集详情",
                authCode: 'DataSetDetail'
            }
        },
    ]
}