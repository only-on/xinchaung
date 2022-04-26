<template>
  <div class="vm-header-box">
    <div class="left-box">
      <div class="back pointer" @click="back">
        <span class="iconfont icon-fanhui1"></span>
        <span>返回</span>
      </div>
      <div
        class="selected pointer"
      >
        <span class="name">3-4 基于入侵检测的告警分析-外网{{roleName}}</span>
      </div>
      <div class="class-test pointer" @click="classTestVisible = true" v-if="roleName === 'student'">
        <span>随堂测试</span>
        <span>({{!classTestTotal ? 0 : testNum+'/'+classTestTotal}})</span>
        <i class="sign"></i>
      </div>
    </div>
    <div class="right-box" v-if="taskType !==6 && taskType !== 7">
      <div class="ip-list">
        <a-select class="ip-select" v-model:value="vmCurrentIndex" @change="ipChange">
          <a-select-option v-for="(item, index) in vms" :key="index" :value="index">
            <span class="ip-name">{{ item.host_ip }}</span>
            <span class="vm-state" :class="item.status==='ACTIVE' ? 'open' : 'close'">{{item.status==='ACTIVE' ? '开' : '关'}}</span>
          </a-select-option>
        </a-select>
      </div>
      <div class="delayed" v-if="roleName === 'student'">
        <span>
          {{
            experimentTime?.h +
            ":" +
            experimentTime?.m +
            ":" +
            experimentTime?.s
          }}
        </span>
        <span class="pointer" @click="delayedTime">延时</span>
      </div>
      <div class="vnc-change pointer" @click="showChange"  v-if="allInfo?.base_info?.is_webssh === 1">
        切换为{{ currentInterface === "ssh" ? "VNC" : "SSH" }}
      </div>
      <div class="tool pointer" @click="visible = !visible">
        <span class="iconfont icon-gongjuxiang"></span>
        <span>工具箱</span>
      </div>
      <div class="switch pointer" @click="finishExperiment">
        <span class="iconfont icon-guanbi1"></span>
      </div>
    </div>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      v-model:visible="visible"
      :after-visible-change="afterVisibleChange"
      :drawer-style="{ backgroundColor: '#192843' }"
      :mask-style="{ opacity: 0 }"
      :width="'216px'"
    >
      <div class="vm-operate">
        <ul>
          <li
            class="pointer"
            v-for="(list, index) in toolList"
            :key="index"
            @click="list.function"
          >
            <span class="iconfont" :class="list.icon"></span>
            <span>{{ list.name }}</span>
          </li>
        </ul>
      </div>
      <div class="vm-info">
        <h5>虚拟机信息</h5>
        <div class="neicun">
          <ul>
            <li>
              <span class="iconfont icon-neicun"></span>
              <span>内存：{{currentvm.ram}}G</span>
            </li>
            <li>
              <span class="iconfont icon-CPU"></span>
              <span>CPU：{{currentvm.cpu}}核</span>
            </li>
            <li>
              <span class="iconfont icon-xianka"></span>
              <span>GPU：{{currentvm.use_gpu ? '是' : '否'}}</span>
            </li>
            <li>
              <span class="iconfont icon-yingpan"></span>
              <span>硬盘：{{currentvm.disk}}G</span>
            </li>
          </ul>
        </div>
        <div class="user">
          <ul>
            <li class="ellipse">
              <span class="iconfont icon-yonghuming"></span>
              <span>用户名：{{currentvm.name}}</span>
            </li>
            <li>
              <span class="iconfont icon-mima"></span>
              <span>密码：vncpassword</span>
            </li>
            <li>
              <span class="iconfont icon-IP"></span>
              <span>IP：{{currentvm.host_ip}}</span>
            </li>
            <li>
              <span class="iconfont icon-duankou"></span>
              <span>{{currentvm.classify === "Linux" ? 'ssh' : 'rdp'}}端口：{{
              currentvm.classify === "Linux" ? currentvm.ssh_port : currentvm.rdp_port}}</span>
            </li>
          </ul>
        </div>
      </div>
    </a-drawer>
  </div>
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
  <!-- 随堂测试 -->
  <a-modal
    class="vm-class-test-modal"
    title="随堂测试"
    :visible="classTestVisible"
    :width="700"
    @cancel="classTestVisible = false"
    @ok="okClassTest"
  >
    <div class="choice">
      <div class="subject">配置Hadoop时，JAVA_HOME包含在哪一个配置文件中？</div>
      <a-radio-group class="answer-list" v-model:value="choiceAnswer">
        <div v-for="(item,index) in choiceOptions" :key="item.id" class="list">
          <a-radio :disabled="false" class="answer-item" :value="item.id" >{{numToAbc(Number(index)+1)}}、{{item.option}}</a-radio>
        </div>
      </a-radio-group>
      <div class="right-answer">正确答案A</div>
    </div>
    <div class="answer">
      <div class="subject">配置Hadoop时，JAVA_HOME包含在哪一个配置文件中？配置Hadoop时，JAVA_HOME包 含在哪一个配置文件中？</div>
      <a-textarea v-model:value="answer"></a-textarea>
      <div class="right-answer">正确答案：表单内容需先易后难，避免用户从一开始就产生逃避的想法，需根据内容的关联性 循序渐进的引导用户完成。</div>
      <div class="keyword">关键字：表单 , 先难后易 , 避免 , 引导 , 完成</div>
    </div>
    <template #footer>
      <a-button key="back" @click="classTestVisible = false">关闭</a-button>
      <a-button key="submit" type="primary" :loading="false" @click="okClassTest">提交</a-button>
      <a-button key="submit" type="primary" :loading="false" @click="okClassTest">实验随测记录</a-button>
    </template>
  </a-modal>
</template>

<script lang="tsx">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  provide,
  inject,
  watch,
  nextTick,
  PropType,
  Ref,
} from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { message, Modal } from "ant-design-vue";
import { getVmConnectSetting } from "src/utils/seeting";
import request from "src/request/getRequest";
import { copyText } from "src/utils/copySelect";
import storage from "src/utils/extStorage";
import { isJsonString, numToAbc } from "src/utils/common";
import {
  endOperates,
  endExperiment,
  secondToHHMMSS,
  backTo,
  operatesHandle,
  IAction,
  toStudyRecommendExperiment,
} from "src/utils/vncInspect";
import { IBusinessResp } from "src/typings/fetch";

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
  name: "",
  components: {},
  emit: [],
  setup() {
    const vmApi = request.vmApi;
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
    console.log("opType", opType);
    let role = storage.lStorage.get("role");

    const visible = ref<boolean>(false);
    const novncEl: any = inject("novncEl");
    const uuid: any = inject("uuid");
    let use_time: any = inject("use_time");
    let taskType: any = inject("taskType");
    let allInfo: any = inject("allInfo");
    const vmOptions: any = inject("vmOptions");
    const vmInfoData: any = inject("vmInfoData");
    const vmCurrentIndex: any = inject("vmCurrentIndex");
    const sshUrl: any = inject("sshUrl");
    const currentInterface: any = inject("currentInterface");
    const vncLoading: any = inject("vncLoading");
    const isConnect: any = inject("isConnect");
    const vms: any = ref([]);
    const currentvm:any=inject("currentvm",{})
    const roleName = ref("none");
    roleName.value = 
      role === 3 || role === 5 ? 'teacher':
      role === 4 ? 'student' : 'none'
    watch(
      () => vmInfoData.value,
      () => {
        if (vmInfoData.value.data && vmInfoData.value.data.vms) {
          vms.value = vmInfoData.value.data.vms;
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      if (taskType.value !==6 && taskType.value !== 7 && role === 4) {
        clearInterval(Number(timer));
        times();
      }
      nextTick(() => {
        document.addEventListener('keyup', (e: any) => {
          if (e.keyCode === 27) {
            isFullScreen.value = false
          }
        })
      })
    });
    // 随堂测试
    const classTestTotal = ref<number>(5)
    const testNum = ref<number>(0)
    const classTestVisible = ref<boolean>(false)
    const okClassTest = () => {
      
    }
    const choiceAnswer = ref<number>(1)
    const answer = ref<string>('')

    function ipChange(val: number) {
      console.log(vmCurrentIndex.value)
      console.log(val)
      // vmCurrentIndex.value = val
      settingCurrentVM(vmInfoData.value.data.vms[val])
      // vncLoading.value=false
      // if (currentVmInfo.uuid === val) {
      //   return
      // }
      // props.screenInfo.forEach((item: any) => {
      //   if (item.uuid === val) {
      //     currentVmInfo = Object.assign(currentVmInfo, item)
      //     vncConnectOption.vmOptions.wsUrl="ws://"+item.base_ip+":8888/websockify?vm_uuid="+item.uuid
      //     // ;(this.$refs as any).vnc.startNoVnc()
      //   }
      // })
    }
    function settingCurrentVM(data: any) {
      currentvm.value=data
      vmOptions.value.password = getVmConnectSetting.VNCPASS;
      vmOptions.value.wsUrl =
        getVmConnectSetting.VNCPROTOC +
        "://" +
        data.base_ip +
        ":" +
        getVmConnectSetting.VNCPORT +
        "/websockify?vm_uuid=" +
        data.uuid;
        
    }

    let currentTaskId = ref<number>(0);
    let timer: NodeJS.Timer | null = null; // 实验剩余时间计时器
    let experimentTime: Ref<any> = ref({
      h: 0,
      m: 0,
      s: 0,
    });

    let viodeTimer: NodeJS.Timer | null = null; // 录屏计时
    let videoTime = ref(0);
    let videoTimeText: Ref<any> = ref({
      h: 0,
      m: 0,
      s: 0,
    });
    const isScreenRecording = ref(false); // 是否录屏
    onBeforeRouteLeave(() => {
      console.log("离开页面");
      clearInterval(Number(timer));
      clearInterval(Number(viodeTimer));
    });
    // 轮询实验时间
    function times() {
      timer = setInterval(() => {
        experimentTime!.value = secondToHHMMSS(Number(use_time.value));
        // console.log(taskType.value);

        if (!taskType.value) {
          use_time.value++;
        } else {
          if (use_time.value === 600) {
            clearInterval(Number(timer));
            Modal.confirm({
              title: "是否延时？",
              okText: "确认",
              onOk: () => {
                delayedTime();
              },
              cancelText: "取消",
              onCancel: () => {
                times();
              },
            });
          }
          if (use_time.value === 0) {
            clearInterval(Number(timer));
            Modal.confirm({
              title: "实验时间已到，您可以选择结束实验或通过延时继续进行实验！",
              okText: "延时",
              onOk: () => {
                delayedTime();
              },
              cancelText: "结束",
              onCancel: () => {
                endVmEnvirment();
              },
            });
          }
          if (use_time.value < 0) {
            use_time.value = 0;
          }
          use_time.value--;
        }
      }, 1000);
    }
    // vnc和ssh切换
    function showChange() {
      console.log(vmInfoData.value.data.vms);
      let currentvm = vmInfoData.value.data.vms[vmCurrentIndex.value];
      let cureentIp = location.protocol + "//" + location.hostname;

      // console.log(cureentIp);
      if (currentInterface.value === "vnc") {
        currentInterface.value = "ssh";
        console.log(currentInterface.value);
        sshUrl.value =
          getVmConnectSetting.SSHHOST +
          ":2222/ssh/host/" +
          currentvm.host_ip +
          "/" +
          currentvm.ssh_port;
        return;
      }
      if (currentInterface.value === "ssh") {
        currentInterface.value = "vnc";
        console.log(currentInterface.value);
        if (currentvm.switch === 1) {
          vmOptions.value.password = getVmConnectSetting.VNCPASS;
          vmOptions.value.wsUrl =
            getVmConnectSetting.VNCPROTOC +
            "://" +
            currentvm.host_ip +
            ":" +
            getVmConnectSetting.VNCPORT +
            "/websockify?vm_uuid=" +
            currentvm.uuid;
        } else {
          let param = {
            action: "switch2Vnc",
            params: {
              type: type,
              opType: opType,
              uuid: uuid.value,
              taskId: taskId,
            },
          };
          // vmApi.switchInterfaceApi({param:{...param}})
        }
      }
    }
    // 延时
    function delayedTime() {
      use_time.value = 1000;
      times();
      // VmOperatesHandle("delay").then((res:any) => {
      //   console.log(res);
      //   if (res.data&&res.data.remaining_time) {
      //     use_time.value=res.data.remaining_time
      //     times()
      //   }
      // });
    }
    // 保存进度
    function saveKvm() {
      VmOperatesHandle("saveKvm").then((res: any) => {
        console.log(res);
        if (res.data) {
          backTo(router, type, 3, routerQuery);
        } else {
          saveExperimentData.value = {
            course: [],
            train: [],
          };
          if (isJsonString(res.msg)) {
            progressVisible.value = true;
            let jsonData = JSON.parse(res.msg);
            console.log(jsonData);
            saveExperimentData.value = jsonData;
          }
        }
      });
    }
    // 关机
    function closeVm() {
      VmOperatesHandle("closeVm").then((res:any) => {
        console.log(res);
        message.success("操作成功");
        console.log(isConnect);
        isConnect.value = false;
      });
    }
    // 重置
    function resetVm() {
      VmOperatesHandle("resetVm");
    }
    // 上传文件
    function upload() {}
    // 下载文件
    function download() {}
    // 复制 / 粘贴
    function copyPaste() {
      // novncEl.value.sendCtrlAltDel(); // 还原
      novncEl.value.sendSelectContent(copyText); // 粘贴
      return;
    }
    // 开始 / 结束录制
    function startEndRecord() {
      if (isScreenRecording.value) {
        VmOperatesHandle("stopRecord").then((res: any) => {
          isScreenRecording.value = false;
          videoTime.value = 0;
          clearInterval(Number(viodeTimer));
          videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
        });
      } else {
        VmOperatesHandle("startRecord").then((res: any) => {
          isScreenRecording.value = true;
          videoTime.value = 0;
          viodeTimer = setInterval(() => {
            videoTime.value++;
            videoTimeText.value = secondToHHMMSS(Number(videoTime.value));
          }, 1000);
        });
      }
    }
    // 共享桌面
    function shareDesktop() {
      console.log("共享桌面");
      Modal.confirm({
        title: "消息提示",
        class: "share-modal vm-modal",
        content: <h2>确认共享桌面吗？</h2>,
        okText: "是",
        cancelText: "否",
        onOk: () => {
          shareVisible.value = true;
        },
        onCancel: () => {},
      });
    }
    // 请求老师远程协助
    function remoteAssist() {
      console.log("请求老师远程协助");
      assistanceVisible.value = true;
    }
    // 全屏
    const isFullScreen: any = inject('isFullScreen')
    const fullScreen = () => {
      visible.value = false
      isFullScreen.value = true
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
          .then((res:any) => {
            resolve(res);
          })
          .catch((err:any) => {
            reject(err);
          });
      }).catch();
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
    function finishExperiment() {
      let modal = Modal.confirm({
        title: `确认结束${opType === "help" ? "演示" : role === 4 ? "实验" : "备课"}吗？`,
        okText: "确认",
        onOk: async () => {
          await finishTest()
          modal.destroy();
        },
        cancelText: "取消",
        onCancel: () => {
          modal.destroy();
        },
      });
    }
    // 检查脚本并结束实验
    async function finishTest() {
      if (isScreenRecording.value) {
            await startEndRecord();
          }
          if (["recommend", "prepare", "help"].includes(opType)) {
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
              // evaluateVisible.value = true;
              // recommendExperimentData.value = res.data;
              endVmEnvirment();
            });
          } else {
            endVmEnvirment();
          }
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
          // if (res.data.length > 0) {
          //   recommendExperimentData.value = res.data;
          //   recommendVisible.value = true;
          // }
          message.success("结束成功");
          backTo(router, type, 3, routerQuery);
        });
      }, 3000);
      console.log("结束脚本入口");
    }
    // 切换抽屉时动画结束后的回调
    function afterVisibleChange(bool: boolean) {
      console.log("visible", bool);
    }
    const toolData = (role === 3 || role === 5)?
      [
        { icon: "icon-quanping", name: "开启 / 全屏", function: fullScreen },
        { icon: "icon-guanbi1", name: "关机", function: closeVm, },
        { icon: "icon-zhongzhi", name: "重置", function: resetVm, },
        // 复制 / 粘贴
        { icon: "icon-fuzhiniantie", name: "选中粘贴", function: copyPaste, },
      ]:
      [
        { icon: "icon-quanping", name: "开启 / 全屏", },
        { icon: "icon-baocun", name: "保存进度", function: saveKvm, },
        { icon: "icon-guanbi1", name: "关机", function: closeVm, },
        { icon: "icon-zhongzhi", name: "重置", function: resetVm, },
        { icon: "icon-shangchuan", name: "上传文件", function: upload, },
        { icon: "icon-xiazai", name: "下载文件", function: download, },
        { icon: "icon-fuzhiniantie", name: "选中粘贴", function: copyPaste, },
        { icon: "icon-kaishijieshuluzhi", name: `${isScreenRecording.value?'结束':'开始'}录制`, function: startEndRecord, },
        { icon: "icon-gongxiangzhuomian", name: "桌面共享", function: shareDesktop, },
        { icon: "icon-yuanchengxiezhu", name: "请求老师远程协助", function: remoteAssist, },
      ];
    const toolList = reactive(toolData)

    // 保存进度 modal
    const progressVisible = ref(false);
    const selectProgressData = ref("");
    const saveExperimentData: any = ref({
      course: [],
      train: [],
    });
    function okProgress() {
      console.log(selectProgressData);
      if (!selectProgressData.value) {
        return;
      }
      let tempArry = selectProgressData.value.split("、");
      let params: any = {
        action: "saveKvm",
        params: {
          type: type,
          opType: opType,
          uuid: uuid.value,
          taskId: taskId,
          replace_id: tempArry[1],
          replace_type: tempArry[0],
        },
      };
      operatesHandle(params)
        .then((res: any) => {
          if (res.data) {
            backTo(router, type, 3, routerQuery);
            progressVisible.value = false;
          }
        })
        .catch((err:any) => {
          console.log(err);
        });
    }
    function closeProgress() {
      progressVisible.value = false;
      selectProgressData.value = "";
    }
    function progressChange(key: any) {
      console.log(key);
    }

    // 桌面共享
    const shareVisible = ref(false);
    const vmUrl = ref("");
    function selectUrl() {
      let env = process.env.NODE_ENV === "development" ? true : false;
      vmUrl.value = `${window.location.protocol}//${window.location.host}${
        env ? "/#/" : "/frontend/#/"
      }vm/vm?wsUrl=${vmOptions.value.wsUrl}`;
    }
    function closeShreModal() {
      shareVisible.value = false;
      vmUrl.value = "";
    }

    // 发送协助信息
    const assistanceVisible = ref(false);
    const assistanceQuestion = ref("");
    function okAssistance() {
      console.log(assistanceQuestion.value);
      if (assistanceQuestion.value.length === 0) {
        message.warn("请输入请求协助内容");
        return;
      }
      let param = {
        action: "question",
        params: {
          type: type,
          opType: opType,
          taskId: taskId,
          question: assistanceQuestion.value,
        },
      };
      vmApi.studentQuestionApi({ param: { ...param } }).then((res:any) => {
        console.log(res);
        assistanceVisible.value = false;
        message.success("请求发送成功");
      });
    }
    // 关闭协助modal
    function closeAssistance() {
      assistanceVisible.value = false;
      assistanceQuestion.value = "";
    }

    // 返回
    const ws: any = inject("ws");
    let historyLength=history.length
    function back() {
      Modal.confirm({
        title: "提示",
        content: "返回实验列表，10分钟不继续实验虚机将关机，30分钟不继续实验虚机将删除！",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          if (ws && allInfo.value?.current?.is_teamed == 1) {
            ws.value.leave(topoinst_id + "_room");
          }
          if (opType === "test" || opType === "prepare") {
            endVmEnvirment();
          } else {
            // if (allInfo.value?.base_info?.task_type.type==4&&allInfo.value?.base_info?.task_type.programing_type==0) {
              router.go(historyLength-history.length-1)
            // }else{
              // router.go(-1)
            // }
            // backTo(router, type, 3, routerQuery);
          }
        },
        onCancel: () => {},
      });
    }
    return {
      visible,
      afterVisibleChange,
      toolList,
      showChange,
      currentInterface,
      delayedTime,
      currentTaskId,
      isScreenRecording,
      experimentTime,
      closeVm,
      courseList,
      progressVisible,
      selectProgressData,
      saveExperimentData,
      okProgress,
      closeProgress,
      progressChange,
      shareVisible,
      vmUrl,
      selectUrl,
      closeShreModal,
      assistanceVisible,
      assistanceQuestion,
      okAssistance,
      closeAssistance,
      // hostIp,
      ipChange,
      classTestTotal,
      testNum,
      okClassTest,
      classTestVisible,
      numToAbc,
      choiceOptions: [
        {id: 1, option: 'hadoop-default.xml'},
        {id: 2, option: 'hadoop-env.sh'},
        {id: 3, option: 'hadoop-site.xml'},
        {id: 4, option: 'configurations.xh'},
      ],
      choiceAnswer,
      answer,
      taskType,
      vmCurrentIndex,
      vms,
      currentvm,
      roleName,
      allInfo,
      finishExperiment,
      back,
    };
  },
});

let courseList = [
  {
    id: 1,
    name: "第一章 课程介绍",
    experimentList: [
      { id: 1, name: "1-1 基于入侵检测的告警分析-外网" },
      { id: 2, name: "1-2 基于入侵检测的告警分析-外网" },
      { id: 3, name: "1-3 基于入侵检测的告警分析-外网" },
      { id: 4, name: "1-4 基于入侵检测的告警分析-外网" },
      { id: 5, name: "1-5 基于入侵检测的告警分析-外网" },
    ],
  },
  {
    id: 2,
    name: "第二章 课程介绍",
    experimentList: [
      { id: 6, name: "2-1 基于入侵检测的告警分析-外网" },
      { id: 7, name: "2-2 基于入侵检测的告警分析-外网" },
      { id: 8, name: "2-3 基于入侵检测的告警分析-外网" },
      { id: 9, name: "2-4 基于入侵检测的告警分析-外网" },
      { id: 10, name: "2-5 基于入侵检测的告警分析-外网" },
    ],
  },
];
</script>

<style lang="less" scoped>
.vm-header-box {
  display: flex;
  // margin-left: 62px;
  margin-right: 50px;
  justify-content: space-between;
  .back {
    margin: 0 15px;
    color: var(--white-65);
    .iconfont {
      margin-right: 4px;
    }
  }
  .left-box {
    color: var(--white-100);
    padding: 22px 0;
    position: relative;
    display: flex;
    .selected {
      width: 460px;
      height: 26px;
      line-height: 26px;
      font-size: var(--font-size-20);
      .name {
        padding: 0 10px;
      }
    }
    .class-test {
      position: relative;
      .sign {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #FF0000;
        position: absolute;
        top: 1px;
        right: -6px;
      }
    }
  }
  .right-box {
    padding: 25px 0;
    display: flex;
    height: 70px;
    line-height: 20px;
    .ip-list {
      padding: 0 20px;
      // border-left: 1px solid #2c3a54;
      .ant-select {
        // border: 1px solid var(--cyan-100);
        color: var(--cyan-100);
        margin-top: -3px;
        :deep(.ant-select-selector) {
          border: 1px solid var(--cyan-100);
          border-radius: 10px;
          color: var(--cyan-100);
          background: rgba(0, 0, 0, 0);
          width: 200px;
          height: 24px;
          line-height: 24px;
          .ant-select-selection-item {
            line-height: 22px;
          }
        }
        &.ant-select-open :deep(.ant-select-selection-item) {
          color: var(--cyan-100);
        }
        :deep(.ant-select-arrow) {
          color: var(--cyan-100);
        }
      }
    }
    .delayed,
    .tool,
    .switch,
    .vnc-change {
      padding: 0 20px;
      border-left: 1px solid #2c3a54;
    }
    .delayed {
      // border: none;
      color: var(--primary-color);
      span:last-child {
        height: 20px;
        line-height: 20px;
        padding: 0 21px;
        color: var(--white-100);
        background-color: var(--primary-color);
        margin-left: 8px;
        border-radius: 10px;
      }
    }
    .tool {
      color: var(--brightBtn);
      .iconfont {
        margin-right: 4px;
        font-size: var(--font-size-20);
        vertical-align: middle;
      }
    }
    .switch {
      .iconfont {
        font-size: var(--font-size-20);
        color: #ff4a3d;
      }
    }
    .vnc-change {
      color: #3094ef;
    }
  }
}
</style>
<style lang="less">
.ant-drawer {
  top: 70px;
  color: var(--white-45);
  .iconfont {
    font-size: var(--base-font-size);
  }
  .ant-drawer-body {
    height: calc(100% - 70px);
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .vm-operate {
    ul {
      margin-top: 4px;
    }
    li {
      height: 43px;
      line-height: 43px;
      padding-left: 20px;
      &:hover {
        color: var(--brightBtn);
      }
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .vm-info {
    height: 330px;
    border-top: 1px solid #2c3a54;
    color: var(--white-85);
    padding: 8px 16px 0 12px;
    h5 {
      color: var(--primary-color);
      font-size: var(--font-size-16);
      padding: 10px 0;
    }
    li {
      height: 31px;
      line-height: 19px;
      padding: 6px 0;
      .iconfont {
        margin-right: 5px;
      }
    }
    .neicun li:last-child {
      margin-bottom: 4px;
    }
    .user li:first-child {
      margin-top: 8px;
    }
  }
}
.ant-drawer-header {
  display: none;
}


.ant-select-dropdown {
  .ant-select-item {
    .ip-name {

    }
    .vm-state {
      display: inline-block;
      width: 24px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: var(--cyan-100);
      border-radius: 2px;
      margin-left: 10px;
      color: var(--white);
      &.open {
        background: var(--cyan-100);
      }
      &.close {
        background: var(--black-45);
      }
    }
  }
}

.vm-class-test-modal {
  .ant-modal-body {
    padding: 10px 40px;
    .subject {
      padding: 8px 12px;
      background: #f4f4f4;
    }
    .right-answer, .keyword {
      margin-left: 12px;
      color: var(--brightBtn);
      padding: 8px 0;
    }
    .choice {
      .answer-list {
        padding-left: 12px;
        .list {
          padding: 8px 0;
        }
      }
    }
    .answer {
      .keyword {
        padding: 0;
      }
      .ant-input {
        margin: 8px 0;
      }
    }
  }
}
</style>
