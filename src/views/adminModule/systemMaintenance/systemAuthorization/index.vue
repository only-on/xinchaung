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
                        <a-button  class='brightBtn step-btn' :disabled='authorizationData.authorization_code?false:true' type='primary' @click="copyCode">复制授权码</a-button>
                        <span class="titinfo">提示：复制授权码找授权管理人员获得授权文件</span>
                    </div>
                </div>
                <div class="step">
                    <div class="steptit">步骤二</div>
                    <div class="step-row">
                        <div class="step-text">导入授权文件</div>
                        <div class="upload-code-file">
                          <!-- accept=".so" -->
                            <a-upload
                            accept=".so"
                            name="file"
                            :multiple="false"
                            :showUploadList="false"
                            :beforeUpload="beforeUpload"
                            >
                                <a-button :disabled='authorizationData.authorization_code?false:true' type='primary'>选择文件</a-button>
                            </a-upload>
                            <div
                            class="progress-box active"
                            v-if="authorizationFile.progress"
                            >
                            <a-progress :percent="authorizationFile.progress" />
                            <!-- <span
                                @click="removeFile"
                                class="iconfont icon-shanchu"
                            ></span> -->
                            </div>
                        </div>
                    </div>
                    <div class="step-row">
                        <div class="step-text">文件名称</div>
                        <div class="divbox">
                            <span class="filename" :title="authorizationFile.filename">{{authorizationFile.filename}}</span>
                            <span v-if="authorizationFile.filename"  @click="removeFile" class="icon iconfont icon-shanchu"></span>   
                        </div>
                    </div>
                </div>
                <div class="step">
                    <div class="steptit">步骤三</div>
                    <div class="step-row-power">
                        <div class="step-text">授权系统</div>
                            <a-button
                            type="primary"
                            :disabled='authorizationFile.url?false:true'
                            @click="authorizationFun"
                            >授权</a-button>
                        </div>
                    </div>
                </div>
        </div>
        <div class="settingList">
            <div class="tit">授权设置</div>
            <div class="tableHeight">
              
            <a-spin :spinning="loading" size="large" tip="Loading...">
                <a-config-provider>
                    <a-table rowKey='module' :columns="columns" :data-source="data" :pagination=" tableData.total > 10
                          ? {
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
                       <template #bodyCell="{ column, record }">
                             <template v-if="column.dataIndex === 'auth_time_left'">
                              <span :class="is_expired?'redColor':''">{{record.auth_time_left}}</span>
                            </template>
                         </template>
                      </a-table>
                    <template #renderEmpty>
                      <div v-if="!loading"><Empty type="tableEmpty" /></div>
                    </template>
                </a-config-provider>
            </a-spin>
            </div>
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
      h,
      Ref
    } from "vue";
    import uploadFile from "src/request/uploadFile";
    import cleanModal from './cleanModal.vue'
    import { message, Modal } from "ant-design-vue";
    import request from "src/api/index";
    import { useRouter ,useRoute } from 'vue-router';
    const router = useRouter();
    const http = (request as any).systemMaintenance;
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
const is_expired:any=ref()
var loading: Ref<boolean> = ref(false);
const statisData:any=ref()
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit:10,
});
columns.value = [
  {
    title: "模块",
    dataIndex: "module",
    key: "module",
  },
  {
    title: "授权类型",
    dataIndex: "auth_type",
    key: "auth_type",
  },
  {
    title: "授权人数",
    dataIndex: "auth_number",
    key: "auth_number",
  },
  {
    title: "授权时间",
    dataIndex: "auth_time_left",
  }
];
const authorizationData:any=reactive({
    authorization_code:''
})
const authorizationFile:any=reactive({
    progress:0,
    ilename:'',
    url:'',
})
const reactiveData:any=reactive({
    isShowBtn:false,
    upload:{}
})
function onChange(page: any, pageSize: any) {
  tableData.page=page
}
function onShowSizeChange(current: any, size: any) {
  tableData.page=1
  tableData.limit=size
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
      http.settingAutoKeyApi().then((res: any) => {
        authorizationData.authorization_code = res.data?.auth_key;
        // authorizationData.authorization_code ='34c9d5719cc75b75330df7b34a490b07ed1316bedae365966538766e22cb554e.d84e1e8e0a064bd62a858ad3b7dbf475'
       getPowerList()
  });
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
            ? "/api/instance/uploads/file"
            : "/api/instance/uploads/file",
          body,
          success: (res: any) => {
            if (res.status === 1) {
              authorizationFile.url = res.data.full_url;
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
        }
        authorizationFile.filename='';
        authorizationFile.progress=0;
        authorizationFile.url=''
      }
      // 授权
      async function  authorizationFun() {
        if (!authorizationFile.url) {
          message.warn("请上传授权文件");
          return;
        }
        if (!authorizationData.authorization_code) {
          message.warn("请输入授权码");
          return;
        }
        // reactiveData.isShowBtn = true;
        let params: any = {
          auth_code: authorizationData.authorization_code,
          auth_file: authorizationFile.url,
        };
        let silent:boolean=false
        await http.saveSettingApi({param:params}).then((res: any) => {
          // reactiveData.authorizationData.authorization_code = res.authNumber;
            message.success('授权成功！')
            silent=false
        }).catch(()=>{
          silent=true
        })
        getPowerList(silent)
    }
      // 获取系统日志时间配置

      function getPowerList(silent?:boolean){
        loading.value = true;
        http.powerList({silent:silent?silent:false}).then((res:any)=>{
          loading.value = false
          data.value=res.data.auth_data
          tableData.total=res.data.auth_data?.length
          authorizationData.authorization_code =res.data?.auth_code
          is_expired.value=res.data.is_expired
          // authorizationData.authorization_code ='34c9d5719cc75b75330df7b34a490b07ed1316bedae365966538766e22cb554e.d84e1e8e0a064bd62a858ad3b7dbf475'
        }).catch((res:any)=>{
          console.log(res);
          loading.value = false
          data.value=res.data?.auth_data
          tableData.total=res.data?.auth_data?.length
          authorizationData.authorization_code =res.data?.auth_code
          is_expired.value=res.data.is_expired
        })
      }
      onMounted(()=>{
        getPowerList()
      })
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
    .settingList{
      .tableHeight{
        // height:420px;
        // overflow-y:auto;
      }
    }
    .filename{
      display: inline-block;
      width: 100px;
      white-space:nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .divbox{
      display: flex;
      align-items: center;
    }
    .redColor{
      color: red;
    }
</style>