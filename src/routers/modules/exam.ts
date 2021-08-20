import Layout from "../../views/common/Layout.vue";
import RouterView from "/src/components/RouterView.vue"

export default{
    path: "/exam",
    component: RouterView,
    meta: {
        title: "考试",
        authCode: "vm",
    },
    children: [
        {
            path: "",
            component: Layout,
            meta: {
                title: "考试",
                authCode: "vm",
            },
            children:[
                {
                    path:"list",
                    name:"list",
                    component:()=>import("src/views/exam/examList/examList.vue"),
                    meta:{
                        title:"考试列表",
                        authCode:""
                    },
                },
                
            ]
        },
        {
            path:"examDoing",
            name:"examDoing",
            component:()=>import("src/views/exam/examDoing/examDoing.vue"),
            meta:{
                title:"正在考试",
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
        },
    ]
}