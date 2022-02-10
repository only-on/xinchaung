import { RouteRecordNormalized } from "vue-router";
import RouterView from 'src/components/RouterView.vue';

const files: any = import.meta.globEager("./*.ts")
let configRoutes: Array<RouteRecordNormalized> = []

for (const key in files) {
    if (key !== './index.ts') {
        configRoutes.push(files[key].default)
    }
}

const teacherRoutes = {
    path: "/student",
    name: 'student',
    component: RouterView,
    meta: {
        title: "学生",
        authCode: 'student',
        showInBreadcrumb: false
    },
    redirect: '/studentStatistic',
    children: configRoutes
};
export default teacherRoutes
