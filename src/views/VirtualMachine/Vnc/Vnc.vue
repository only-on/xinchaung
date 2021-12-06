<template>
  <layout :VmData="data" :reportId="reportTemid" isLeftContentShowType="line">
    <template v-slot:header>
      <div class="vm-header-student" v-if="roleType">
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
          <a-dropdown class="">
            <template #overlay>
              <a-menu @click="handleMenuClick" class="action-handle-dropdown">
                <a-menu-item key="revertVm" class="action-item">
                  <span class="icon-fasong iconfont"></span>发送Ctrl+Alt+Del
                </a-menu-item>
                <a-menu-item key="sendSelectContent" class="action-item">
                  <span class="icon-gongxiang1 iconfont"></span>发送选择内容
                </a-menu-item>
                <a-menu-item
                  key="startRecord"
                  class="action-item"
                  :class="isScreenRecording ? 'disabled' : ''"
                >
                  <span class="icon-luping iconfont"></span>开始录屏
                </a-menu-item>
                <a-menu-item
                  key="stopRecord"
                  class="action-item"
                  :class="!isScreenRecording ? 'disabled' : ''"
                >
                  <span class="icon-luping iconfont"></span>结束录屏
                </a-menu-item>
                <a-menu-item key="resetVm" class="action-item">
                  <span class="icon-zhongzhi iconfont"></span>重置
                </a-menu-item>
                <a-menu-item key="closeVm" class="action-item">
                  <span class="icon-kaiguanshenx iconfont"></span>关机
                </a-menu-item>
              </a-menu>
            </template>
            <a-button type="primary">
              操作
              <span
                class="icon-zhankai iconfont"
                style="margin-left: 5px"
              ></span
            ></a-button>
          </a-dropdown>
        </div>

        <div class="vm-header-title">实验名称</div>
        <div class="vm-header-right">
          <span class="vm-time">
            <span class="icon-shijian1 iconfont"></span>
            <span
              >实验剩余时间:
              {{
                experimentTime?.h +
                "时" +
                experimentTime?.m +
                "分" +
                experimentTime?.s +
                "秒"
              }}</span
            >
          </span>
          <a-button class="delayed-btn" @click="delayedTime">延时</a-button>
          <span class="vm-action-box">
            <a-button type="primary" @click="saveKvm">保存进度</a-button>
            <a-button type="danger" @click="finishExperiment"
              >结束实验</a-button
            >
          </span>
        </div>
      </div>
      <div
        v-else
        class="vm-header-teacher"
        v-layout-bg="layoutBg"
      >
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
          <a-button type="primary">操作</a-button>
        </div>
        <div class="vm-header-title">{{ allInfo?.base_info?.name }}</div>
        <div class="vm-header-right">
          <span class="vm-action-box">
            <a-button type="danger" @click="finishExperiment"
              >结束备课</a-button
            >
          </span>
        </div>
      </div>
    </template>
    <template v-slot:right>
      <template v-if="currentInterface==='ssh'">
        <iframe id="sshIframe" :src="sshUrl" frameborder="0"></iframe>
      </template>
      <template v-else>
        <div v-if="!uuidLoading">websocket链接中</div>
        <div v-else-if="!vncLoadingV" class="vncloading">Loading...</div>
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
  <!-- <a-modal
    :visible="recommendVisible"
    title="推荐实验"
    @cancel="closeRecommend"
    @ok="okRecommend"
  >
    <div>
      <ul>
        <li
          v-for="(item, index) in recommendExperimentData"
          :key="index"
          @click="recommend(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </a-modal> -->
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
import layoutBg from "src/assets/common/layout_bg.jpg"
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
  components: {
    layout,
    "vue-no-vnc": VueNoVnc,
  },
  setup(props, { emit }) {
    var reportTemid: Ref<any> = ref(0);
    const route = useRoute();
    const router = useRouter();
    let vmQuery = route.query as any;
    const novncEl = ref();
    let role = storage.lStorage.get("role");
    let ws_config=storage.lStorage.get("ws_config")
    const {
      opType,
      connection_id,
      topoinst_uuid,
      taskId,
      type,
      topoinst_id,
      routerQuery,
    }: TvmQuery = vmQuery;

    const step_score_exists: boolean | string = "";
    const reactiveData: UnwrapNestedRefs<{
      allInfo: any;
      vmInfoData: any;
      vmOptions: any;
      recommendExperimentData: Array<any>;
    }> = reactive({
      allInfo: {},
      vmInfoData: {},
      vmOptions: {
        password: "", // vncpassword
        wsUrl: "", // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
      recommendExperimentData: [],
    });
    const recommendVisible: Ref<boolean> = ref(false);
    // const vmInfoData=ref({})
    let vncLoadingV = ref(true);
    let uuidLoading = ref(false);
    const use_time: Ref<number> = ref(900);
    let experimentTime: Ref<any> = ref({
      h: 0,
      m: 0,
      s: 0,
    });
    let uuid = ref("");
    let timer: NodeJS.Timer | null = null; // 实验剩余时间计时器
    let taskType = ref(""); // 实验类型
    const isScreenRecording = ref(false);
    provide("vncLoading", vncLoadingV);
    const roleType = ref(true);
    const wsVmConnect = ref(); // ws实例
    const sshUrl = ref("");
    const currentInterface=ref("vnc")
    const vmCurrentIndex=ref(0)
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
    provide("currentInterface",currentInterface)
    provide("taskId",taskId)
    let ind=0 // 记录是否是刚进页面
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
    const data = reactive(navData);
    function back() {
      if (opType === "test" || opType === "prepare") {
        endVmEnvirment();
      } else {
        backTo(router, type, 3, routerQuery);
      }
    }

    // watch(()=>use_time, () => {
    //   console.log(use_time);
    // },{deep:true});

    function initWs() {
      vncLoadingV.value = false;
      wsVmConnect.value = wsConnect({
        url: "://"+ws_config.host+":"+ws_config.port+"/?uid=" + connection_id,
        close: (ev: CloseEvent) => {
          if (ev.type === "close") {
            // message.success("ws关闭成功");
          }
        },
        message: (ev: MessageEvent) => {
          console.log(ev);
          console.log(typeof ev.data);
          let regex = /\{.*?\}/g;

          if (typeof ev.data === "string" && regex.test(ev.data)) {
            console.log(vmInfoData.value);

            vmInfoData.value = JSON.parse(ev.data);
            console.log(vmInfoData.value);

            if (vmInfoData.value.data.vms.length > 0) {
              if (ind===0&&allInfo.value.base_info&&allInfo.value.base_info.is_webssh===1) {
                ind++
                currentInterface.value="ssh"
                let currentvm:any=vmInfoData.value.data.vms[vmCurrentIndex.value]
                uuid.value = currentvm.uuid;
                sshUrl.value=getVmConnectSetting.SSHHOST+":2222/ssh/host/"+currentvm.base_ip+"/"+currentvm.ssh_port
              }else{
                currentInterface.value="vnc"
                settingCurrentVM(vmInfoData.value.data.vms[vmCurrentIndex.value]);
              }
              uuidLoading.value = true;
            }
          }
        },
      });
    }
    onBeforeRouteLeave(() => {
      console.log("离开页面");
      (wsVmConnect.value as any).close();
      clearInterval(Number(timer));
    });

    onBeforeRouteUpdate(() => {
      console.log(1111);
    });
    onMounted(async () => {
      await getVmBase();
      initWs();
      

      // clearInterval(Number(timer));
      // timer = setInterval(() => {
      //   experimentTime!.value = secondToHHMMSS(use_time.value);
      //   if (taskType === "实训") {
      //     use_time.value++;
      //   } else {
      //     use_time.value--;
      //     if (use_time.value === 600) {
      //       Modal.confirm({
      //         title: "是否延时？",
      //         okText: "确认",
      //         onOk: () => {
      //           delayedTime();
      //         },
      //         cancelText: "取消",
      //         onCancel: () => {},
      //       });
      //     }
      //     if (use_time.value === 0) {
      //       endVmEnvirment();
      //       clearInterval(Number(timer));
      //     }
      //   }
      // }, 1000);
    });
    // 获取虚拟机基本信息pageinfo
    function getVmBase() {
      return new Promise((resolve:any,reject:any)=>{
        let params = {
        opType: opType,
        type: type,
        taskId: taskId,
      };
      getVmBaseInfo(params).then((res: any) => {
        console.log(res);
        allInfo.value = res.data;
        if (!res.data.current) {
          resolve()
          return
        }
        
        console.log(res.data.current.used_time);
        taskType.value = res.data.base_info.task_type.type;

        if (!taskType.value) {
          use_time.value = res.data.current.used_time;
        } else {
          use_time.value = res.data.current.remaining_time;
        }
        reportTemid.value = res.data.current.id;
        resolve()
      });
      })
    }

    // 结束脚本入口
    function endVmEnvirment() {
      let params = {
        opType: opType,
        type: type,
        taskId: taskId,
        topoinst_id: topoinst_id,
      };

      setTimeout(() => {
        endExperiment(params).then((res: any) => {
          console.log(res);
          if (res.data.length > 0) {
            recommendExperimentData.value = res.data;
            recommendVisible.value = true;
          }
          message.success("结束成功");
          backTo(router, type, 3, routerQuery);
        });
      }, 3000);
    }
    // 结束实验
    async function endVmOperates() {
      let param: IStopOperatesParam = {
        type: type,
        taskId: taskId,
        opType: opType,
        action: "recommend",
        topoinst_id: topoinst_uuid,
      };
      return await endOperates(param);
    }

    // 结束实验
    function finishExperiment() {
      let modal = Modal.confirm({
        title: "确认结束实验吗？",
        okText: "确认",
        onOk: () => {
          if (opType === "recommend") {
            endVmEnvirment();
            return;
          }
          if (
            allInfo &&
            allInfo.value &&
            allInfo.value.base_info &&
            allInfo.value.base_info.step_score_exists
          ) {
            endVmOperates().then((res: any) => {
              // recommendVisible.value = true;
              console.log(res);
              recommendExperimentData.value = res.data;
              endVmEnvirment();
            });
          } else {
            endVmEnvirment();
          }
          modal.destroy();
        },
        cancelText: "取消",
        onCancel: () => {
          console.log("quxiao1");
          modal.destroy();
        },
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

    // 推荐实验
    function recommend(val: {
      id: number;
      name: string;
      recommend_type: "content" | "train";
    }) {
      console.log(val);
      let cloneVal = _.cloneDeep(val);
      let params: IRecommendExperiment = {
        recommendType: cloneVal.recommend_type,
        opType: "recommend",
        type: type,
        taskId: cloneVal.id,
      };
      toStudyRecommendExperiment(router, params, { topoinst_id });
      // studyRecommendExperiment(params).then((res: any) => {
      //   console.log(res);
      //   let routeUrl = router.resolve({
      //     path: "/vm/vnc",

      //     query: {
      //       connection_id: res.data.connection_id,
      //       opType: "recommend",
      //       type: res.data.type.type,
      //       taskId: 50227,
      //       topoinst_uuid: res.data.topoinst_uuid,
      //     },
      //   });
      //   window.open(routeUrl.href, "_blank");
      // });
    }

    // 学生学习推荐实验/实训
    // async function studyRecommendExperiment(params: IRecommendExperiment) {
    //   return await recommendExperiment(params);
    // }

    // 关闭推荐modal
    function closeRecommend() {
      recommendVisible.value = false;
    }
    // 确认推荐modal
    function okRecommend() {
      recommendVisible.value = false;
    }

    // 操作虚拟机
    function VmOperatesHandle(actionType: IAction) {
      let params: IOperatesHandle = {
        action: actionType,
        params: {
          type: type,
          opType: opType,
          uuid: uuid.value,
          taskId: taskId,
        },
      };
      return new Promise((resolve: any, reject: any) => {
        operatesHandle(params)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }).catch();
    }
    // 操作虚拟机
    function handleMenuClick(downEvent: any) {
      let key = downEvent.key;
      if (key === "sendSelectContent") {
        novncEl.value.sendSelectContent(copyText);
        return;
      }
      VmOperatesHandle(key).then((res) => {
        console.log(res);
        message.success("操作成功");
      });
    }

    // 延时
    function delayedTime() {
      VmOperatesHandle("delay").then((res) => {
        console.log(res);
      });
    }

    // 保存进度
    function saveKvm() {
      VmOperatesHandle("saveKvm").then((res) => {
        console.log(res);
        backTo(router, type, 3, routerQuery);
      });
    }

    // 选中内容发送变化时
    function clipboard(message: CustomEvent) {
      console.log(message);
    }
    return {
      novncEl,
      roleType,
      back,
      data,
      provide,
      vncLoadingV,
      uuidLoading,
      ...toRefs(reactiveData),
      finishExperiment,
      recommendVisible,
      recommend,
      closeRecommend,
      okRecommend,
      experimentTime,
      VmOperatesHandle,
      handleMenuClick,
      delayedTime,
      saveKvm,
      clipboard,
      isScreenRecording,
      reportTemid,
      sshUrl,
      currentInterface,
      layoutBg
    };
  },
});
</script>
<style lang="less">
.vm-layout {
  // .vm-header {
  //   .vm-header-student,
  //   .vm-header-teacher {
  //     display: flex;
  //     flex-direction: row;
  //     justify-content: space-between;
  //     align-items: center;
  //     height: 100%;
  //     padding: 0 43px;
  //     .vm-header-left {
  //       > button {
  //         margin-right: 20px;
  //       }
  //     }
  //     .vm-header-title {
  //       color: @white;
  //     }
  //     .vm-header-right {
  //       .delayed-btn {
  //         background: @warning-color;
  //         color: @white;
  //         border: none;
  //         &:hover {
  //           background: rgba(#faad14, 0.8);
  //         }
  //       }
  //       .vm-time {
  //         color: @warning-color;
  //         margin: 0 10px;
  //         .iconfont {
  //           margin-right: 3px;
  //           font-size: 12px;
  //         }
  //       }
  //       .vm-action-box {
  //         margin-left: 25px;
  //         > button {
  //           margin-left: 20px;
  //         }
  //       }
  //     }
  //   }
  // }
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
.action-handle-dropdown {
  .iconfont {
    margin-right: 15px;
    width: 15px;
    display: inline-block;
  }

  .action-item {
    &:hover {
      color: @theme-color;
    }
    &.active {
      color: @theme-color;
    }
    &.disabled {
      color: rgb(196, 196, 196);
      pointer-events: none;
    }
  }
}
#sshIframe {
  width: 100%;
  height: 100%;
}
</style>
