<template>
  <div>
    <a-drawer class="jupyter-detail-drawer" :visible="true" :closable="false">
      <div class="jupyte-detail-box">
        <div class="jupyte-detail-info">
          <span>在线制作</span>
          <div>
            <a-button type="primary" :disabled="!isSaveImage" @click="stop"
              >停止环境</a-button
            >
            <a-button type="primary" :disabled="!isSaveImage" @click="create"
              >生成环境</a-button
            >
          </div>
        </div>
        <div class="iframe" ref="jupyteIframe">
          <!-- <iframe id="iframe" :src="jupyteUrl" frameborder="0"></iframe> -->
        </div>
        <a-modal class="save-image-modal" :visible="saveVisible"  :closable="false">
          <template v-slot:title>保存镜像</template>
          <div>
            <a-form ref="createForm" :model="createFormData" :rules="rules">
              <a-form-item  label="镜像名称" name="name">
                <a-input v-model:value="createFormData.name" />
              </a-form-item>
              <a-form-item label="添加标签" name="tags">
                <div>
                  <LabelList :tag="createFormData.tags" :recommend="recommend" @selectTag="selectTag" />
                </div>
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
    </a-drawer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  IframeHTMLAttributes,
  onMounted,
  reactive,
  ref,
  toRefs,
  Ref
} from "vue";
import {
  getVmBaseInfoApi,
  createImageApi,
  stopImageApi,
  extendSessionApi,
} from "./api";
import _ from "lodash";
import storage from "src/utils/extStorage";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import LabelList from 'src/components/LabelList.vue'
import Submit from "src/components/submit/index.vue";
import request from "src/api/index";
const http = (request as any).teacherImageResourcePool;
type TreactiveData = {
  id: number;
  jupyteUrl: string;
  jupyteData: {
    ip: string;
    port: string;
  };
  saveVisible: boolean;
  createFormData: {
    name: string;
    description: string;
    tags:any[]
  };

  isSaveImage: boolean; // 是否可以保存
  myTimer: null | NodeJS.Timer;
  timer: null | NodeJS.Timer;
};
export default defineComponent({
  components: {
    LabelList,
    Submit
  },
  setup() {
    const env = process.env.NODE_ENV == "development" ? true : false;
    const route = useRoute();
    const router = useRouter();
    // 镜像名称校验
    const nameValidator =(rule: any, value: any, callback: any) => {
      var reg = /^[a-zA-Z0-9_]+$/g;
      if (value === "") {
        return Promise.reject("请输入镜像名称");
      } else if (value.length > 30) {
        return Promise.reject("镜像名称最长30个字");
      } else if (!reg.test(value)) {
        return Promise.reject("镜像名称只能由英文字母数字下划线组成");
      } else {
        return Promise.resolve();
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
    const jupyteIframe = ref(null);
    const reactiveData: TreactiveData = reactive({
      id: route.query.id as any,
      jupyteUrl: "",
      jupyteData: {
        ip: "",
        port: "",
      },
      saveVisible: false,
      createFormData: {
        name: "",
        description: "",
        tags:[]
      },

      isSaveImage: true, // 是否可以保存
      myTimer: null,
      timer: null,
    });
    
    onBeforeRouteLeave(() => {
      clearInterval(Number(reactiveData.myTimer));
    });
    function extendSess() {
      const fun = (sum: string) => {
        extendSessionApi({ num: sum })
          .then()
          .catch((err:any) => {
            console.error(err);
          });
      };
      reactiveData.myTimer = setInterval(() => {
        const sum = String(Math.random() * 1000000);
        fun(sum);
      }, 10000);
    }
    function init() {
      reactiveData.isSaveImage = true;
      startTimer();
      getVmBaseInfoApi({ id: reactiveData.id }).then((res: any) => {
        if (res.code === 1) {
          reactiveData.jupyteData.ip = res.data.host_ip;
          reactiveData.jupyteData.port = res.data.note_port;
          reactiveData.jupyteUrl =
            "http://" +
            reactiveData.jupyteData.ip +
            ":" +
            reactiveData.jupyteData.port;
          getJupyteIframe(reactiveData.jupyteUrl);
        }
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
          createImageApi(reactiveData.createFormData, {
            id: reactiveData.id,
          }).then((res: any) => {
            if (res.code === 1) {
              saveImageLoad.value=false
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
              // cancel();
              message.success("环境保存成功");
              setTimeout(()=>{
                router.push({
                path: "/teacher/teacherImageResourcePool/OnlineMake",
              });
            },100)
            } else {
              saveImageLoad.value=false
              message.warning(res.msg);
              // message.success("保存成功");
            }
          }).catch((err:any)=>{
            message.warning(err);
            saveImageLoad.value=false
          })
        }
      });
    }
    // 停止环境
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

    // 生成环境
    function create() {
      reactiveData.saveVisible = true;
    }
    function // 开始执行定时器
    startTimer() {
      clearInterval(Number(reactiveData.timer));
      reactiveData.timer = setInterval(() => {
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
                clearInterval(Number(reactiveData.timer));
              } else {
                reactiveData.isSaveImage = false;
              }
              /* eslint-enable */
            }
          });
        } else {
          clearInterval(Number(reactiveData.timer));
          reactiveData.isSaveImage = true;
        }
      }, 1000);
    }
    // 添加iframdom
    async function getJupyteIframe(src: string) {
      var frm: HTMLIFrameElement | any = document.createElement("iframe");
      frm.width = "0";
      frm.height = "0";
      frm.src = src;
      frm.id = "iframe";
      frm.frameBorder = "0";
      var kill = await setTimeout(() => {
      }, 10000);
      //这里使用了网上的判断iframe加载完成的代码，谢谢作者。
      if (frm.attachEvent) {
        frm.attachEvent("onload", function () {
          (
            document.getElementById("iframe") as any
          ).contentWindow.location.reload(true);
          clearTimeout(kill);
          //这里可以执行其它操作
        });
      } else {
        frm.onload = function () {
          clearTimeout(kill);
          (
            document.getElementById("iframe") as any
          ).contentWindow.location.reload(true);
        };
      }
      (jupyteIframe.value as any).appendChild(frm);
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
      init();
      getImgTag()
      // extendSess();
    });
    return {
      ...toRefs(reactiveData),
      createForm,
      rules,
      cancel,
      stop,
      create,
      saveImage,
      jupyteIframe,
      recommend,
      selectTag,
      saveImageLoad
    };
  },
});
</script>


<style lang="less">
.jupyter-detail-drawer {
    
  &.ant-drawer {
    z-index: 1111;
    .ant-drawer-content-wrapper {
      width: 100% !important;
      .ant-drawer-body {
        height: 100%;
        padding: 0px;
      }
    }
  }
}
.image-container {
  padding: 0;
}
.head-tab-box {
  display: none;
}
.jupyte-detail-box {
  height: 100%;
  background: #ffffff;
  padding-top: 4px;
  display: flex;
  flex-direction: column;

  .jupyte-detail-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid #d8d8d8;
    flex-shrink: 0;
    >span{
      font-size: 18px;
      color: #33394B;
    }
    >div{
      button:first-child{
        margin-right: 20px;
        background: #eee;
        color: #535353;
        border-color: #eee;
      }
      button{
        border-radius: 17px;
      }
    }
    > div.link-info {
      margin-right: 25px;
      margin-left: 20px;
      font-size: 16px;
    }

    .flex-right {
      margin-left: auto;
      align-self: center;
      margin-right: 75px;
    }
  }

  .iframe {
    height: 100%;

    #iframe {
      height: 100%;
      width: 100%;
    }
  }
}


  .ant-modal-mask {
    z-index: 1112;
  }

  .ant-modal-wrap {
    z-index: 1112;
  }

</style>