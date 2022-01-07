<template>
  <header class="header-box">
    <div class="header-left">
      <router-link class="a-logo" :to="{path:homePath}">
        <div class="logo" :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`"></div>
        <span class="web-title">SimpleAHP  人工智能应用实践平台</span>
      </router-link>
    </div>
    <div class="header-middle">
      <menu-bar :menus="menus"></menu-bar>
    </div>
    <div class="header-right">
      <a-popover title="" trigger="click" placement="bottom">
        <template #content>
          <p class="assist">{{ assistText }}</p>
        </template>
        <div class="help-message" v-if="isOperation" @click="helpMessage">
          <img :src="handImg" />
          <span class="remoteAssistance">远程协助消息</span>
        </div>
      </a-popover>
      <a-popover title="" trigger="hover" placement="bottom">
        <template #content>
          <p class="operation" v-if="!power" @click="information">个人信息</p>
          <p class="operation" v-if="power" @click="modifyPassword">修改密码</p>
          <p class="operation" @click="loginOut">退出登录</p>
        </template>
        <div class="user-name">
          <!-- <div class="user-img"></div> -->
          <img :src="userImg" />
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
} from "vue";
import MenuBar from "src/components/MenuBar.vue";
import request from "../../api/index";
import { IBusinessResp } from "../../typings/fetch";
import { FakeMenu, MenuItem } from "src/api/modules/common";
import { Modal, message } from "ant-design-vue";
import extStorage from "src/utils/extStorage";
import { useRouter, useRoute } from "vue-router";
import handImg from "src/assets/images/reqi_icon.png";
import teacherUserImg from "src/assets/images/user/teacher_p.png";
import adminUserImg from "src/assets/images/user/admin_p.png";
import studentUserImg from "src/assets/images/user/student_p.png";
import {getSettingSiteApi} from 'src/views/adminSystemSetting/api'
// admin_p
export default defineComponent({
  name: "Header",
  components: { MenuBar },
  setup() {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const router = useRouter();
    const { lStorage } = extStorage;
    const role = lStorage.get("role");
    const List={1:'',2:adminUserImg,3:teacherUserImg,4:studentUserImg,5:''}
    const userImg=List[Number(role)]
    const http = (request as any).common;
    const assistText: Ref<string> = ref("您暂时还未收到远程协助请求！");
    const homePath=computed(()=>{
      if (role==3) {
        return "/teacher" // 教师端首页
      }
      if (role==4) {
        return "/studentStatistic" // 学生端首页
      }
      if (role==1) {
        return "/init-course/init" // 初始端
      }
      if (role==2) {
        return "/admin" // 管理端
      }
      if (role==5) {
        return "" // 助教端
      }
    })
    const isOperation = computed(() => {
      // 教师有远程协助消息提醒
      return role === 3;
    });
    const power = computed(() => {
      //  4  个人信息  3 1 2修改密码
      return role === 3 || role === 1 || role === 2;
    });
    const userName = ref<string>("");
    // var userName=computed(()=>{
    //   return lStorage.get('name')
    // })
    // watch(name,(val:any)=>{
    //   console.log(val)
    //   userName.value=val
    // })
    function information() {
      router.push("/personalInformation");
    }
    function loginOut() {
      http.loginOut().then((res: IBusinessResp) => {
        // console.log(res)
        lStorage.clean();
        // message.success('')
        // window.location.href = 'http://192.168.101.150:85/site/login';
        let url = `${window.origin}/site/login`;
        console.log(url);
        window.location.href = url;
      });
    }
    function helpMessage() {}
    function modifyPassword() {
      router.push("/personalInformation");
      // http.resetPassword({param:{}}).then((res:IBusinessResp)=>{
      //   console.log(res)
      // })
    }
    const route = useRoute();
    var menus: MenuItem[] = reactive([]);
    var systemBaseInfo:any=reactive({
      login_logo:''
    });
    var activeName: Ref<string> = ref(lStorage.get("menuActiveName") || "");
    function getMenu() {
      http.getMenu().then((res: IBusinessResp) => {
        if (res) {
          menus.length = 0;
          let data = res.data.menus;
          activeName.value = lStorage.get("menuActiveName")
            ? lStorage.get("menuActiveName")
            : data && data.length && data[0].name;
          menus.push(...data);
          if (route.path === (data && data.length && data[0].url)) {
            activeName.value = data && data[0].name;
          }
          let user = res.data.user;
          lStorage.set("role", user.role);
          lStorage.set("name", user.name);
          lStorage.set("user_id", user.id);
          lStorage.set("ws_config", JSON.stringify(res.data.websocket_conf));
          // store.commit('saveMenus', data)
          const site_settings=res.data.site_settings
          systemBaseInfo.login_logo = site_settings.login_logo;
          lStorage.set("login_logo", site_settings.login_logo);


          userName.value = user.name;
        }
      });
    }
    onMounted(() => {
      getMenu();
    });

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
      homePath
    };
  },
});
</script>

<style lang="less" scoped>
.header-box {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  padding: 0 50px;
  background: #fff;
  min-width: 1330px;
  // box-shadow: 0 0 5px #c2aad6;
  > .header-left {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 100px;
    .a-logo{
      display: flex;
    }
    .logo {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      // background: url("../../assets/images/user/favicon.png") no-repeat center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
    }
    .web-title {
      color: var(--purpleblue-6);
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
      margin-right: 30px;
      img {
        -webkit-filter: brightness(30%); /* Chrome, Safari, Opera */
        filter: brightness(0.3);
        margin-right: 7px;
      }
      .remoteAssistance {
        font-size: 14px;
      }
    }
    .user-name {
      // display: flex;
      // align-items: center;
      .user-img {
        width: 28px;
        height: 28px;
        background: url("src/assets/images/user/teacher_p.png") no-repeat center;
        background-size: 100% 100%;
      }
      .user-name {
        padding: 0 6px;
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
    color: var(--purpleblue-6);
  }
}
.assist {
  color: #857878;
  margin: 5px;
}
</style>
