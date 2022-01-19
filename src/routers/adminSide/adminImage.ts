import Layout from 'src/views/common/Layout.vue';
export default {
    path: "adminImage",
    name: "adminImage",
    component: Layout,
    meta: {
        title: "镜像管理",
        authCode: 'adminImage'
    },
    children: [
        {
            path: "",
            name: "",
            component: () => import("src/views/adminImage/index.vue"),
            meta: {
                title: "",
                authCode: ''
            },
        }
    ]
}
