import RouterViews  from "../../components/RouterView.vue";

export default{
    path: "/vm",
    component: RouterViews,
    meta: {
        title: "实训",
        authCode: "vm",
    },
    children: [
        {
            path:"ace",
            name:"ace",
            component:()=>import("src/views/VirtualMachine/Ace/Ace.vue"),
            meta:{
                title:"ace",
                authCode:""
            },
        },
        {
            path:"vnc",
            name:"vnc",
            component:()=>import("src/views/VirtualMachine/Vnc/Vnc.vue"),
            meta:{
                title:"vnc",
                authCode:""
            },
        }
    ]
}