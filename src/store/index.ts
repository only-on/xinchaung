import { createStore } from "vuex";
import CommonState from "./common/common"
import extStorage from "../utils/extStorage";
const { sStorage } = extStorage;
// 登录数据恢复和保存
const restore = (key:any) => sStorage.get(key);
const backup = (key:any, val:any) => sStorage.set(key, val);
const clearStore = (keys:any) =>
  keys.forEach((key:any) => {
    sStorage.del(key);
  });
  console.log(sStorage.get('systemInfo'))
  const breadcrumb = sStorage.get("breadcrumb") || [];
  const store:any = createStore({
  // state() {
  //   return {
  //     adminInfo: restore("adminInfo") || {},
  //   };
  // },
  state:{
     adminInfo: restore("adminInfo") || {},
     Menus:[],
     breadcrumb,
     aaa:'798',
     isWsConnect: false,
     connectStatus: 0,   // 0失败 1 连接中 2 成功
     longWs: null,
     systemInfo: sStorage.get('systemInfo') ? sStorage.get('systemInfo') : {
      logo_url: "",
      site_name: "Xinchuang",
      theme: "A",
      login: "A"
    }
  },
  getters: {
    isLogged() {
      return store.state.adminInfo.token;
    },
  },
  mutations: {
    // 保存登录后管理员信息
    saveAdminInfo(state, adminInfo) {
      state.adminInfo = adminInfo;
      backup("adminInfo", adminInfo);
    },
    // 退出登录
    logout(state) {
      state.adminInfo = {};
      clearStore(["adminInfo"]);
    },
    saveBreadcrumb(state, breadcrumb){
      state.breadcrumb = breadcrumb;
      sStorage.set("breadcrumb", breadcrumb);
    },
    saveMenus(state, Menus){
      state.Menus = Menus;
    },
    setIsWsConnect(state, val) {
      state.isWsConnect = val
    },
    setConnectStatus(state, val) {
      state.connectStatus = val
    },
    setLongWs(state, val) {
      state.longWs = val
    },
    setSystemInfo (state, val) {
      sStorage.set('systemInfo', val)
      state.systemInfo = val
    }
  },
  actions: {
    
  },
  modules:{
    CommonState
  }
});

export default store;