<template>
  <layout :VmData="data" :reportId="reportTemid" isLeftContentShowType="line">
    <template v-slot:right>
      <template v-if="currentInterface === 'ssh'">
        <iframe id="sshIframe" :src="sshUrl" frameborder="0"></iframe>
      </template>
      <template v-else>
        <!-- <div class="vncloading" v-if="!uuidLoading || !vncLoadingV">
          <div class="word">
           <img :src="loadingGif" alt="" srcset="">
           <div class="loading">
             <span>虚拟机加载中，请稍后...</span>
           </div>
          </div>
        </div> -->
        <!-- <div v-else-if="!vncLoadingV" class="vncloading">
          <div class="word">
            <img :src="loadingGif" alt="" srcset="">
          </div>
        </div> -->
        <vue-no-vnc
          background="rgb(40,40,40)"
          :options="vmOptions"
          refName="refName"
          ref="novncEl"
          @clipboard="clipboard"
        />
      </template>
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
import _ from "lodash";
import { UnwrapNestedRefs } from "@vue/reactivity/dist/reactivity";
import layout from "../VmLayout/VmLayout.vue";
import loadingGif from "src/assets/images/vmloading.gif";
import {
  onBeforeRouteLeave,
  useRoute,
  useRouter,
  LocationQuery,
  LocationQueryValue,
  onBeforeRouteUpdate,
} from "vue-router";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import { wsConnect } from "src/request/websocket";
import { message, Modal } from "ant-design-vue";
import { getVmConnectSetting } from "src/utils/seeting";
import { countDown } from "src/utils/common";
import storage from "src/utils/extStorage";
import { copyText } from "src/utils/copySelect";
import {
  getVmBaseInfo,
  endOperates,
  endExperiment,
  TopType,
  TStudyType,
  IStopOperatesParam,
  recommendExperiment,
  IRecommendExperiment,
  toStudyRecommendExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IOperatesHandle,
  IAction,
} from "src/utils/vncInspect";

type TvmQuery = {
  opType: TopType;
  connection_id: string;
  topoinst_uuid: string;
  taskId: number;
  type: TStudyType;
  topoinst_id: string;
  routerQuery: string;
};
export default defineComponent({
  name: "vnc",
  components: {
    layout,
    "vue-no-vnc": VueNoVnc,
  },
  setup(props, { emit }) {
    // connection_id=131_206
    // opType=continue
    // type=course
    // taskId=500136
    // topoinst_uuid=315bdc23-4c6e-40d1-aa40-2283946ed9ae
    // topoinst_id=206
    // routerQuery={"detailId":"4808","course_id":"500073"}
    var reportTemid: Ref<any> = ref(0);
    const route = useRoute();
    const router = useRouter();
    let vmQuery = route.query as any;
    const novncEl = ref();
    let role = storage.lStorage.get("role");
    let ws_config = storage.lStorage.get("ws_config");
    let {
      opType, // 实验学习类型
      connection_id, // 用户id_环境id
      taskId, // 实验id
      type, // 是实验还是课程
      topoinst_id,
      topoinst_uuid,
      routerQuery, // 上一个页面需要参数
    }: TvmQuery = vmQuery;

    const reactiveData: UnwrapNestedRefs<{
      allInfo: any;
      vmInfoData: any;
      vmOptions: any;
      recommendExperimentData: Array<any>;
    }> = reactive({
      allInfo: {}, // 所有基本信息
      vmInfoData: {}, // 虚拟机信息
      vmOptions: {
        password: "", // vncpassword
        wsUrl: "", // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
      recommendExperimentData: [], // 推荐实验数据
    });

    let vncLoadingV = ref(true);
    let uuidLoading = ref(false);
    const use_time: Ref<number> = ref(900);
    let uuid = ref("");
    let taskType = ref("11"); // 实验类型  true是实验 false是实训
    provide("vncLoading", vncLoadingV);
    const wsVmConnect = ref(); // ws实例
    const sshUrl = ref("");
    const currentInterface = ref("vnc"); // 环境类型ssh、vnc
    const vmCurrentIndex = ref(0);
    let { vmInfoData, vmOptions, allInfo, recommendExperimentData } =
      toRefs(reactiveData);
    provide("vmInfoData", vmInfoData);
    provide("vmOptions", vmOptions);
    provide("vmCurrentIndex", vmCurrentIndex);
    provide("allInfo", allInfo);
    provide("novncEl", novncEl);
    provide("uuid", uuid);
    provide("use_time", use_time);
    provide("taskType", taskType);
    provide("sshUrl", sshUrl);
    provide("currentInterface", currentInterface);
    provide("taskId", taskId);
    provide("isConnect", ref(true));
    provide("initVnc", initVnc);
    let ind = 0; // 记录是否是刚进页面
    // 左侧导航数据
    let navData =
      role === 4
        ? type === "course"
          ? [
              { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
              { name: "实验指导", key: "guide", icon: "icon-zhidao" },
              {
                name: "实验笔记",
                key: "experimental-note",
                icon: "icon-biji1",
              },
              { name: "实验习题", key: "exercises", icon: "icon-xiti1" },
              { name: "实验报告", key: "report", icon: "icon-baogao1" },
              { name: "随堂练习", key: "practice", icon: "icon-biji" },
              { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
            ]
          : [
              { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
              { name: "实训指导", key: "guide", icon: "icon-zhidao" },
              { name: "实训笔记", key: "train-note", icon: "icon-biji1" },
              { name: "实训课件", key: "courseware", icon: "icon-kejian1" },
              { name: "实训资源", key: "resource", icon: "icon-leixing-01" },
              { name: "实训报告", key: "train-report", icon: "icon-baogao1" },
              { name: "随堂论坛", key: "forum", icon: "icon-luntan1" },
            ]
        : [
            { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
            { name: "实验指导", key: "guide", icon: "icon-zhidao" },
          ];
    navData = [
      { name: "指导", key: "guide", icon: "icon-zhidao" },
      { name: "笔记", key: "experimental-note", icon: "icon-biji" },
      { name: "报告", key: "report", icon: "icon-baogao" },
      { name: "问答", key: "forum", icon: "icon-wenda" },
    ];
    const data = reactive(navData);

    // 初始化websocket
    function initWs() {
      vncLoadingV.value = false;
      wsVmConnect.value = wsConnect({
        url:
          "://" +
          ws_config.host +
          ":" +
          ws_config.port +
          "/?uid=" +
          connection_id,
        close: (ev: CloseEvent) => {
          if (ev.type === "close") {
            // message.success("ws关闭成功");
          }
        },
        message: (ev: MessageEvent) => {
          let regex = /\{.*?\}/g;

          if (typeof ev.data === "string" && regex.test(ev.data)) {
            vmInfoData.value = JSON.parse(ev.data);
            if (vmInfoData.value.data.vms.length > 0) {
              if (
                ind === 0 &&
                allInfo.value.base_info &&
                allInfo.value.base_info.is_webssh === 1
              ) {
                ind++;
                currentInterface.value = "ssh";
                let currentvm: any =
                  vmInfoData.value.data.vms[vmCurrentIndex.value];
                uuid.value = currentvm.uuid;
                sshUrl.value =
                  getVmConnectSetting.SSHHOST +
                  ":2222/ssh/host/" +
                  currentvm.host_ip +
                  "/" +
                  currentvm.ssh_port;
              } else {
                currentInterface.value = "vnc";
                settingCurrentVM(
                  vmInfoData.value.data.vms[vmCurrentIndex.value]
                );
              }
              uuidLoading.value = true;
            }
          }
        },
      });
    }
    onBeforeRouteLeave(() => {
      (wsVmConnect.value as any).close();
    });

    onBeforeRouteUpdate(() => {
      console.log(1111);
    });
    onMounted(async () => {
      await getVmBase();
      initWs();
    });
    // 获取虚拟机基本信息pageinfo
    function getVmBase() {
      return new Promise((resolve: any, reject: any) => {
        let params = {
          opType: opType,
          type: type,
          taskId: taskId,
        };
        getVmBaseInfo(params).then((res: any) => {
          allInfo.value = res.data;
          if (!res.data.current) {
            resolve();
            return;
          }

          taskType.value = res.data.base_info.task_type.type;

          if (!taskType.value) {
            use_time.value = res.data.current.used_time;
          } else {
            use_time.value = res.data.current.remaining_time;
          }
          reportTemid.value = res.data.current.id;
          resolve();
        });
      });
    }

    // 设置当前虚拟机信息
    function settingCurrentVM(data: any) {
      reactiveData.vmOptions.password = getVmConnectSetting.VNCPASS;
      reactiveData.vmOptions.wsUrl =
        getVmConnectSetting.VNCPROTOC +
        "://" +
        data.base_ip +
        ":" +
        getVmConnectSetting.VNCPORT +
        "/websockify?vm_uuid=" +
        data.uuid;
      uuid.value = data.uuid;
    }

    // 选中内容发送变化时
    function clipboard(message: CustomEvent) {
      console.log(message);
    }

    // 切换实验
    async function ExperimentChange(id: number) {
      console.log(id);
      taskId = id;
      // await getVmBase();
      // initWs();
    }
    provide("ExperimentChange", ExperimentChange);
    // 开启虚拟机
    function initVnc() {
      console.log(novncEl.value);
      if (novncEl.value) {
        novncEl.value.connectVnc();
        console.log(novncEl.value);
      }
    }

    return {
      novncEl,
      data,
      provide,
      vncLoadingV,
      uuidLoading,
      ...toRefs(reactiveData),
      clipboard,
      reportTemid,
      sshUrl,
      currentInterface,
      opType,
      loadingGif,
      ExperimentChange,
    };
  },
});
</script>
<style lang="less">
.vm-layout {
  .vm-content-right {
    .vncloading {
      // position: relative;
      height: 100%;
      text-align: center;
      background: radial-gradient(#010b24, #010b24);
      .word {
        width: 100%;
        height: 100%;
        bottom: 0;
        color: #fff;
        left: 0;
        margin: auto;
        right: 0;
        position: absolute;
        // text-shadow: 0 0 10px rgba(117, 121, 224, 0.5),
        //   0 0 5px rgba(117, 121, 224, 0.5);
        // top: 50%;
        // transform: translateY(-50%);
        background-color: var(--black-2);
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
        }
      }
      color: var(--white-100);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .vnc-box {
      height: calc(100% - 46px);
      background: radial-gradient(#010b24, #010b24);
    }
    .tab-btn {
      height: 46px;
      line-height: 46px;
      background-color: var(--black-100);
      color: var(--white-100);
      text-align: center;
    }
  }
}
#sshIframe {
  width: 100%;
  height: 100%;
}
</style>
