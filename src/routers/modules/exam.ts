import Layout from "../../views/common/Layout.vue";

export default{
    path: "/exam",
    component: Layout,
    meta: {
        title: "实训",
        authCode: "vm",
    },
    children: [
        {
            path:"list",
            name:"list",
            component:()=>import("src/views/exam/examList/examList.vue"),
            meta:{
                title:"考试列表",
                authCode:""
            },
        },
        {
            path:"look",
            name:"look",
            component:()=>import("src/views/exam/transcript/transcript.vue"),
            meta:{
                title:"查看成绩",
                authCode:""
            },
        }
    ]
}