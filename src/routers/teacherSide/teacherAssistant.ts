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
    ]
}
