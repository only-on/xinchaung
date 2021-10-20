<template>
  <div class="vm-header-box">
    <div class="vm-header-student" v-if="roleName === 'stuAndVnc'">
      <div class="vm-header-left">
        <a-button type="primary" @click="back"
          ><span class="icon-fanhui iconfont"></span>返回</a-button
        >
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
            <span class="icon-zhankai iconfont" style="margin-left: 5px"></span
          ></a-button>
        </a-dropdown>
        <a-dropdown class="">
          <template #overlay>
            <a-menu
              @click="handleAssistMenuClick"
              class="action-handle-dropdown"
            >
              <a-menu-item key="share" class="action-item">
                共享桌面
              </a-menu-item>
              <a-menu-item key="assistance" class="action-item">
                请求教师远程协助
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary">
            协助共享
            <span class="icon-zhankai iconfont" style="margin-left: 5px"></span
          ></a-button>
        </a-dropdown>
        <span v-if="isScreenRecording" class="video-time"
          >录制时间:
          {{
            videoTimeText?.h +
            "时" +
            videoTimeText?.m +
            "分" +
            videoTimeText?.s +
            "秒"
          }}</span
        >
      </div>
      <div class="vm-header-title">{{ allInfo?.base_info?.name }}</div>
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
          <a-button type="danger" @click="finishExperiment">结束实验</a-button>
        </span>
      </div>
    </div>
    <div class="vm-header-student" v-if="roleName === 'stuAndwebide'">
      <div class="vm-header-left">
        <a-button type="primary" @click="back"
          ><span class="icon-fanhui iconfont"></span>返回</a-button
        >
      </div>
      <div class="vm-header-title">{{ allInfo?.base_info?.name }}</div>
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
          <a-button type="danger" @click="finishExperiment">结束实验</a-button>
        </span>
      </div>
    </div>
    <div class="vm-header-student" v-if="roleName === 'teacherAndVnc'">
      <div class="vm-header-left">
        <a-button type="primary" @click="back"
          ><span class="icon-fanhui iconfont"></span>返回</a-button
        >
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
            <span class="icon-zhankai iconfont" style="margin-left: 5px"></span
          ></a-button>
        </a-dropdown>
        <span v-if="isScreenRecording" class="video-time"
          >录制时间:
          {{
            videoTimeText?.h +
            "时" +
            videoTimeText?.m +
            "分" +
            videoTimeText?.s +
            "秒"
          }}</span
        >
      </div>
      <div class="vm-header-title">{{ allInfo?.base_info?.name }}</div>
      <div class="vm-header-right">
        <span class="vm-action-box">
          <a-button type="danger" @click="finishExperiment">结束备课</a-button>
        </span>
      </div>
    </div>
    <div class="vm-header-student" v-if="roleName === 'teacherAndwebide'">
      <div class="vm-header-left">
        <a-button type="primary" @click="back"
          ><span class="icon-fanhui iconfont"></span>返回</a-button
        >
      </div>
      <div class="vm-header-title">{{ allInfo?.base_info?.name }}</div>
      <div class="vm-header-right">
        <span class="vm-action-box">
          <a-button type="danger" @click="finishExperiment">结束备课</a-button>
        </span>
      </div>
    </div>
  </div>
  <a-modal
    :visible="recommendVisible"
    title="推荐实验"
    @cancel="closeRecommend"
    @ok="okRecommend"
  >
    <div>
      <ul>
        <li
          v-for="item in recommendExperimentData"
          :key="item.id"
          @click="recommend(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </a-modal>
  <!--分享弹窗-->
  <a-modal
    class="share-desk-modal"
    :visible="shareVisible"
    :footer="false"
    @cancel="closeShreModal"
  >
    <template #title>共享桌面</template>
    <div>
      <p>复制以下链接发给朋友，邀请他远程协助，与你共同完成实验</p>
      <a-input v-model:value="vmUrl" />
      <a-button @click="selectUrl" type="primary" style="margin-top: 10px"
        >选中链接</a-button
      >
    </div>
  </a-modal>
  <!--请求协助modal-->
  <a-modal
    class="assistance-modal"
    title="消息提示"
    :visible="assistanceVisible"
    @cancel="closeAssistance"
    @ok="okAssistance"
  >
    <div>
      <p>请简单的描述你的问题，30字以内</p>
      <a-textarea
        v-model:value="assistanceQuestion"
        :auto-size="{ minRows: 2, maxRows: 6 }"
      ></a-textarea>
    </div>
  </a-modal>
  <!--保存进度modal-->
  <a-modal
    class="save-progress-modal"
    :visible="progressVisible"
    @cancel="closeProgress"
    @ok="okProgress"
  >
    <div>
      <a-radio-group
        @change="progressChange"
        v-model:value="selectProgressData"
      >
        <div v-for="(key, val) in saveExperimentData" :key="val.toString()">
          <div v-for="item in saveExperimentData[val]" :key="item.id">
            <a-radio
              :value="val.toString() + '、' + item.id"
              :key="val.toString() + '、' + item.id"
              >{{ item.name }}</a-radio
            >
          </div>
        </div>
      </a-radio-group>
    </div>
  </a-modal>
</template>

<script lang="tsx">
import {
  defineComponent,
  ref,
  Ref,
  reactive,
  toRefs,
  inject,
  onMounted,
  watch,
  computed,
  VNode
} from "vue";

import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
} from "src/utils/vncInspect";

import { message, Modal } from "ant-design-vue";
import { copyText } from "src/utils/copySelect";
import storage from "src/utils/extStorage";
import _ from "lodash";
import request from "src/request/getRequest"
import { isJsonString } from "src/utils/common";
type TvmQuery = {
  opType: string;
  connection_id: string;
  topoinst_uuid: string;
  taskId: number;
  type: string;
  topoinst_id: string;
  routerQuery: string;
};
export default defineComponent({
  setup() {
    const vmApi=request.vmApi
    const route = useRoute();
    const router = useRouter();
    let vmQuery = route.query as any;
    const {
      opType,
      connection_id,
      topoinst_uuid,
      taskId,
      type,
      topoinst_id,
      routerQuery,
    }: TvmQuery = vmQuery;
    const isScreenRecording = ref(false);
    const recommendVisible: Ref<boolean> = ref(false);
    const reactiveData: any = reactive({ recommendExperimentData: {} });
    const novncEl: any = inject("novncEl");
    const uuid: any = inject("uuid");
    let use_time: any = inject("use_time");
    let taskType: any = inject("taskType");
    let allInfo: any = inject("allInfo");
    const vmOptions: any = inject("vmOptions");
    let { recommendExperimentData } = toRefs(reactiveData);
    let role = storage.lStorage.get("role");
    const roleName = ref("none");
    const shareVisible=ref(false)
    const vmUrl=ref("")
    const assistanceVisible=ref(false)
    const assistanceQuestion=ref("")
    const selectProgressData=ref("")
    const progressVisible=ref(false)
    const saveExperimentData:any=ref({
      course:[],
      train:[]
    })
    // let roleName = computed(() => {
    //   console.log(allInfo.value);

    //   if (!allInfo.value?.base_info) {
    //     return "none";
    //   }
    //   // 学生
    //   if (role === 4) {
    //     // 桌面实验
    //     if (allInfo.value?.base_info.task_type.name === "桌面实验") {
    //       return "stuAndVnc";
    //     }
    //     // 交互编程
    //     if (allInfo.value?.base_info.task_type.name === "交互编程") {
    //       return "stuAndwebide";
    //     }
    //   }
    //   // 教师
    //   if (role === 3) {
    //     // 桌面实验
    //     if (allInfo.value?.base_info.task_type.name === "桌面实验") {
    //       return "teacherAndVnc";
    //     }
    //     // 交互编程
    //     if (allInfo.value?.base_info.task_type.name === "交互编程") {
    //       return "teacherAndwebide";
    //     }
    //   }
    //   return "none";
    // });

    let timer: NodeJS.Timer | null = null; // 实验剩余时间计时器
    let experimentTime: Ref<any> = ref({
      h: 0,
      m: 0,
      s: 0,
    });

    let viodeTimer: NodeJS.Timer | null = null; // 录屏计时
    let videoTime=ref(0)
    let videoTimeText: Ref<any>=ref({
      h: 0,
      m: 0,
      s: 0,
    })
    onBeforeRouteLeave(() => {
      console.log("离开页面");
      clearInterval(Number(timer));
      clearInterval(Number(viodeTimer))
    });

    watch(
      () => allInfo,
      () => {
        console.log(allInfo.value);
        if (!allInfo.value?.base_info) {
          roleName.value = "none";
          return;
        }
        console.log(role);

        // 学生
        if (role === 4) {
          // 桌面实验
          if (
            ["桌面实验", "验证实验", "实训"].includes(
              allInfo.value?.base_info.task_type.name
            )
          ) {
            roleName.value = "stuAndVnc";
            return;
          }
          // 交互编程
          if (allInfo.value?.base_info.task_type.name === "交互编程") {
            roleName.value = "stuAndwebide";
            return;
          }
        }
        // 教师
        if (role === 3) {
          // 桌面实验
          if (allInfo.value?.base_info.task_type.name === "桌面实验") {
            roleName.value = "teacherAndVnc";
            return;
          }
          // 交互编程
          if (allInfo.value?.base_info.task_type.name === "交互编程") {
            roleName.value = "teacherAndwebide";
            return;
          }
        }
        roleName.value = "none";
        return;
      },
      { deep: true, immediate: true }
    );

    onMounted(() => {
      clearInterval(Number(timer));
      clearInterval(Number(viodeTimer))
      console.log(use_time.value);
      if (role === 4) {
        timer = setInterval(() => {
          experimentTime!.value = secondToHHMMSS(Number(use_time.value));
          // console.log(taskType.value);

          if (!taskType.value) {
            use_time.value++;
          } else {
            use_time.value--;
            if (use_time.value === 600) {
              Modal.confirm({
                title: "是否延时？",
                okText: "确认",
                onOk: () => {
                  delayedTime();
                },
                cancelText: "取消",
                onCancel: () => {},
              });
            }
            if (use_time.value === 0) {
              endVmEnvirment();
              clearInterval(Number(timer));
            }
          }
        }, 1000);
      }
    });
    function back() {
      Modal.confirm(
        {
          title:"提示",
          content:"返回实验列表，10分钟不继续实验虚机将关机，30分钟不继续实验虚机将删除！",
          onOk:()=>{
              if (opType === "test" || opType === "prepare") {
                endVmEnvirment();
              } else {
                backTo(router, type, 3, routerQuery);
              }
          },
          onCancel:()=>{

          }
        }
      )
      
    }
    // 延时
    function delayedTime() {
      VmOperatesHandle("delay").then((res) => {
        console.log(res);
      });
    }
    // 保存进度
    function saveKvm() {
      VmOperatesHandle("saveKvm").then((res:any) => {
        console.log(res);
        if (res.data) {
          backTo(router, type, 3, routerQuery);
        }else{
          saveExperimentData.value={
            course:[],
            train:[]
          }
          if (isJsonString(res.msg)) {
            progressVisible.value=true
            let jsonData=JSON.parse(res.msg)
            console.log(jsonData)
            saveExperimentData.value=jsonData
          }
        }
        
      });
    }
    // 结束实验
    async function endVmOperates() {
      let param: any = {
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
        title: `确认结束${role === 4 ? "实验" : "备课"}吗？`,
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
        if (key==="startRecord") {
          isScreenRecording.value=true
          videoTime.value=0
          viodeTimer=setInterval(()=>{
            videoTime.value++
           videoTimeText.value= secondToHHMMSS(Number(videoTime.value));
          },1000)
        }else if (key==="stopRecord") {
          isScreenRecording.value=false
          videoTime.value=0
          clearInterval(Number(viodeTimer))
          videoTimeText.value=secondToHHMMSS(Number(videoTime.value));
        }
      });
    }

    // 推荐实验
    function recommend(val: {
      id: number;
      name: string;
      recommend_type: "content" | "train";
    }) {
      console.log(val);
      let cloneVal = _.cloneDeep(val);
      let params: any = {
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
      return new Promise((resolve: any, reject: any) => {
        console.log(uuid.value);
        let params: any = {
          action: actionType,
          params: {
            type: type,
            opType: opType,
            uuid: uuid.value,
            taskId: taskId,
          },
        };
        operatesHandle(params)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }).catch();
    }
    // 结束脚本入口
    function endVmEnvirment() {
      let params: any = null;
      if (role === 4) {
        params = {
          opType: opType,
          type: type,
          taskId: taskId,
          topoinst_id: topoinst_id,
        };
      }
      if (role === 3) {
        params = {
          opType: opType,
          type: type,
          taskId: taskId,
        };
      }

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

    

    function handleAssistMenuClick(val: any) {
      console.log(val.key);
      let key = val.key;
      if (key === "share") {
        Modal.confirm({
          title:"消息提示",
          class:"share-modal vm-modal",
          content:<h2>确认共享桌面吗？</h2>,
          okText:'是',
          cancelText:"否",
          onOk:()=>{
            shareVisible.value=true
          },
          onCancel:()=>{

          }
        });
      }
      if (key==="assistance") {
        assistanceVisible.value=true
      }
    }

    // 选中链接
    function selectUrl() {
      let env=process.env.NODE_ENV==="development"?true:false
      vmUrl.value=`${window.location.protocol}//${window.location.host}${env?'/#/':'/frontend/#/'}vm/vm?wsUrl=${vmOptions.value.wsUrl}`
    }

    // 关闭共享桌面modal
    function closeShreModal() {
      shareVisible.value=false
      vmUrl.value=""
    }

    // 发送协助信息
    function okAssistance() {
      console.log(assistanceQuestion.value)
      if (assistanceQuestion.value.length===0) {
        message.warn("请输入请求协助内容")
        return
      }
      let param={
        action:"question",
        params:{
            type:type,
            opType:opType,
            taskId:taskId,
            question:assistanceQuestion.value
        }
      }
      vmApi.studentQuestionApi({param:{...param}}).then((res=>{
        console.log(res)
        assistanceVisible.value=false
        message.success("请求发送成功")
      }))
    }
    // 关闭协助modal
    function closeAssistance() {
      assistanceVisible.value=false
      assistanceQuestion.value=""
    }

    // modal ok保存进度
    function okProgress() {
      console.log(selectProgressData)
      if (!selectProgressData.value) {
        return;
      }
      let tempArry=selectProgressData.value.split("、")
      let params: any = {
          action: 'saveKvm',
          params: {
            type: type,
            opType: opType,
            uuid: uuid.value,
            taskId: taskId,
            replace_id:tempArry[1],
            replace_type:tempArry[0]
          },
        };
        operatesHandle(params)
          .then((res:any) => {
            if (res.data) {
              backTo(router, type, 3, routerQuery);
              progressVisible.value=false
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }
    // 关闭保存进度modal
    function closeProgress(){
      progressVisible.value=false
      selectProgressData.value=""
    }

    // 保存modal选项发生变化
    function  progressChange(key:any) {
      console.log(key)
    }
    return {
      back,
      handleMenuClick,
      delayedTime,
      saveKvm,
      finishExperiment,
      recommend,
      closeRecommend,
      okRecommend,
      experimentTime,
      isScreenRecording,
      recommendVisible,
      allInfo,
      roleName,
      recommendExperimentData,
      handleAssistMenuClick,
      shareVisible,
      vmUrl,
      selectUrl,
      closeShreModal,
      closeAssistance,
      okAssistance,
      assistanceVisible,
      assistanceQuestion,
      videoTime,
      videoTimeText,
      closeProgress,
      okProgress,
      progressVisible,
      saveExperimentData,
      progressChange,
      selectProgressData
    };
  },
});
</script>

<style lang="less">
.vm-header {
  .vm-header-box {
    height: 100%;
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
          .icon-fanhui {
            margin-right: 5px;
          }
        }
        .video-time {
          color: #71f371;
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
}
.vm-modal {
  &.ant-modal-confirm .ant-modal-body {
    padding: 0;
  }
  .ant-modal-confirm-body {
    .ant-modal-confirm-title {
      padding: 15px;
      background: @theme-color;
      font-size: 18px;
      color: @white;
    }
    .ant-modal-confirm-content {
      padding: 15px;
    }
  }
  .ant-modal-confirm-btns {
    padding-right: 30px;
    padding-bottom: 30px;
  }
}
</style>
