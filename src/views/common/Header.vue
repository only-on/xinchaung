<template>
  <header class="header-box">
    <div class="header-left">
      <div class="a-logo" @click="goHome()">
        <!-- <div
          class="logo"
          :style="`background-image: url(${
            env
              ? '/proxyPrefix' + systemBaseInfo.login_logo
              : systemBaseInfo.login_logo
          });`"
        ></div> -->
        <div
          class="logo"></div>
        <span class="web-title">Xinchuang</span>
      </div>
    </div>
    <div class="header-middle">
      <menu-bar :menus="menus"></menu-bar>
    </div>
    <div class="header-right">
      <a-popover title="" trigger="click" placement="bottom">
        <template #content>
          <template v-if="helpInfoList.length == 0">
            {{ assistText }}
          </template>
          <template v-else>
            <div class="help-question-warp setScrollbar">
              <div
                v-for="(item, index) in helpInfoList"
                class="help-item"
                @click="toHelp(item, index)"
                :key="item.id"
              >
                <div class="help-base-info">
                  <span>{{ item.user }}</span>
                  <span class="time">{{ item.created_at }}</span>
                </div>
                <p class="assist" :title="item.question">
                  {{ item.question }}
                </p>
              </div>
            </div>
          </template>
        </template>
        <div class="help-message" v-if="isOperation" @click="helpMessage">
          <span class="iconfont icon-jushou"></span>
          <span class="remoteAssistance">远程求助</span>
          <div class="red-point" v-if="helpInfoList.length > 0">
            <span class="dot"> </span>
            <span class="pulse"> </span>
          </div>
        </div>
      </a-popover>
      <a-popover title="" trigger="hover" placement="bottom">
        <template #content>
          <p class="operation" v-if="!power" @click="information">个人信息</p>
          <p class="operation" v-if="power" @click="modifyPassword">修改密码</p>
          <p class="operation" @click="loginOut">退出登录</p>
        </template>
        <div class="user-name">
          <!-- <img :src="userImg" /> -->
          <div class="user-img" :style="`background-image: url(${userImg});`"></div>
          <span class="user-name">{{ userName }}</span>
        </div>
      </a-popover>
    </div>
  </header>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  Ref,
  ref,
  onMounted,
  watch,
  provide,
  WritableComputedRef,
  onUnmounted,
} from "vue";
import MenuBar from "src/components/MenuBar.vue";
import request from "../../api/index";
import { IBusinessResp } from "../../typings/fetch";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import { Modal, message } from "ant-design-vue";
import extStorage, {sStorage} from "src/utils/extStorage";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import handImg from "src/assets/images/reqi_icon.png";
import teacherUserImg from "src/assets/images/user/teacher.png";
import adminUserImg from "src/assets/images/user/admin.png";
import studentUserImg from "src/assets/images/user/student.png";
import { wsConnect } from "src/request/websocket";
import { useStore } from "vuex";
import { createExamples } from "src/utils/vncInspect";
import {clearAllCookies} from "../../utils/cookieHelper";
import i18nWebMsg from 'src/i18n/zh_CN/webmsg';
import {IWmc} from "../../typings/wmc";
import api from "../../api";
import { AnyMxRecord } from "dns";
export default defineComponent({
  name: "Header",
  components: { MenuBar },
  setup() {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const router = useRouter();
    const { lStorage,sStorage } = extStorage;
    const role = lStorage.get("role") || 3;
    const List = {
      1: "",
      2: adminUserImg,
      3: teacherUserImg,
      4: studentUserImg,
      5: "",
    };
    const userImg = lStorage.get("portrait") || List[Number(role)];
    const http = (request as any).common;
    const assistText: Ref<string> = ref("您暂时还未收到远程协助请求！");
    const homePath = computed(() => {
      let obj = {
        1: "/init-course/init", // 初始端
        2: "/admin", // 管理端
        3: "/teacher", // 教师端首页
        4: "/student", // 学生端首页
        5: "/teacher", // 助教端
      };
      return obj[role];
    });
    const isOperation = computed(() => {
      // 教师有远程协助消息提醒
      return role === 3;
    });
    const power = computed(() => {
      //  4  个人信息  3 1 2修改密码
      return role === 3 || role === 1 || role === 2;
    });
    const userName = ref<string>(lStorage.get("username"));

    function information() {
      router.push("/teacher/personalInformation");
    }
    function loginOut() {
      http.loginOut().then((res: IBusinessResp) => {
        lStorage.clean();
        clearAllCookies();
        if (longWs1.value) {
          longWs1.value.close();
        }
        router.replace({ path: "/login" }).catch(() => {});
      });
    }
    function helpMessage() {}
    function modifyPassword() {
      router.push("/teacher/personalInformation");
      // http.resetPassword({param:{}}).then((res:IBusinessResp)=>{
      //   console.log(res)
      // })
    }
    const route = useRoute();
    var menus: any[] = reactive([]);
    // 教师首页
    let teacherHome={
      icon: "icon-shouye1",
      id: 189,
      name: "首页",
      parent_id: 0,
      sort: 89,
      url: "/teacher/home",
      children: [],
    };
     //论坛
    let forum={
      children: [],
      icon: "icon-jiaoliu1",
      id: 169,
      // name: "论坛",
      name:['','交流问答','学习问答','学习交流',''][role-1],
      parent_id: 0,
      sort: 9,
      url: "/teacher/teacherForum",
    }
    // 实验中心
    let center = {
      icon: "icon-shiyan2",
      id: 170,
      name: "实验中心",
      parent_id: 0,
      sort: 3,
      url: "",
      children: [
        {
          children: [],
          icon: "",
          id: 1148,
          name: "实验资源库",
          parent_id: 161,
          sort: 1,
          url: "/teacher/teacherExperimentResourcePool",
        },
        {
          children: [],
          icon: "",
          id: 1149,
          name: "镜像资源库",
          parent_id: 161,
          sort: 2,
          url: "/teacher/teacherImageResourcePool",
        },
      ],
    };
    // 素材资源
    let material = {
      icon:'icon-sucai1',
      id: 170,
      name: "素材资源",
      parent_id: 0,
      sort: 3,
      url: "/teacher/teacherMaterialResource",
      children: [],
    };
    // 教师课程
    let teacherCourse={
      icon: "icon-jiaoxue",
      id: 180,
      name: "教学过程",
      parent_id: 0,
      sort: 3,
      url: "",
      children:[
        {
          children: [],
          icon: "",
          id: 1148,
          name: "我的教学",
          parent_id: 161,
          sort: 1,
          url: "/teacher/teacherCourse?currentTab=0",
        },
        {
          children: [],
          icon: "",
          id: 1148,
          name: "公开课程",
          parent_id: 161,
          sort: 1,
          url: "/teacher/teacherCourse?currentTab=1",
        },
        {
          children: [],
          icon: "",
          id: 1148,
          name: "课程安排",
          parent_id: 161,
          sort: 1,
          url: "/teacher/coursePlan",
        },
        {
          children: [],
          icon: "",
          id: 1148,
          name: "教学质量",
          parent_id: 161,
          sort: 1,
          url: "/teacher/teachingQuality",
        }
      ]
    }
    // 管理端首页
    let adminHome={
      icon: "icon-shouye1",
      id: 119,
      name: "首页",
      parent_id: 0,
      sort: 89,
      url: "/admin/home",
      children: [],
    }
    //管理端 教学资源管理
    let TeachingResourceManagement={
      icon: "icon-jiaoxue",
      id: 175,
      name: "教学资源管理",
      parent_id: 0,
      sort: 5,
      url: "",
      children: [
        {
          children: [],
          icon: "",
          id: 1148,
          name: "方向规划",
          parent_id: 162,
          sort: 1,
          url: "/admin/TeachingResourceManagement/DirectionPlanning",
        },
        {
          children: [],
          icon: "",
          id: 1148,
          name: "课程管理",
          parent_id: 162,
          sort: 1,
          url: "/admin/TeachingResourceManagement/courseManagement",
        },
        {
          children: [],
          icon: "",
          id: 1148,
          name: "实验管理",
          parent_id: 162,
          sort: 1,
          url: "/admin/TeachingResourceManagement/experimentManagement",
        },
        {
          children: [],
          icon: "",
          id: 1148,
          name: "素材资源管理",
          parent_id: 162,
          sort: 1,
          url: "/admin/TeachingResourceManagement/resourcesManagement",
        },
        {
          children: [],
          icon: "",
          id: 1148,
          name: "镜像管理",
          parent_id: 162,
          sort: 1,
          url: "/admin/TeachingResourceManagement/mirrorImageManagement",
        },
      ],
    }
    // 管理端系统维护
    let systemMaintenance={
      icon: "icon-weihu",
      id: 135,
      name: "系统维护",
      parent_id: 0,
      sort: 5,
      url: "",
      children:[
        {
          children: [],
          icon: "",
          id: 1135,
          name: "磁盘管理",
          parent_id: 131,
          sort: 1,
          url: "/admin/systemMaintenance/diskManagement",
        },
        {
          children: [],
          icon: "",
          id: 1136,
          name: "系统授权",
          parent_id: 132,
          sort: 1,
          url: "/admin/systemMaintenance/systemAuthorization",
        },
        {
          children: [],
          icon: "",
          id: 1137,
          name: "个性化设置",
          parent_id: 133,
          sort: 1,
          url: "/admin/systemMaintenance/personalization",
        },
        {
          children: [],
          icon: "",
          id: 1138,
          name: "用户登录信息",
          parent_id: 162,
          sort: 1,
          url: "/admin/systemMaintenance/userloginInformation",
        },
      ]
    }
    //管理端用户管理
    let adminUserManagement={
      icon: "icon-yonghuguanli",
      id: 135,
      name: "用户管理",
      parent_id: 0,
      sort: 5,
      url: "",
      children:[
        {
          children: [],
          icon: "",
          id: 1135,
          name: "教师管理",
          parent_id: 131,
          sort: 1,
          url: "/admin/adminUserManagement/teacherManagement",
        },
        {
          children: [],
          icon: "",
          id: 1135,
          name: "学生管理",
          parent_id: 131,
          sort: 1,
          url: "/admin/adminUserManagement/studentManagement",
        },
      ]
    }
    //管理管资源预约-排课
    let coursePlan={
      icon: "icon-zuoyekaoshi1",
      id: 135,
      name: "资源预约",
      parent_id: 0,
      sort: 5,
      url: "/teacher/coursePlan",
      children: [],
    }
    //  学生课程
    let studentCourse={
      icon: "icon-jiaoxue",
      id: 188,
      name: "学生课程",
      parent_id: 0,
      sort: 88,
      url: "/student/studentCourse",
      children: [],
    }
    // 学生首页
    let statistics={
      icon: "icon-shouye1",
      id: 189,
      name: "首页",
      parent_id: 0,
      sort: 89,
      url: "/student/statistics",
      children: [],
    }
    let arr:any={
      1:[],
      2:[adminHome,systemMaintenance,TeachingResourceManagement,adminUserManagement,coursePlan,forum],
      3:[teacherHome,center,material,teacherCourse,forum],
      4:[statistics,forum,studentCourse]
    }[role]
    menus.push(...arr)
    lStorage.set("menuActiveName", '首页');
    var systemBaseInfo: any = reactive({
      login_logo: "",
    });
    var activeName: Ref<string> = ref(lStorage.get("menuActiveName") || "");
    function goHome() {
      console.log("回首页");
      // router.push(`${homePath}`);
      if (role == 3) {
        // return "/teacher" // 教师端首页
        router.push("/teacher");
      }
      if (role == 4) {
        router.push("/student");
      }
      if (role == 1) {
        // return "/init-course/init" // 初始端
        // router.push("/teacher");
      }
      if (role == 2) {
        // return "/admin" // 管理端
        router.push("/admin");
      }
      if (role == 5) {
        // return "" // 助教端
        // router.push("/");
      }
    }
    window.XC_ROLE=2

    let longWs: any = null
    const store = useStore()
    let longWs1: WritableComputedRef<IWmc> = computed({
      get: () => {
        return store.state.longWs
      },
      set: val => {
        store.commit("setLongWs",val)
      }
    })
    function setWs () {
      // 检查有无配置缓存，若无，则进行缓存
      let wsConfig = lStorage.get("ws_config");
      if (longWs1.value) {
        longWs1.value.close();
        longWs1.value = null as any
      }
      if (!wsConfig) {
        api.common.getFileConfig().then((res: IBusinessResp | null) => {
          console.log('[App] getFileConfig: ', res);
          wsConfig = JSON.stringify({"host":res?.data.webmsg_ip,"port":res?.data.webmsg_port});
          lStorage.set('ws_config', wsConfig);
          sStorage.set('ws_config', wsConfig);
          for (let key in res?.data) {
            lStorage.set(key, res?.data[key]);
          }
          initWs(JSON.parse(wsConfig))
        }).catch((error: any) => {})
      } else {
        initWs(wsConfig)
      }
    }
    onMounted(async () => {
      if ((role === 3 || role === 4)&&!longWs1.value) {
        try {
          // await initWs()
        } catch (e: any) {
          message.warn(i18nWebMsg[e.toString()] || e.toString());
        }
        // lStorage.set("longWs", longWs)
      }
      if (role === 3) {
        getHelpFinfo()
        setWs()
      }
    });
    const helpInfoList: Ref<any> = ref([])
    const isRead: Ref<boolean> = ref(false)
    provide('helpInfoList', helpInfoList)
    provide('isRead', isRead)

    function initWs(ws_config: any) {
      // let ws_config = lStorage.get("ws_config")
      let user_id = lStorage.get("user_id");
      const uid = lStorage.get("uid")
      // console.log(user_id,longWs)
      // console.log(ws_config)
      longWs1.value = wsConnect({
        url:
          "://" +
          ws_config.host +
          ":" +
          ws_config.port +
          "/?uid=" +
          uid+'_0',
        open: () => {
          if (longWs1.value && role === 3) {
            longWs1.value.join(uid+"_teacher" + "_room");
          }
        },
        close: (ev: CloseEvent) => {
          if (ev.type === "close") {
            console.log('[Header] longWs1: ', longWs1);
            if (longWs1.value && longWs1.value.isReset()) {
              message.warn(i18nWebMsg["The user id has been registered by another client."] || "The user id has been registered by another client.");
            }
          }
        },
        message: (ev: MessageEvent) => {
          let regex = /\{.*?\}/g;

          if (typeof ev.data === "string" && regex.test(ev.data)) {
            let data = JSON.parse(ev.data);
            console.log(data)
            if (data.type === "help") {
              helpInfoList.value.unshift(data.data)
              isRead.value = true
              console.log(helpInfoList.value)
            } else if(data.type==="base_vminfo"&&data.data.vms && data.data.vms.length > 0) {
              setTimeout(() => {
                store.commit('setIsWsConnect', true)
                store.commit('setConnectStatus', 2)
              }, 1000)
            } else if(data.type === 'error') {
              if (data.data?.message) {
                message.warn(data.data.message);
                store.commit('setIsConnectFail', false)
                store.commit('setConnectStatus', 0)
              } else {
                message.warn(data.data);
                store.commit('setIsWsConnect', false)
                store.commit('setConnectStatus', 0)
              }
            }
          }
        }
      })
    }

    const vmApi = request.vmApi
    function getHelpFinfo() {
      helpInfoList.value.length -= 0
      vmApi.getHelpFinfoApi({}).then((res: any) => {
        if (!res) return
        console.log(res);
        helpInfoList.value.push(...res.data.list)
        if (helpInfoList.value.length>0) {
          isRead.value=true
        }
      })
    }

    function toHelp(val: any, index: any) {
      let params: any = {
        opType: "help",
        study_id: val.study_id,
      };
      vmApi.updateReadStatusApi({
        param: {
          action: "read",
          params: {
            id: val.id,
          },
        },
      })
      .then(() => {
        helpInfoList.value.splice(index, 1);
      });
      vmApi.createExamples({ param: params }).then((res: any) => {
        if (res.status === 1) {
          router.push({
            // path: "/vm/vnc",
            path: "/vm",
            query: {
              connection_id: res.data.connection_id,
              opType: "help",
              type: val.study_type,
              taskId: val.taskId,
              topoinst_uuid: res.data.topoinst_uuid,
              topoinst_id: res.data.topoinst_id,
              experType: 1
            },
          });
        }
      })
    }
    onBeforeRouteLeave(()=>{
      // longWs?.close()
      // console.log('+++++++++++++++')
    })
    function closeWs () {
      if (longWs1.value) {
        longWs1.value.refresh();
        longWs1.value.close();
        longWs1.value = null as any
      }
    }
    // 监测学生端课程详情连接ws,其他页面断开ws
    watch(() => router.currentRoute.value.path, newVal => {
      if (role === 4) {
        closeWs()
        if (newVal === '/student/studentCourse/Detail') {
          setWs()
        }
      }
    },{immediate: true})
    onUnmounted(() => {
      closeWs()
    })
    return {
      env,
      systemBaseInfo,
      isOperation,
      power,
      userName,
      loginOut,
      information,
      helpMessage,
      modifyPassword,
      assistText,
      menus,
      activeName,
      handImg,
      userImg,
      homePath,
      goHome,
      helpInfoList,
      toHelp,
    };
  },
});
</script>

<style lang="less" scoped>
.header-box {
  height: 55px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: var(--center-width);
  margin: 0 auto;
  // box-shadow: 0 0 5px #c2aad6;
  > .header-left {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 100px;
    .a-logo {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .logo {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      // background: url("../../assets/images/user/favicon.png") no-repeat center;
      background: url("src/assets/images/user/logo.png") no-repeat center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
    }
    .web-title {
      color: var(--primary-color);
      font-size: 22px;
    }
  }
  > .header-middle {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    > ul {
      display: flex;
      > a,
      > li {
        margin-left: 45px;
      }
    }
  }
  > .header-right {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    .help-message {
      color: var(--white-75);
      margin-right: 53px;
      position: relative;
      img {
        -webkit-filter: brightness(30%); /* Chrome, Safari, Opera */
        filter: brightness(0.3);
        margin-right: 7px;
      }
      .iconfont {
        color: var(--white-75);
        margin-right: 5px;
        font-size: 18px;
        vertical-align: middle;
      }
      .remoteAssistance {
        font-size: 14px;
      }
      .red-point {
        background: red;
        width: 8px;
        height: 8px;
        display: block;
        border-radius: 50%;
        position: absolute;
        right: -10px;
        top: 5px;
      }
      .dot {
        position: absolute;
        width: 8px;
        height: 8px;

        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border: 2px solid red;
        border-radius: 50%;
        z-index: 2;
      }
    }
    .user-name {
      display: flex;
      align-items: center;
      .user-img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: url("src/assets/images/user/teacher_p.png") no-repeat ;
        background-size: 100% 100%;
      }
      //  > img {
      //    width: 35px;
      //    height: 35px;
      //    border-radius: 50%;
      //    border: 1px solid var(--white-100);
      //  }
      .user-name {
        padding: 0 6px;
        color: var(--white);
      }
    }
  }
}
.ant-popover-inner-content {
  .operation {
    min-width: 80px;
    margin-bottom: 0;
    padding: 0.5em;
  }
  .operation:hover {
    cursor: pointer;
    color: var(--primary-color);
  }
}
.help-question-warp {
  width: 255px;
  max-height: 292px;
  overflow: auto;
  padding: 0 8px;
  .help-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-bottom: 1px dashed var(--black-15);
    padding-top: 10px;
    padding-bottom: 10px;
    &:last-child {
      border-bottom: none;
    }
  }
  .help-item:hover {
    .assist {
      color: var(--primary-color);
    }
  }
  .help-base-info {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    color: var(--black-45);
    font-size: var(--font-size-sm);
    .time {
      color: var(--black-25);
    }
  }
  p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    cursor: pointer;
    width: 100%;
    color: var(--black-65);
    margin-bottom: 0;
  }
}
</style>
