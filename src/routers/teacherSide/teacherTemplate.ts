import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "teacherTemplate",
    component: Layout,
    meta: {
      title: (params?: RouteParams, query?: RouteParams) => {
        const dataDetailMap = {
            '0': `实验管理${'\xa0\xa0'}/${'\xa0\xa0'}${localStorage.role == 3 ? '我的模板' : '教师创建模板'}`,
            '1': `实验管理${'\xa0\xa0'}/${'\xa0\xa0'}${localStorage.role == 3 ? '内置模板' : '系统内置模板'}`, 
            '2': `实验管理${'\xa0\xa0'}/${'\xa0\xa0'}共享模板`,
        }
        return dataDetailMap[query!.currentTab && query!.currentTab.toString()] || '实验管理'
      },
        authCode: 'template'
    },
    children: [
        {
            path: "",
            name: "TemplateList",
            component: () => import("src/views/teacherTemplate/templateList.vue"),
            meta: {
                title:"实验模板",
                authCode: 'TemplateList'
            },
        },
        {
            path: "createTemplate",
            name: "createTemplate",
            component: () => import("src/views/teacherTemplate/createTemplate.vue"),
            meta: {
                title:"创建实验模板",
                authCode: 'createTemplate'
            },
        },
    ]
}