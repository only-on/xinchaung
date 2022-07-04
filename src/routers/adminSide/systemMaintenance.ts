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
    redirect: '/admin/systemMaintenance/diskManagement',
    children: [
        {
            path: "diskManagement",
            name: "diskManagement",
            component: () => import("src/views/adminModule/systemMaintenance/diskManagement/index.vue"),
            meta: {
                title:`磁盘管理`,
                authCode: ''
            },
        },
        {
            path: "systemAuthorization",
            name: "systemAuthorization",
            component: () => import("src/views/adminModule/systemMaintenance/systemAuthorization/index.vue"),
            meta: {
                title:`系统授权`,
                authCode: ''
            },
        },
        {
            path: "personalization",
            name: "personalization",
            component: () => import("src/views/adminModule/systemMaintenance/personalization/index.vue"),
            meta: {
                title:`个性化设置`,
                authCode: ''
            },
        },
        {
            path: "userloginInformation",
            name: "userloginInformation",
            component: () => import("src/views/adminModule/systemMaintenance/userloginInformation/index.vue"),
            meta: {
                title:`用户登录信息`,
                authCode: ''
            },
        }
    ]
}
