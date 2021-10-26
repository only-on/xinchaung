import Layout from 'src/views/common/Layout.vue';

export default {
    path: "experiment",
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
        // {
        //     path: "creatExperiment",
        //     name: "creatExperiment",
        //     component: () => import("src/views/teacherExperiment/creatExperiment.vue"),
        //     meta: {
        //         title: "创建实训",
        //         authCode: 'creatExperiment'
        //     },
        // },
    ]
}