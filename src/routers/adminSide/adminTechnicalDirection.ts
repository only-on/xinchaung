import Layout from 'src/views/common/Layout.vue';
export default {
    path: "technicalDirection",
    name: "technicalDirection",
    component: Layout,
    meta: {
        title: "技术方向管理",
        authCode: 'technicalDirection'
    },
    children: [
        {
            path: "",
            name: "",
            component: () => import("src/views/adminTechnicalDirection/index.vue"),
            meta: {
                title: "",
                authCode: ''
            },
        },
        {
            path: "detailsOfExperDir",
            name: "detailsOfExperDir",
            component: () => import("src/views/adminTechnicalDirection/detailsOfExperDir.vue"),
            meta: {
                title: "项目管理",
                authCode: 'detailsOfExperDir'
            },
        }
    ]
}
