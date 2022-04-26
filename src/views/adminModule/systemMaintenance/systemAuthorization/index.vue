<template>
    <div class='systemAuthorization'>
        <div class="setting">
            <div class="tit">授权设置</div>
            <div class="settingStep">
                <div class="step">
                    <div class="steptit">步骤一</div>
                    <div class="step-row">
                        <a-button class="step-btn" type='primary' @click="createAuthorizationCode()">生成授权码</a-button>
                        <a-input
                        v-model:value="authorizationData.authorization_code"
                        ref="codeRef"
                        style="width:281px;pointer-events: none; background: #fafafa"
                ></a-input>
                    </div>
                    <div class="step-row">
                        <a-button class='brightBtn step-btn' type='primary' @click="copyCode">复制授权码</a-button>
                        <span class="titinfo">提示：复制授权码找授权管理人员获得授权文件</span>
                    </div>
                </div>
                <div class="step">
                    <div class="steptit">步骤二</div>
                    <div class="step-row">
                        <div class="step-text">导入授权文件</div>
                        <div class="upload-code-file">
                            <a-upload
                            name="file"
                            :multiple="false"
                            :showUploadList="false"
                            :beforeUpload="beforeUpload"
                            >
                                <a-button type='primary'>选择文件</a-button>
                            </a-upload>
                            <div
                            class="progress-box active"
                            v-if="authorizationFile.progress"
                            >
                            <a-progress :percent="authorizationFile.progress" />
                            <span
                                @click="removeFile"
                                class="iconfont icon-shanchu"
                            ></span>
                            </div>
                        </div>
                    </div>
                    <div class="step-row">
                        <div class="step-text">文件名称</div>
                        <div>文件名称1111111111111
                            <span class="icon iconfont icon-shanchu"></span>   
                        </div>
                    </div>
                </div>
                <div class="step">
                    <div class="steptit">步骤三</div>
                    <div class="step-row-power">
                        <div class="step-text">授权系统</div>
                            <a-button
                            type="primary"
                            :disabled="reactiveData.isShowBtn"
                            @click="authorizationFun"
                            >授权</a-button>
                        </div>
                    </div>
                </div>
        </div>
        <div class="settingList">
            <div class="tit">授权设置</div>
            <a-table
            rowKey='username'
            :columns="columns"
            :data-source="data"
            :pagination="
                tableData.total > 10
                ? {
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                    total: tableData.total,
                    current: tableData.page,
                    pageSize: tableData.limit,
                    onChange: onChange,
                    onShowSizeChange: onShowSizeChange,
                    }
                : false
            "
            >
            </a-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import {
      defineComponent,
      ref,
      onMounted,
      reactive,
      inject,
      h
    } from "vue";
    import uploadFile from "src/request/uploadFile";
    import cleanModal from './cleanModal.vue'
    import { message, Modal } from "ant-design-vue";
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [
        { name: "系统授权", componenttype: 0 }
      ],
      showContent: true,
      componenttype: undefined,
      showNav:true,
    });
    const env = process.env.NODE_ENV == "development" ? true : false;
const codeRef = ref(null);
const columns: any = ref();
const data: any = ref([]);
const statisData:any=ref()
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
columns.value = [
  {
    title: "模块",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "授权类型",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "授权人数",
    dataIndex: "className",
    key: "className",
  },
  {
    title: "授权时间",
    dataIndex: "score",
    key: "score",
  }
];
const authorizationData:any=reactive({
    authorization_code:''
})
const authorizationFile:any=reactive({
    progress:0
})
const reactiveData:any=reactive({
    isShowBtn:false,
    upload:{}
})
function onChange(page: any, pageSize: any) {
  tableData.page=page
//   getStugrandsList()
}
function onShowSizeChange(current: any, size: any) {
  tableData.page=1
  tableData.limit=size
//   getStugrandsList()
}
function modalEl(){
  return h(
    "div",
    { style: { color: "red", "font-size": "20px", margin: "auto" } },
    "本次生成会导致以前授权文件失效,您确定要重新生成授权码"
  );
};
 // 生成授权码
 function createAuthorizationCode() {
        Modal.confirm({
          title: "提示信息",
          content: modalEl(),
          width: "615px",
          okText:"确定",
          cancelText:"取消",
          onOk: () => {
            console.log("ok");
            settingAutoKey()
          },
          onCancel: () => {
            console.log("cancel");
          },
        });
      }
// 设置授权码
function settingAutoKey() {
        // settingAutoKeyApi().then((res: any) => {
        //   authorizationData.authorization_code = res.datas?.key?res.datas.key:res.data.key;
        // });
}
function copyCode(e: Event) {
        e.preventDefault();
        (codeRef.value as any).select();
        document.execCommand("Copy"); //
}
   // 上传授权文件
 function  beforeUpload(file: any) {
        console.log(file);
        authorizationFile.filename = file.name;
        let body = {
          file_url: file,
          file_id: 0,
        };
        reactiveData.upload = new uploadFile({
          url: env
            ? "/proxyPrefix/authorization/setting/upload-file"
            : "/authorization/setting/upload-file",
          body,
          success: (res: any) => {
            if (res.status === 1) {
              authorizationFile.url = res.data.url;
              reactiveData.isShowBtn = false;
              authorizationFile.progress = 100;
            } else {
              message.error("上传失败");
            }
            reactiveData.upload = "";
          },
          progress: (e: ProgressEvent) => {
            if (e.total > 0) {
              authorizationFile.progress = Number(
                Number((e.loaded / e.total) * 100).toFixed(2)
              );
                authorizationFile.progress =
                authorizationFile.progress == 100
                  ? 99
                  : authorizationFile.progress;
            }
          },
          abort: (xhr: XMLHttpRequest) => {
            console.log("终止上传成功", xhr);
          },
          error: (err:any) => {
            console.log(err);
          },
        });
        reactiveData.upload.request();
        return false;
      }
      function removeFile() {
        if (reactiveData.upload) {
            reactiveData.upload.abortUpload();
            // authorizationFile = {};
        }
      }
      // 授权
      function authorizationFun() {
        if (!authorizationFile.filename) {
          message.warn("请上传图片");
          return;
        }
        if (!authorizationData.authorization_code) {
          message.warn("请输入授权码");
          return;
        }
        // reactiveData.isShowBtn = true;
        let params: any = {
          params: authorizationFile.filename,
          authNumber: authorizationData.authorization_code,
          url: authorizationFile.url,
        };
        //  saveSettingApi().then((res: any) => {
        //   reactiveData.authorizationData.authorization_code =
        //     res.authNumber;
        //   method.getAuthorizationInfo();
        // });
    }
      // 获取系统日志时间配置
</script>
<style lang="less" scoped>
    .systemAuthorization{
        background-color: var(--white-100);
        padding: 30px;
        .tit{
            font-size: 16px;
            margin-bottom: 20px;
        }
        .settingStep{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            .step{
                // width: 30%;
                height:168px;
                background-color:#FCFCFC;
                box-shadow: 0 0 0 2px var(--gray-3);
                border-radius: 4px;
                .steptit{
                    width:65px;
                    height: 25px;
                    background-color:#808294;
                    color: var(--white-100);
                    border-radius: 4px;
                    border-bottom-left-radius: 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .step-row-power{
                    display: flex;
                    align-items: center;
                    padding: 0 30px;
                    margin-top: 50px;
                    .step-text{
                        margin-right: 20px;
                    }
                }

                .step-row{
                    display: flex;
                    padding: 0 30px;
                    margin-bottom: 20px;
                    align-items: center;
                    .step-btn{
                        margin-right: 20px;
                    }
                    .titinfo{
                        line-height: 38px;
                    }
                    .icon-shanchu{
                        color: var(--primary-color);
                    }
                    .step-text{
                        margin-right: 20px;
                        width:90px;
                    }
                }
               
            }
        }
    }
</style>