import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
export default {
    path: "/dataSet",
    component: Layout,
    meta: {
        title: (params?: RouteParams, query?: RouteParams) => {
            // console.log(query) 
            const dataDetailMap = {
                '0': '公共数据',
                '1': '我的数据',
            }
            return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
          },
        authCode: 'dataSet'  
    },
    children: [
        {
            path: "",
            component: () => import("src/views/dataSet/index.vue"),
            meta: {
                title: "",
                authCode: 'dataSet'
            },
        },
        // {
        //     path: "CreateTestPaper",
        //     name: "CreateTestPaper",
        //     component: () => import("src/views/dataSet/CreateTestPaper.vue"),
        //     meta: {
        //         title: "新建数据集",
        //         authCode: 'CreateTestPaper'
        //     },
        // },
        // {
        //     path: 'Achievement',
        //     name: 'Achievement',
        //     component: () => import ("src/views/dataSet/Achievement.vue"),
        //     meta: {
        //         title: "数据集详情",
        //         authCode: 'Achievement'
        //     }
        // },
    ]
}