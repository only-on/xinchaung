import Layout from 'src/views/common/Layout.vue';

export default {
    path: "assistantManager",
    component: Layout,
    meta: {
        title: "助教管理",
        authCode: 'assistant'
    },
    children: [
        {
            path: "",
            name: "assistant",
            component: () => import("src/views/teacherAssistant/assistant.vue"),
            meta: {
                title: "助教管理",
                authCode: 'assistant'
            },
        },
        {
            path: "update",
            name: "update",
            component: () => import("src/views/teacherAssistant/update.vue"),
            meta: {
                title: "编辑",
                authCode: 'update'
            },
        },
        {
            path: "view",
            name: "view",
            component: () => import("src/views/teacherAssistant/view.vue"),
            meta: {
                title: "查看",
                authCode: 'view'
            },
        },
    ]
}
