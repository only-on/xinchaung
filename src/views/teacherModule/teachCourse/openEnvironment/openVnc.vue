<template>
  <div>
    <!-- <a-drawer :visible="true" :closable="false" class="vm-environment-drawer"> -->
      <div class="vm-environment-setting">
        <a-row>
          <a-col :span="6" class="vm-info-list">
            <div>
              <h3 class="list-title">远程连接信息</h3>
              <a-row class="list-row">
                <a-col :span="12">
                  <span class="vm-list-title">用户名：</span>
                  <span>{{ vmData.ssh_user ? vmData.ssh_user : "" }}</span>
                </a-col>
                <a-col :span="12">
                  <span class="vm-list-title">IP：</span>
                  <span>{{ vmData.host_ip ? vmData.host_ip : "" }}</span>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="12">
                  <span class="vm-list-title">密码：</span>
                  <span>{{ vmData.ssh_pass ? vmData.ssh_pass : "" }}</span>
                </a-col>
                <a-col :span="12">
                  <span class="vm-list-title">{{ vmData?.classify === "Windows" ? "RDP" : "SSH" }}端口：</span>
                  <span>{{ vmData?.classify === "Windows" ? vmData?.rdp_port : vmData?.ssh_port }}</span>
                </a-col>
              </a-row>
            </div>
            <a-divider dashed />
            <div>
              <h3 class="list-title">数据集目录</h3>
              <div class="dataset-url">{{ vmData.base_mount_path }}</div>
            </div>
            <a-divider dashed />
            <div class="upload-wrap">
              <!-- icon="upload" -->
              <a-upload :before-upload="beforeUpload" :show-upload-list="false">
                <a-button :disabled="loading" type="primary">上传文件</a-button>
              </a-upload>
              <div class="upload-file-list">
                <div
                  class="upload-file-item"
                  v-for="(item, index) in fileList"
                  :key="item.uid"
                >
                  <div class="upload-file-base">
                    <span class="icon-fujian iconfont"></span>
                    <span
                      >{{ item.name
                      }}{{
                        item.status === "loading" ? "(" + item.progress + "%)" : ""
                      }}</span
                    >

                    <span
                      v-if="item.status === 'loading'"
                      class="iconfont icon-guanbi cancelUpload"
                      @click="removeFile(item.upload, Number(index))"
                    ></span>
                  </div>
                  <div
                    v-if="item.progress && item.progress !== '100%'"
                    class="progress-box"
                  >
                    <div
                      :class="
                        item.progress == '100%'
                          ? 'upload-progress-bar successbar'
                          : 'upload-progress-bar'
                      "
                      :style="{ width: item.progress + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="upload-tip">
              <div class="upload-title">上传说明</div>
              <div class="upload-desc">
                仅允许上传大小不超过500MB的文件，文件类型不限制，上传完后请到指定目录寻找上传的文件。
              </div>
              <div class="upload-path">文件目录：{{vmData?.classify === "Windows" ? "C:\\":"/simpleupload"}}</div>
            </div>
            <div class="text-center">
              <a-space>
                <a-button :disabled="loading || !isSaveImage" @click="stop" :class="isSaveImage?'stopenv':''"
                  >停止环境</a-button
                >
                <a-button
                  :disabled="loading || !isSaveImage"
                  type="primary"
                  @click="create"
                  >生成环境</a-button
                >
              </a-space>
            </div>
          </a-col>
          <a-col :span="18" class="envronment-setting-container">
            <vm-loading v-if="vncLoading || loading"></vm-loading>
            <vue-no-vnc
              background="rgb(40,40,40)"
              :options="vmOptions"
              refName="refName"
              ref="novncEl"
            />
          </a-col>
        </a-row>
        <a-modal :visible="saveVisible" :closable="false">
          <template v-slot:title>保存镜像</template>
          <div>
            <a-form ref="createForm" :model="createFormData" :rules="rules">
              <a-form-item  label="镜像名称" name="name">
                <a-input v-model:value="createFormData.name" />
              </a-form-item>
              <a-form-item label="添加标签" name="tags">
                <LabelList :tag="createFormData.tags" :recommend="recommend" @selectTag="selectTag" />
              </a-form-item>
              <a-form-item  label="镜像描述" name="description">
                <a-textarea
                  v-model:value="createFormData.description"
                  placeholder="请输入描述"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-item>
            </a-form>
          </div>
          <template #footer>
            <Submit @submit="saveImage" @cancel="cancel" :loading="saveImageLoad"></Submit>
          </template>
        </a-modal>
      </div>
    <!-- </a-drawer> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  ref,
  nextTick,
  provide,
  watch,
  Ref,
} from "vue";
import {
  getVmBaseInfoApi,
  createImageApi,
  stopImageApi,
  vmUploadApi,
  extendSessionApi,
} from "./api";
import LabelList from 'src/components/LabelList.vue'
import Submit from "src/components/submit/index.vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import storage from "src/utils/extStorage";
import _ from "lodash";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import uploadFile from "src/request/uploadFile";
import vmLoading from "src/components/noVnc/vmLoading.vue"
import request from "src/api/index";
const http = (request as any).teacherImageResourcePool;
type TreactiveData = {
  test: number;
  id: number | any;
  saveVisible: boolean;
  createFormData: {
    name: string;
    description: string;
    tags:any[]
  };
  vmData: any;
  isSaveImage: boolean;
  timer: null | NodeJS.Timer;
  myTimer: null | NodeJS.Timer;
  vmOptions: {
    userName: string;
    password: string; // vncpassword
    wsUrl: string; // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
  };
  upload: null | any;
};

export default defineComponent({
  components: {
    "vue-no-vnc": VueNoVnc,
    LabelList,
    Submit,
    vmLoading,
  },
  setup() {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const route = useRoute();
    const router = useRouter();
    // 镜像名称校验
    const nameValidator = (rule: any, value: any, callback: any) => {
      var reg = /^[a-zA-Z0-9_]+$/g;
      if (value === "") {
        callback("请输入镜像名称");
      } else if (value.length > 30) {
        callback("镜像名称最长30个字");
      } else if (!reg.test(value)) {
        callback("镜像名称只能由英文字母数字下划线组成");
      } else {
        callback();
      }
    };
    const rules: any = {
      name: [{required: true, validator: nameValidator, trigger: "blur" }],
      description: [
        {required: false,max: 200, message: "镜像描述最长200个字",trigger: "change",},
      ],
      tags: [
        {required: true,validator: fileListValidator,trigger: "blur"},
      ],
    };
    async function fileListValidator() {
      console.log(reactiveData.createFormData.tags);
      if (reactiveData.createFormData.tags.length === 0) {
        message.warn("请选择镜像标签");
        return Promise.reject("请选择镜像标签");
      } else if(!(reactiveData.createFormData.tags.includes('vnc') || reactiveData.createFormData.tags.includes('jupyter'))){
        message.warn("vnc或jupyter标签需至少选择一个");
        return Promise.reject();
      }else if((reactiveData.createFormData.tags.includes('vnc') && reactiveData.createFormData.tags.includes('jupyter'))){
        message.warn("vnc或jupyter标签需只需任选其一");
        return Promise.reject();
      }
      else {
        createForm.value.clearValidate('tags')
        return Promise.resolve();
      }
    }
    const selectTag=async (val:any,arr:any)=>{
      console.log(val);
      fileListValidator()
    }
    const createForm: any = ref(null);
    const loading: Ref<boolean> = ref(false);
    const vncLoading: Ref<boolean> = ref(false);
    const fileList: Ref<any> = ref([]);
    const novncEl:Ref<any>=ref(null)
    const reactiveData: TreactiveData = reactive({
      test: 2,
      id: route.query.id,
      saveVisible: false,
      createFormData: {
        name: "",
        description: "",
        tags:[]
      },
      vmData: {},
      isSaveImage: true,
      timer: null,
      myTimer: null,
      vmOptions: {
        userName: "",
        password: "", // vncpassword
        wsUrl: "", // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
      upload: null,
    });
    provide("vncLoading", vncLoading);
    provide("loading", loading);
    function extendSess() {
      const fun = (sum: string) => {
        extendSessionApi({ num: sum })
          .then()
          .catch((err:any) => {
            console.error(err);
          });
      };
      (reactiveData as any).myTimer = setInterval(() => {
        const sum = String(Math.random() * 1000000);
        fun(sum);
      }, 10000);
    }
    function initVm() {
      loading.value = true;
      reactiveData.isSaveImage = true;
      startTimer();
      if (reactiveData.id) {
        loading.value = true;
        getVmBaseInfoApi({ id: (reactiveData.id as any) as number })
          .then((res: any) => {
            loading.value = false;
            reactiveData.vmData = res.data;
            reactiveData.vmOptions.password = "vncpassword";
            reactiveData.vmOptions.wsUrl =
              "ws://" + res.data.base_ip + ":8888/websockify?vm_uuid=" + res.data.uuid;
              if (novncEl.value) {
                novncEl.value.connectVnc()
              }

          })
          .catch((err:any) => {
            message.error(err);
          });
      }
    }
    function create() {
      reactiveData.saveVisible = true;
    }
    function stop() {
      stopImageApi({ id: reactiveData.id as any }).then((res: any) => {
        message.success("环境停止成功");
        setTimeout(()=>{
          router.push({
          path: "/teacher/teacherImageResourcePool/OnlineMake",
        });
        },100)
      });
    }
    // 取消
    function cancel() {
      (createForm.value as any).resetFields();
      reactiveData.saveVisible = false;
    }
    var saveImageLoad: Ref<boolean> = ref(false);
    // 保存镜像
    function saveImage() {
      (createForm.value as any).validate().then((valid: any) => {
        if (valid) {
          saveImageLoad.value=true
          createImageApi(
            {
              name: reactiveData.createFormData.name,
              description: reactiveData.createFormData.description,
              tags:reactiveData.createFormData.tags,
            },
            { id: reactiveData.id as any }
          ).then((res: any) => {
            saveImageLoad.value=false
            message.success("保存成功");
            const iamgeSaveStatus = storage.lStorage.get("iamgeSaveStatus")
              ? storage.lStorage.get("iamgeSaveStatus")
              : [];
            if (_.some(iamgeSaveStatus, { id: Number(reactiveData.id) })) {
              iamgeSaveStatus.forEach((item: any, index: number) => {
                if (reactiveData.id == item.id) {
                  iamgeSaveStatus[index].beginIime = new Date();
                }
              });
            } else {
              iamgeSaveStatus.push({
                id: Number(reactiveData.id),
                beginIime: new Date(),
              });
            }
            storage.lStorage.set("iamgeSaveStatus", JSON.stringify(iamgeSaveStatus));
            reactiveData.isSaveImage = false;
            startTimer();
            // cancel();
            setTimeout(()=>{
                router.push({
                path: "/teacher/teacherImageResourcePool/OnlineMake",
              });
            },100)
          }).catch(()=>{
            saveImageLoad.value=false
          })
        }
      });
    }
    // 上传前
    function beforeUpload(file: any) {
      if (file.size / 1024 / 1024 >= 500) {
        message.warn("上传文件不能超过500MB");
        return false;
      }
      (fileList as any).value.push(file);

      let i = fileList.value.findIndex((item: any) => {
        return item.uid === file.uid;
      });

      (fileList as any).value[i].progress = 0;
      (fileList as any).value[i].status = "loading";

      const body = {
        file: file,
        uploadFiled: "file",
        upload_path: "temp/",
      };

      (fileList as any).value[i].upload = new uploadFile({
        url: env
          ? "/proxyPrefix/api/instance/uploads/file"
          : "/api/instance/uploads/file",
        body,
        success: (res: any) => {
          if (res.code === 1) {
            (fileList.value as any)[i].status = "finish";
            (fileList.value as any)[i].progress = "100%";
            if (res.data.full_url) {
              vmUpload(res.data.full_url);
            }
          } else {
            (fileList.value as any)[i].progress = 0;
            message.warn(res.msg)
          }
          (fileList.value as any)[i].upload = "";
          (fileList as any).value.push({});
          (fileList as any).value.pop();
        },
        progress: (e: ProgressEvent) => {
          if (e.total > 0) {
            let prog: any = Number(Number((e.loaded / e.total) * 100).toFixed(2))as any
            (fileList as any).value[i].progress = prog==100 ? 99 : prog;
            (fileList as any).value[i] = Object.assign((fileList as any).value[i], {
              progress: (fileList as any).value[i].progress,
            });
            (fileList as any).value.push({});
            (fileList as any).value.pop();
          }
        },
        abort: (xhr: XMLHttpRequest) => {
          console.log("终止上传成功", xhr);
        },
        error: (err) => {
          console.log(err);
        },
      });

      (fileList as any).value[i].upload.request();
      return false;
    }
    // 虚拟机上传
    function vmUpload(path: string) {
      vmUploadApi({ file_path: path }, { id: reactiveData.id as any }).then((res:any) => {
        console.log(res);
      });
    }

    // 移除文件
    function removeFile(xhr: any, index: number) {
      if (xhr) {
        xhr.abortUpload();
      }
      fileList.value.splice(index, 1);
    }
    // 开始执行定时器
    function startTimer() {
      clearInterval(reactiveData.timer as any);
      (reactiveData.timer as any) = setInterval(() => {
        var iamgeSaveStatus = storage.lStorage.get("iamgeSaveStatus")
          ? storage.lStorage.get("iamgeSaveStatus")
          : [];
        if (_.some(iamgeSaveStatus, { id: Number(reactiveData.id) })) {
          iamgeSaveStatus.forEach((item: any, index: number) => {
            if (reactiveData.id == item.id) {
              // 10分钟秒数
              /* eslint-disable */
              var time = new Date().getTime() - new Date(item.beginIime).getTime();
              if (time / 1000 / 60 > 10) {
                reactiveData.isSaveImage = true;
                iamgeSaveStatus.splice(index, 1);

                storage.lStorage.set("iamgeSaveStatus", JSON.stringify(iamgeSaveStatus));
                clearInterval(reactiveData.timer as any);
              } else {
                reactiveData.isSaveImage = false;
              }
              /* eslint-enable */
            }
          });
        } else {
          clearInterval(reactiveData.timer as any);
          reactiveData.isSaveImage = true;
        }
      }, 1000);
    }
    const recommend:any=reactive([])
    function getImgTag() {
      recommend.length=0
      http.getImgTag().then((res: any) => {
        let  data= res.data;
        let arr=[{name:'vnc',value:'vnc'},{name:'jupyter',value:'jupyter'}]
        recommend.push(...arr)
        data.forEach((v:any) => {
          recommend.push({name:v.name,value:v.name})
        });
      });
    }
    onMounted(() => {
      nextTick(() => {
        initVm();
      });
      getImgTag()
      // extendSess();
    });
    return {
      ...toRefs(reactiveData),
      rules,
      create,
      stop,
      createForm,
      cancel,
      saveImage,
      beforeUpload,
      provide,
      removeFile,
      loading,
      fileList,
      novncEl,
      recommend,
      selectTag,
      saveImageLoad,
      vncLoading,
    };
  },
});
</script>

<style lang="less" scoped>
.vm-environment-setting {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 2;
  overflow: hidden;
}
.vm-environment-drawer {
  z-index: 1111 !important;
  .ant-btn > span {
    font-size: 14px;
  }
  .ant-btn-primary {
    box-shadow: none;
    border-radius: 17px;
  }
  .ant-drawer-content-wrapper {
    width: 100% !important;
    .ant-drawer-body {
      height: 100% !important;
      padding: 0px !important;
    }
  }
}
.vm-info-list {
  padding: 20px 15px 20px 15px !important;
}
.image-container,
.vm-environment-setting,
.vm-environment-setting > div,
.envronment-setting-container,
.vm-info-list {
  height: 100%;
}
.image-container {
  color: #666;
  padding: 0;
  .head-tab-box {
    display: none;
  }
}
.vm-info-list {
  background: #fff;
  padding: 40px 30px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  .upload-wrap {
    height: 300px;
    .upload-file-list {
      max-height: 260px;
      overflow: auto;
      .upload-file-item {
        margin-top: 14px;
        .upload-file-base {
          padding: 0 5px;
          display: flex;
          > span:nth-child(1),
          > span:nth-child(3) {
            flex-shrink: 0;
          }
          > span:nth-child(4) {
            flex-shrink: 0;
          }
          .cancelUpload {
            font-size: 14px;
            cursor: pointer;
          }
          > span:nth-child(2) {
            width: 100%;
            margin: 0 15px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          &:hover {
            background: rgba(var(--purpleblue-6), 0.1);
            > span:nth-child(3) {
              flex-shrink: 0;
              &.cancelUpload {
                display: block;
                cursor: pointer;
              }
            }
          }
        }
        .progress-box {
          height: 5px;
          background: #f3f3f3;
          border-radius: 4px;
          position: relative;
          .upload-progress-bar {
            position: absolute;
            display: inline-block;
            height: 100%;
            background: var(--purpleblue-6);
            border-radius: 3px;
          }
          .successbar {
            background: var(--green-6);
          }
        }
      }
    }
  }
  .list-title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    margin-bottom: 1em;
    font-size: 16px;
  }
  .list-row {
    font-size: 14px;
    margin-bottom: 14px;
    color: var(--black-65);
  }
  .vm-list-title {
    &:extend(.list-title);
    font-size: 14px;
  }
  .dataset-url {
    // padding: 10px 0;
    color: var(--black-65);
  }
  .upload-tip {
    background: #fafafa;
    padding: 10px;
    > div {
      padding-bottom: 10px;
    }
    .upload-title {
      color: #050101;
      font-size: 14px;
      opacity: 0.45;
    }
    .upload-desc {
      color: #050101;
      font-size: 14px;
      opacity: 0.35;
    }
    .upload-path {
      color: #050101;
      font-size: 14px;
      opacity: 0.45;
    }
    // > div:first-child {
    //   font-size: 15px;
    //   color: #333;
    // }
  }
  .text-center {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    .ant-btn {
      &.stopenv {
        background: #eee;
        color: #535353;
        border-color: #eee;
      }

    }
  }
}
.ant-modal {
  z-index: 11111;
}

.ant-modal-mask,
.ant-modal-wrap {
  z-index: 11111 !important;
}
.ant-select-dropdown {
  z-index: 1111111;
}
.ant-message {
  z-index: 1111 !important;
}
.has-success.has-feedback .ant-form-item-children-icon {
  position: absolute;
  top: 40px;
  right: -10px;
}
</style>
