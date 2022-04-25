import Layout from 'src/views/common/Layout.vue';

export default {
    path: "systemMaintenance",
    name: "systemMaintenance",
    component: Layout,
    meta: {
        title: "系统维护",
        authCode: '',
        showInBreadcrumb:true,
    },
    children: [
        {
            path: "diskManagement",
            name: "",
            component: () => import("src/views/adminModule/systemMaintenance/diskManagement/index.vue"),
            meta: {
                title:`磁盘管理`,
                authCode: ''
            },
        }
    ]
}
