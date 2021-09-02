<template>
  <layout :VmData="data">
    <template v-slot:header>
      <div class="vm-header-student" v-if="!roleType">
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
          <a-button type="primary">操作</a-button>
        </div>

        <div class="vm-header-title">实验名称</div>
        <div class="vm-header-right">
          <span class="vm-time">
            <span class="icon-shijian1 iconfont"></span>
            <span>实验剩余时间: 05时07分43秒</span>
          </span>
          <a-button class="delayed-btn">延时</a-button>
          <span class="vm-action-box">
            <a-button type="primary">保存进度</a-button>
            <a-button type="danger">结束实验</a-button>
          </span>
        </div>
      </div>
      <div
        v-else
        class="vm-header-teacher"
        v-layout-bg="'../assets/common/layout_bg.jpg'"
      >
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
          <a-button type="primary">操作</a-button>
        </div>

        <div class="vm-header-title">实验名称</div>
        <div class="vm-header-right">
          <span class="vm-action-box">
            <a-button type="danger">结束备课</a-button>
          </span>
        </div>
      </div>
    </template>
    <template v-slot:right>
      <div v-if="!uuidLoading">websocket链接中</div>
      <div v-else-if="!vncLoadingV" class="vncloading">Loading...</div>
      <vue-no-vnc
        background="rgb(40,40,40)"
        :options="reactiveData.options"
        refName="refName"
      />
    </template>
  </layout>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  Ref,
  provide,
  watch,
  onMounted,
  toRefs,
} from "vue";
import layout from "../VmLayout/VmLayout.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import { wsConnect } from "src/request/websocket";
import { message } from "ant-design-vue";
import { getVmConnectSetting } from "src/utils/seeting";
export default defineComponent({
  components: {
    layout,
    "vue-no-vnc": VueNoVnc,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const reactiveData: any = reactive({
      vmInfoData: {},
      options: {
        password: "", // vncpassword
        wsUrl: "", // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
    });
    // const vmInfoData=ref({})
    let vncLoadingV = ref(false);
    let uuidLoading = ref(false);
    provide("vncLoading", vncLoadingV);
    const roleType = ref(true);
    const wsVmConnect = ref(); // ws实例
    let { vmInfoData,options} = toRefs(reactiveData);
    provide("vmInfoData", vmInfoData);
    provide("vmOptions", options);
    const connection_id = route.query.connection_id;
    let navData = [
      { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
      { name: "实验指导", key: "guide", icon: "icon-zhidao" },
      { name: "实验习题", key: "exercises", icon: "icon-xiti1" },
      { name: "实验报告", key: "report", icon: "icon-baogao1" },
      { name: "随堂练习", key: "practice", icon: "icon-biji" },
      { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
    ];
    const data = reactive(navData);
    function back() {
      router.go(-1);
    }

    watch(vncLoadingV, () => {
      console.log(vncLoadingV.value);
    });

    function initWs() {
      wsVmConnect.value = wsConnect({
        url: "://192.168.101.150:9035/?uid=" + connection_id,
        close: (ev: CloseEvent) => {
          if (ev.type === "close") {
            message.success("ws关闭成功");
          }
        },
        message: (ev: MessageEvent) => {
          console.log(ev);
          console.log(typeof ev.data);
          let regex = /\{.*?\}/g;

          if (typeof ev.data === "string" && regex.test(ev.data)) {
            console.log(vmInfoData.value);

            vmInfoData.value = JSON.parse(ev.data);

            settingCurrentVM(vmInfoData.value.data.vms[0])
            uuidLoading.value = true;
          }
        },
      });
    }
    onBeforeRouteLeave(() => {
      console.log("离开页面");
      (wsVmConnect.value as any).close();
    });
    onMounted(() => {
      initWs();
    });

    function settingCurrentVM(data: any) {
      reactiveData.options.password = getVmConnectSetting.VNCPASS;
      reactiveData.options.wsUrl =
        getVmConnectSetting.VNCPROTOC +
        "://" +
        data.host_ip +
        ":" +
        getVmConnectSetting.VNCPORT +
        "/websockify?vm_uuid=" +
        data.uuid;
    }
    provide("settingCurrentVM",settingCurrentVM)
    return {
      roleType,
      back,
      data,
      provide,
      vncLoadingV,
      uuidLoading,
      reactiveData,
    };
  },
});
</script>
<style lang="less">
.vm-layout {
  .vm-header {
    .vm-header-student,
    .vm-header-teacher {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 43px;
      .vm-header-left {
        > button {
          margin-right: 20px;
        }
      }
      .vm-header-title {
        color: @white;
      }
      .vm-header-right {
        .delayed-btn {
          background: @warning-color;
          color: @white;
          border: none;
          &:hover {
            background: rgba(#faad14, 0.8);
          }
        }
        .vm-time {
          color: @warning-color;
          margin: 0 10px;
          .iconfont {
            margin-right: 3px;
            font-size: 12px;
          }
        }
        .vm-action-box {
          margin-left: 25px;
          > button {
            margin-left: 20px;
          }
        }
      }
    }
  }
  .vm-content-right {
    .vncloading {
      position: relative;
      width: 100%;
      height: 100%;
      background: rgba(#515151, 0.8);
      color: @white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
