
import Layout from 'src/views/common/Layout.vue';
export default {
    path: "teacherDataExercises",
    component: Layout,
    meta: {
        title: "习题列表",
        authCode: 'exerciseList'
    },
    children: [
        {
            path: "",
            name: "teacherDataExercises",
            component: () => import("src/views/teacherDataExercises/index.vue"),
            meta: {
                title: "",
                authCode: 'exerciseList'
            },
        }, {
            path: 'exercisesDetail',
            name: 'exercisesDetail',
            component: () => import("src/views/teacherDataExercises/exercisesDetail/index.vue"),
            meta: {
                title: "习题目录详情",
                authCode: 'exerciseList'
            },
        }
    ]
}