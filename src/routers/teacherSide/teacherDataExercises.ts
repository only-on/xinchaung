
import Layout from 'src/views/common/Layout.vue';
export default {
    path: "teacherDataExercises",
    component: Layout,
    name:'exerciseList',
    meta: {
        title: "习题列表",
        authCode: 'teacherDataExercises'
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherModule/teacherDataExercises/index.vue"),
            meta: {
                title: "",
                authCode: 'exerciseList'
            },
        }, {
            path: '/exercisesDetail',
            name: 'exercisesDetail',
            component: () => import("src/views/teacherModule/teacherDataExercises/exercisesDetail/index.vue"),
            meta: {
                title: "习题目录详情",
                authCode: 'exerciseList'
            },
        }
    ]
}
// exercisesDetail