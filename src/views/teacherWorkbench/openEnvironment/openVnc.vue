<template>
  <div>
    <a-drawer :visible="true" :closable="false" class="vm-environment-drawer">
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
                  <span class="vm-list-title">ssh端口：</span>
                  <span>{{ vmData.ssh_port ? vmData.ssh_port : "" }}</span>
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
                <a-button :disabled="loading" type="primary"
                  >上传文件</a-button
                >
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
                        item.status === "loading"
                          ? "(" + item.progress + ")"
                          : ""
                      }}</span
                    >
                    <span
                      v-if="item.status === 'loading'"
                      class="iconfont icon-shanchu"
                      @click="removeFile(item.upload, Number(index))"
                    ></span>
                  </div>
                  <div
                    class="progress-box"
                    v-if="item.progress && item.progress !== '100%'"
                  >
                    <span
                      class="upload-progress-bar"
                      :style="{ width: item.progress }"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="upload-tip">
              <div class="upload-title">上传说明</div>
              <div class="upload-desc">
                仅允许同时上传一个大小不超过500MB的文件，文件类型不限制，上传完后请到指定目录寻找上传的文件。
              </div>
              <div class="upload-path">
                Linux：{{ vmData.base_upload_path }}
              </div>
            </div>
            <div class="text-center">
              <a-space>
                <a-button
                  :disabled="loading || !isSaveImage"
                  type="primary"
                  @click="stop"
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
              <a-form-item has-feedback label="镜像名称" name="name">
                <a-input v-model:value="createFormData.name" />
              </a-form-item>
              <a-form-item has-feedback label="镜像描述" name="description">
                <a-textarea
                  v-model:value="createFormData.description"
                  placeholder="请输入描述"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-item>
            </a-form>
          </div>
          <template v-slot:footer>
            <div>
              <a-button @click="cancel">取消</a-button>
              <a-button type="primary" @click="saveImage">确定</a-button>
            </div>
          </template>
        </a-modal>
      </div>
    </a-drawer>
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
  Ref
} from "vue";
import {
  getVmBaseInfoApi,
  createImageApi,
  stopImageApi,
  vmUploadApi,
  extendSessionApi,
} from "../api";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import storage from "src/utils/extStorage";
import _ from "lodash";
import VueNoVnc from "src/components/noVnc/noVnc.vue";
import uploadFile from "src/request/uploadFile";

type TreactiveData={
      test: number,
      id: number | any,
      saveVisible: boolean,
      createFormData: {
        name: string,
        description: string,
      },
      vmData: any,
      isSaveImage: boolean,
      timer: null|NodeJS.Timer,
      myTimer: null|NodeJS.Timer,
      vmOptions: {
        userName:string,
        password: string, // vncpassword
        wsUrl: string, // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
      upload: null|any,
}

export default defineComponent({
  components: {
    "vue-no-vnc": VueNoVnc,
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
      name: [{ validator: nameValidator, trigger: "change" }],
      description: [
        {
          required: false,
          max: 200,
          message: "镜像描述最长200个字",
          trigger: "change",
        },
      ],
    };
    const createForm:any = ref(null);
    const loading:Ref<boolean> = ref(false);
    const vncLoading:Ref<boolean> = ref(false);
    const fileList:Ref<any> = ref([]);
    const reactiveData:TreactiveData = reactive({
      test: 2,
      id: route.query.id,
      saveVisible: false,
      createFormData: {
        name: "",
        description: "",
      },
      vmData: {},
      isSaveImage: true,
      timer: null,
      myTimer: null,
      vmOptions: {
        userName:"",
        password: "", // vncpassword
        wsUrl: "", // "ws://192.168.101.150:8888/websockify?vm_uuid=c417fb05-c2f4-4cc9-9791-ecac23c448c5"
      },
      upload: null,
    });
    provide("vncLoading", vncLoading);
    onMounted(() => {
      nextTick(() => {
        initVm();
      });
      extendSess();
    });

    function extendSess() {
      const fun = (sum: string) => {
        extendSessionApi({ num: sum })
          .then()
          .catch((err) => {
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
        getVmBaseInfoApi({ id: reactiveData.id as any as number })
          .then((res: any) => {
            loading.value = false;
            reactiveData.vmData = res.data;
            reactiveData.vmOptions.password = "vncpassword";
            reactiveData.vmOptions.wsUrl =
              "ws://" +
              res.data.base_ip +
              ":8888/websockify?vm_uuid=" +
              res.data.uuid;
          })
          .catch((err) => {
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
        router.push({
          path: "/teacher/Workbench/?currentTab=0",
        });
      });
    }
    // 取消
    function cancel() {
      (createForm.value as any).resetFields();
      reactiveData.saveVisible = false;
    }
    // 保存镜像
    function saveImage() {
      (createForm.value as any).validate().then((valid: any) => {
        if (valid) {
          createImageApi(
            {
              name: reactiveData.createFormData.name,
              description: reactiveData.createFormData.description,
            },
            { id: reactiveData.id as any }
          ).then((res: any) => {
            message.success("保存成功");
            const iamgeSaveStatus = storage.lStorage.get("iamgeSaveStatus")
              ? storage.lStorage.get("iamgeSaveStatus")
              : [];
            if (_.some(iamgeSaveStatus, { id: reactiveData.id })) {
              iamgeSaveStatus.forEach((item: any, index: number) => {
                if (reactiveData.id === item.id) {
                  iamgeSaveStatus[index].beginIime = new Date();
                }
              });
            } else {
              iamgeSaveStatus.push({
                id: reactiveData.id,
                beginIime: new Date(),
              });
            }
            storage.lStorage.set(
              "iamgeSaveStatus",
              JSON.stringify(iamgeSaveStatus)
            );
            reactiveData.isSaveImage = false;
            startTimer();
            cancel();
          });
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
          }
          (fileList.value as any)[i].upload = "";
          (fileList as any).value.push({});
          (fileList as any).value.pop();
        },
        progress: (e: ProgressEvent) => {
          if (e.total > 0) {
            (fileList as any).value[i].progress = Number(
              Number((e.loaded / e.total) * 100).toFixed(2)
            );
            (fileList as any).value[i] = Object.assign(
              (fileList as any).value[i],
              { progress: (fileList as any).value[i].progress }
            );
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
      vmUploadApi({ file_path: path }, { id: reactiveData.id as any }).then(
        (res) => {
          console.log(res);
        }
      );
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
        if (_.some(iamgeSaveStatus, { id: reactiveData.id })) {
          iamgeSaveStatus.forEach((item: any, index: number) => {
            if (reactiveData.id === item.id) {
              // 10分钟秒数
              /* eslint-disable */
              var time =
                new Date().getTime() - new Date(item.beginIime).getTime();
              if (time / 1000 / 60 > 10) {
                reactiveData.isSaveImage = true;
                iamgeSaveStatus.splice(index, 1);

                storage.lStorage.set(
                  "iamgeSaveStatus",
                  JSON.stringify(iamgeSaveStatus)
                );
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
    };
  },
});
</script>


<style lang="less">
.vm-environment-drawer {
  z-index: 1111 !important;
  .ant-btn > span{
  font-size: 14px;
  }
  .ant-btn-primary{
    box-shadow: none;
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
        margin-top:14px;
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
          .iconshanchu {
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
              &.iconshanchu {
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
            background: rgba(var(--purpleblue-6), 0.5);
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
  .list-row{
    font-size: 14px;
    margin-bottom: 14px;  
    color:rgba(@black,0.65);
  }
  .vm-list-title {
    @extend .list-title;
    font-size: 14px;
  }
  .dataset-url {
    // padding: 10px 0;
    color:rgba(@black,0.65);
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
  .text-center{
    margin-top: 40px;
    display: flex;
    justify-content: center;
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
