import RouterViews  from "../../components/RouterView.vue";

export default{
    path: "/vm",
    component: RouterViews,
    meta: {
        title: "虚拟机",
        authCode: "vm",
    },
    children: [
        {
            path:"ace",
            name:"ace",
            component:()=>import("src/views/shareModule/VirtualMachine/Ace/Ace.vue"),
            meta:{
                title:"ace",
                authCode:""
            },
        },
        {
            path:"vnc",
            name:"vnc",
            component:()=>import("src/views/shareModule/VirtualMachine/Vnc/Vnc.vue"),
            meta:{
                title:"vnc",
                authCode:""
            },
        },
        {
            path:"notebook",
            name:"notebook",
            component:()=>import("src/views/shareModule/VirtualMachine/Notebook/notebook.vue"),
            meta:{
                title:"notebook",
                authCode:""
            },
        },
        {
            path:"vm",
            name:"vm",
            component:()=>import("src/views/shareModule/VirtualMachine/Vm/Vm.vue"),
            meta:{
                title:"vnc",
                authCode:""
            },
        },
        {
            path:"webmsg",
            name:"webmsg",
            component:()=>import("src/views/shareModule/VirtualMachine/webmsg.vue"),
            meta:{
                title:"webmsg",
                authCode:""
            },
        },
        {
            path:"documentOrVideo",
            name:"documentOrVideo",
            component:()=>import("src/views/shareModule/VirtualMachine/documentOrVideo/documentOrVideo.vue"),
            meta:{
                title:"documentOrVideo",
                authCode:""
            },
        }
    ]
}