import Layout from 'src/views/common/Layout.vue';

export default {
    path: "train",
    component: Layout,
    meta: {
        title: "实训列表",
        authCode: 'train'
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherTrain/index.vue"),
            meta: {
                title: "实训列表",
                authCode: 'train'
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