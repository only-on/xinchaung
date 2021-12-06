import { RouteRecordNormalized } from "vue-router";
import RouterView from 'src/components/RouterView.vue';

const files: any = import.meta.globEager("./*.ts")
let configRoutes: Array<RouteRecordNormalized> = []

for (const key in files) {
    if (key !== './index.ts') {
        configRoutes.push(files[key].default)
    }
}

const adminRoutes = {
    path: "/admin",
    name: 'admin',
    component: RouterView,
    meta: {
        title: "管理",
        authCode: 'admin',
        showInBreadcrumb: false
    },
    // redirect: '/admin/classical',
    children: configRoutes
};
export default adminRoutes
