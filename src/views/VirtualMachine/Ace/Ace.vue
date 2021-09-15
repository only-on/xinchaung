<template>
  <layout :VmData="data">
    <template v-slot:header>
      <div class="vm-header-student" v-if="roleType">
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
        </div>

        <div class="vm-header-title">{{ taskBaseInfo.base_info.name }}</div>
        <div class="vm-header-right">
          <a-button type="danger">结束实验</a-button>
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
              }}
            </span>
          </span>
          <a-button type="primary">延时</a-button>
        </div>
      </div>
      <div v-else class="vm-header-teacher">
        <div class="vm-header-left">
          <a-button type="primary" @click="back">返回</a-button>
        </div>

        <div class="vm-header-title">{{ taskBaseInfo.base_info.name }}</div>
        <div class="vm-header-right">
          <a-button type="danger">结束备课</a-button>
        </div>
      </div>
    </template>
    <template v-slot:right>
      <div class="ace-loading" v-if="!aceLoading">loading...</div>
      <div class="ace-box">
        <div class="ace-left">
          <p><span class="icon-wenjianjia iconfont"></span>project</p>
          <ul class="webide-file-list">
            <li
              class="webide-file-item"
              v-for="(item, index) in fileListData"
              :key="item.file_id"
              :class="currentIndex === index ? 'active' : ''"
              @click="selectFile(index)"
            >
              {{ item.file_name }}
            </li>
          </ul>
        </div>
        <div class="ace-right" v-layout-bg="'../assets/common/layout_bg1.jpg'">
          <div class="ace-action">
            <span @click="saveFileData"><i class="iconfont icon-baocun"></i>保存</span>
            <span @click="openBackupModal"><i class="iconfont icon-beifen"></i>备份</span>
            <span><i class="iconfont icon-huigun"></i>回滚</span>
            <span @click="run"><i class="iconfont icon-yunhang"></i>运行</span>
          </div>
          <ace
            v-model:value="content"
            lang="html"
            theme="monokai"
            style="height: 100%"
            :options="options"
          ></ace>
          <div
            class="ace-result"
            :style="{ height: openOrCloseResultStatus ? '200px' : '35px' }"
          >
            <div class="ace-result-title">
              <span @click="openOrClose"
                >收起结果<i
                  class="iconfont"
                  :class="
                    openOrCloseResultStatus ? 'icon-zhankai' : 'icon-shouqi'
                  "
                ></i
              ></span>
            </div>
            <div class="ace-result-box">
              <div class="ace-result-content"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </layout>
  <a-modal :visible="backupVisible" @cancel="cancelBackupModal" @ok="okBackupModal">
    <a-input v-model:value="version_name"/>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, Ref, toRefs } from "vue";
import layout from "../VmLayout/VmLayout.vue";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import ace from "src/components/ace/ace.vue";
import "src/components/ace/options";
import {
  getTaskInfo,
  getVersionList,
  getFileList,
  createVersion,
  switchFile,
  saveFile
} from "src/utils/webideInspect";
import { message, Modal } from "ant-design-vue";
import { secondToHHMMSS } from "src/utils/vncInspect";

export default defineComponent({
  components: {
    layout,
    ace,
  },
  setup(props, { emit }) {
    const openOrCloseResultStatus: Ref<boolean> = ref(true);
    const options = {
      enableBasicAutocompletion: true,

      enableSnippets: true,

      enableLiveAutocompletion: true,
    };
    let aceLoading: Ref<boolean> = ref(false);
    setTimeout(() => {
      aceLoading.value = true;
    }, 3000);
    let content = ref("");
    const roleType = ref(true);
    const router = useRouter();
    const route = useRoute();
    const reactiveData: {
      taskBaseInfo: any;
      fileListData: any[];
      currentIndex: number;
    } = reactive({
      taskBaseInfo: {
        base_info: {
          name: "1212",
        },
      },
      fileListData: [],
      currentIndex: 0,
    });
    let timer: NodeJS.Timer | null = null; // 实验剩余时间计时器
    let experimentTime: Ref<any> = ref({
      h: 0,
      m: 0,
      s: 0,
    });
    let use_time: number = 900;
    const querys: any = route.query;
    const type = querys.type;
    const opType = querys.opType;
    // const taskId = querys.taskId;
    const taskId = 534341;
    let version_id = 0;
    const version_name: Ref<string> = ref("");
    let file_name: string | null = null;
    let file_id: string = "";
    const backupVisible:Ref<boolean>=ref(false)
    let last_version_name=""
    onBeforeRouteLeave(() => {
      clearInterval(Number(timer));
    });
    onMounted(async () => {
      getTaskInfoData();
      let versions: any = await getVersionListData();
      console.log(versions);
      if (versions.length > 0) {
        version_id = versions[0].id;
        version_name.value = versions[0].version_name;
      } else {
        version_name.value = "namefile";
        let versionsData = await createVersionData();
        console.log(versionsData);
        let versions: any = await getVersionListData();
        console.log(versions);
        if (versions.length > 0) {
          version_id = versions[0].id;
          version_name.value = versions[0].version_name;
        }
      }
      let fileListData: any = await getFileListData();
      console.log(fileListData);
      reactiveData.fileListData = fileListData.file_list;
      file_id = reactiveData.fileListData[reactiveData.currentIndex].file_id;
      getCurrentSWitchFile();
      clearInterval(Number(timer));
      timer = setInterval(() => {
        experimentTime!.value = secondToHHMMSS(use_time);

        use_time--;
        if (use_time === 600) {
          Modal.confirm({
            title: "是否延时？",
            okText: "确认",
            onOk: () => {
              console.log("延时");
            },
            cancelText: "取消",
            onCancel: () => {},
          });
        }
        if (use_time === 0) {
          console.log("结束");

          clearInterval(Number(timer));
        }
      }, 1000);
    });
    let navData = [
      // { name: "虚拟机", key: "vm", icon: "icon-xuniji" },
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
    function openOrClose() {
      openOrCloseResultStatus.value = !openOrCloseResultStatus.value;
    }

    // 获取实验详情
    function getTaskInfoData() {
      let params = {
        type: type,
        opType: opType,
        taskId: taskId,
      };
      getTaskInfo(params).then((res) => {
        reactiveData.taskBaseInfo = res?.data;
        console.log(reactiveData.taskBaseInfo);
        use_time = res?.data.current.used_time;
      });
    }
    // 获取版本列表
    function getVersionListData() {
      let params = {
        type: type,
        opType: opType,
        taskId: taskId,
      };
      return new Promise((resolve: any, reject: any) => {
        getVersionList(params)
          .then((res) => {
            console.log(res);
            resolve(res?.data);
          })
          .catch((err) => {
            reject(err);
          });
      }).catch();
    }
    // 获取文件列表
    function getFileListData() {
      let params = {
        type: type,
        opType: opType,
        taskId: taskId,
        version_id: version_id,
        file_name: file_name,
      };
      return new Promise((resolve: any, reject: any) => {
        getFileList(params)
          .then((res: any) => {
            console.log(res);
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }).catch();
    }

    // 创建版本
    function createVersionData() {
      let params = {
        type: type,
        opType: opType,
        taskId: taskId,
        version_name: version_name.value,
      };
      return new Promise((resolve: any, reject: any) => {
        createVersion(params)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }).catch();
    }

    // 切换文件
    function getCurrentSWitchFile() {
      let params = {
        type: type,
        opType: opType,
        taskId: taskId,
        file_id: file_id,
      };

      switchFile(params).then((res) => {
        console.log(res);
        content.value = res?.data.file_content;
      });
    }
    function run() {
      content.value = "111111111111111111";
    }

    function selectFile(index: number) {
      reactiveData.currentIndex = index;
      file_id = reactiveData.fileListData[reactiveData.currentIndex].file_id;
      getCurrentSWitchFile();
    }

    // 保存文件
    function saveFileData() {
       let params = {
        type: type,
        opType: opType,
        taskId: taskId,
        file_id: file_id,
        file_content:content.value
      };
      saveFile(params).then((res:any)=>{
        console.log(res);
        if (res.status===1) {
          message.success("保存成功")
        }
      })
    }

    // 打开备份modal
    function openBackupModal() {
      console.log(1212);
      last_version_name=version_name.value
      version_name.value=""
      backupVisible.value=true
    }

    // 取消备份modal
    function cancelBackupModal() {
      backupVisible.value=false
      version_name.value=last_version_name
    }

    // 确认备份，提交
    function okBackupModal() {
      console.log(version_name.value);
      
      createVersionData().then((res:any)=>{
        console.log(res);
        if (res.status===1) {
          message.success("备份成功")
           backupVisible.value=false
        }
        console.log(version_name.value);
      })
    }
    return {
      roleType,
      back,
      data,
      options,
      content,
      openOrClose,
      openOrCloseResultStatus,
      aceLoading,
      run,
      ...toRefs(reactiveData),
      experimentTime,
      backupVisible,
      selectFile,
      saveFileData,
      openBackupModal,
      cancelBackupModal,
      okBackupModal,
      version_name
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
      }
      .vm-header-title {
        color: @white;
      }
      .vm-header-right {
        .vm-time {
          color: @red-6;
          margin: 0 10px;
          .iconfont {
            margin-right: 3px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .vm-main {
    .vm-content {
      .vm-content-right {
        .ace-loading {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(#515151, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          color: @white;
        }
        .ace-box {
          display: flex;
          flex-direction: row;
          height: 100%;
        }
        .ace-left {
          width: 200px;
          flex-shrink: 0;
          background: #272822;
          order: 1;
          color: @white;
          padding: 10px;
          p {
            margin-bottom: 0;
            span {
              margin-right: 5px;
            }
          }
          .webide-file-list {
            padding: 0 10px;
            .webide-file-item {
              line-height: 30px;
              padding: 0 10px;
              &.active {
                background: #000000;
                cursor: pointer;
              }
              &:hover {
                background: #000000;
                cursor: pointer;
              }
            }
          }
        }
        .ace-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #2f3129;
          order: 0;
          .ace-action {
            flex-shrink: 0;
            color: @white;
            padding-left: 20px;
            line-height: 35px;
            white-space: nowrap;
            word-break: break-all;
            > span {
              font-size: 14px;
              margin-right: 25px;
              cursor: pointer;
              transition: 0.2s;
              &:hover {
                color: @theme-color;
              }
              > i {
                font-size: 12px;
                margin-right: 2px;
              }
            }
          }
          .ace-result {
            height: 235px;
            padding-left: 10px;
            background: #2f3129;
            display: flex;
            flex-direction: column;
            transition: 0.2s;
            .ace-result-title {
              color: @white;
              font-size: 12px;
              padding-left: 10px;
              line-height: 35px;
              flex-shrink: 0;
              cursor: pointer;
              .iconfont {
                font-size: 12px;
                margin-left: 3px;
              }
            }
            .ace-result-box {
              background: #000000;
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>
