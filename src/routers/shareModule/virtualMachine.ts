import RouterViews from "../../components/RouterView.vue";

export default {
  path: "/vm",
  component: RouterViews,
  meta: {
    title: "虚拟机",
    authCode: "vm",
  },
  children: [
    {
      path: "",
      component: () => import("src/views/shareModule/VirtualMachine/index.vue"),
      meta: {
        title: "vm",
        authCode: "",
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
      path: "webmsg",
      name: "webmsg",
      component: () =>
        import("src/views/shareModule/VirtualMachine/webmsg.vue"),
      meta: {
        title: "webmsg",
        authCode: "",
      },
    },
  ],
};
