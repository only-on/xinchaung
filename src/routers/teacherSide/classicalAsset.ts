import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
import RouterViews from "src/components/RouterView.vue";

export default {
    path: "classical",
    name: "classical",
    component: Layout,
    meta: {
        title: "数据",
        authCode: 'classical',
        showInBreadcrumb: false
    },
    redirect: '/teacher/classical/list/3',
    children: [
        {
            path: "list/:type",
            name: 'classicalAsset',
            component: RouterViews,
            meta: {
                title: (params?: RouteParams, query?: LocationQuery) => {
                    // 是资源列表，需要根据type param来决定如何设置面包屑
                    const dataMap = {
                        3: '课件',
                        4: '视频',
                        5: '备课资料',
                        6: '教学指导'
                    }
                    const type = (params && params.type) || 3
                    return dataMap[type.toString()] || '未知'
                },
                authCode: 'classicalAsset',
            },
            children: [
                {
                    path: '',
                    name: 'classicalAsset1',
                    component: () => import("src/views/classicalAsset/Panel.vue"),
                    meta: {
                        authCode: 'classicalAsset1',
                    }
                },
                {
                    path: "content/:id",
                    name: "classicalAssetContent",
                    component: () => import("src/views/classicalAsset/Content.vue"),
                    meta: {
                        title: (params?: RouteParams, query?: LocationQuery) => {
                            const dataDetailMap = {
                                3: '课件详情',
                                4: '视频详情',
                                5: '备课资料详情',
                                6: '教学指导详情'
                            }
                            return dataDetailMap[params!.type.toString()] || '未知'
                        },
                        authCode: 'classicalAssetContent',
                    },
                },
            ]
        },

    ],
}
