import Layout from 'src/views/common/Layout.vue';

export default {
    path: "Experimental",
    component: Layout,
    meta: {
        title: "实训列表",
        authCode: 'Experimental'  
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherExperimental/index.vue"),
            meta: {
                title: "实训列表",
                authCode: 'Experimental'
            },
        },
        {
            path: "creatExperimental",
            name: "creatExperimental",
            component: () => import("src/views/teacherExperimental/creatExperimental.vue"),
            meta: {
                title: "创建实训",
                authCode: 'creatExperimental'
            },
        },
    ]
}