import Layout from 'src/views/common/Layout.vue';

export default {
    path: "Experimental",
    component: Layout,
    meta: {
        title: "实训",
        authCode: 'Experimental'
    },
    children: [
        {
            path: "",
            name: "creatExperimental",
            component: () => import("src/views/teacherExperimental/creatExperimental.vue"),
            meta: {
                title: "新建实训",
                authCode: 'creatExperimental'
            },
        }
    ]
}