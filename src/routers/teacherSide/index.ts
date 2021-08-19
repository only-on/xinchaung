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
    path: "/teacher",
    component: RouterView,
    meta: {
        title: "教师",
        authCode: 'teacher'
    },
    redirect: '/teacher/classical',
    children: configRoutes
};
export default teacherRoutes
