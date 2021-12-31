<template>
  <div class="dataset-detail-box" v-layout-bg>
    <div class="dataset-detail-base-box">
      <div class="img"><img :src="dataSetInfo.cover" alt="" /></div>
      <div class="base">
        <div class="dataset-name">
          <h2>
            <span>{{ dataSetInfo.name }}</span>
          </h2>
          <div class="dataset-detail-btn">
            <span class="iconfont icon-bianji1" @click="editBase" v-if="dataSetInfo.creator === creator"></span>
            <span class="iconfont icon-fanhui" @click="back"></span>
          </div>
        </div>
        <p class="description">
          <span>
            {{ dataSetInfo.description }}
          </span>
        </p>
        <p class="biaoqian-box">
          <span class="iconfont icon-biaoqian"></span>
          <span v-for="item in dataSetInfo.labels" :key="item">
            {{ item.name }}
          </span>
        </p>
        <p class="base-footer">
          <!-- <span class="role-info">
            <i>{{ dataSetInfo.creator ? chinaToPy(dataSetInfo.creator) : '' }}</i>
            {{ roleName() === 'admin' ? '管理员' : roleName() === 'init' ? '初始' : '教师' }}
          </span> -->
          <span class="file-sum">
            <i class="iconfont icon-wenjian"></i>
            <span>{{ dataSetInfo.amount }}</span>
          </span>
          <span class="file-size">
            <i class="iconfont icon-cunchuzhi"></i>
            <span>{{ dataSetInfo.size }}</span>
          </span>
          <span class="file-time">
            <i class="icon-shijian1 iconfont"></i>
            <span>{{ dataSetInfo.created_at ? dataSetInfo.created_at.split(' ')[0] : '' }}</span>
          </span>
          <span class="file-type">
            <i class="icon-shipin2 iconfont"></i>
            <span v-for="ct in dataSetInfo.categorys" :key="ct">{{ ct.name }}</span>
          </span>
        </p>
      </div>
    </div>
    <div class="dataset-detail-file-box">
      <a-tabs default-active-key="document" @change="tabChange" :tabBarGutter="40">
        <a-tab-pane key="document" tab="文档" class="document">
          <div v-if="isShowEditMd" class="view-md">
            <div class="action-upload">
              <span>
                <a-upload accept=".md" :show-upload-list="false" :before-upload="descBeforeUpload">
                  <span class="iconfont icon-upload"></span>
                </a-upload>
              </span>
              <span @click="saveMd" class="iconfont icon-baocun"></span>
            </div>
            <div>
              <antdv-markdown v-model="dataSetInfo.documents" 
               :preview-only="false" class="markdown__editor" 
                :image-upload-url="'/proxyPrefix/dmc/v1.0/upload_image'" 
                :image-upload-data="{status:1}"
                :image-upload-field-name="'upload_file'"
                />
            </div>
          </div>

          <div v-else class="edit-md">
            <div class="action" v-if="dataSetInfo.documents && dataSetInfo.creator === creator">
              <span @click="editMd" class="icon-bianji1 iconfont"></span>
            </div>
            <div class="explain" v-if="dataSetInfo.documents">
              <antdv-markdown v-model="dataSetInfo.documents"  :preview-only="true" class="markdown__editor"/>
            </div>
            <div v-else class="empty-file">
              <Empty :type="emptyType" :text="(dataSetInfo.creator === creator)?'您还未上传说明文档，快去上传吧！':'该数据集，没有上传说明文档'" :height="400" />
              <a-upload accept=".md" :show-upload-list="false" :before-upload="descBeforeUpload" v-if="dataSetInfo.creator === creator">
                <a-button type="primary">上传说明</a-button>
              </a-upload>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="file" tab="文件" force-render>
          <div v-show="fileList.length === 0" class="empty-file">
            <Empty :type="emptyType" :text="(dataSetInfo.creator === creator)?'您还未上传过文件，快去上传吧！':'该数据集，没有上传说明文档'" :height="400" />
            <a-button type="primary" @click="openUpload" v-if="dataSetInfo.creator === creator">上传文件</a-button>
          </div>
          <div v-show="fileList.length > 0">
            <File
              ref="file"
              :fileList="fileList"
              :data_id="dataSetInfo.uid"
              @getDataFile="getDataFileList(true)"
              @openUpload="openUpload"
            />
          </div>
        </a-tab-pane>
      </a-tabs>
      <UploadFile
        v-if="uploadFileVisible"
        ref="upload"
        :data_id="dataSetInfo.uid"
        @getDataFile="getDataFileList(true)"
        @closeUpload="closeUpload"
      />
    </div>
    <a-modal
        class="update-data-set-modal create-form"
        :visible="editVisible"
        title="编辑基本信息"
        :width="650"
        @ok="saveBaseInfo"
        @cancel="closeBaseModel"
      >
        <a-form :model="ForumSearch" :rules="rules" :label-col="{span:16}" :wrapper-col="{span:24}" labelAlign="left" ref="formRef">
          <div class="base-info">
            <a-form-item label="数据名称" name="name">
              <div style="min-width:400px">
                <a-input v-model:value="ForumSearch.name" placeholder="请输入数据名称"  />
              </div>
            </a-form-item>
            <div>
              <label for="datacategory">数据简介</label>
              <a-textarea
                v-model:value="ForumSearch.description"
                placeholder="请输入数据简介 最多250字"
                :maxLength="250"
                :auto-size="{ minRows: 3, maxRows: 3 }"
              />
            </div>
            <div class="cover">
              <label for="cover">
                <span>封面</span>
                <span class="label-hint">建议封面类型为jpg或png</span>
              </label>
              <div class="flex-row clearfix">
                <a-upload
                  list-type="picture-card"
                  v-model:file-list="coverFileList"
                  :before-upload="beforeUpload"
                  @change="handleChange"
                  @preview="handlePreview"
                >
                  <div class="uploading-box">
                    <loading-outlined v-if="loading"></loading-outlined>
                    <!-- <plus-outlined v-else></plus-outlined> -->
                    <!-- <div class="ant-upload-text">Upload</div> -->
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </div>
            <div class="datacategory-box">
              <a-form-item label="分类" name="categoryText">
                <a-radio-group name="radioGroup" v-model:value="ForumSearch.categoryText">
                  <a-radio v-for="(item, index) in navList" :value="item.name" :key="index">
                    {{ item.name }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
            <div>
              <label for="label">标签</label>
              <div class="label-list">
                <span v-for="item in ForumSearch.label" :key="item" class="active">
                  {{ item }}
                  <i class="remove iconfont icon-guanbi" @click="removeLabel(item)"></i>
                </span>
                <span class="edit-box" v-if="ForumSearch.label && ForumSearch.label.length < 3">
                  <span @click="clickCustomLabel" v-show="!openCustom">
                    <span class="iconfont iconbiaoqian"></span>
                    自定义标签
                  </span>
                  <a-input
                    ref="refCustomLabel"
                    @pressEnter="customFinish"
                    @blur="customFinish"
                    @change="changeLabel"
                    v-show="openCustom"
                    v-model:value="customLabelV"
                  />
                </span>
              </div>
            </div>
          </div>
        </a-form>
      </a-modal>
  </div>
</template>
<script  lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed,nextTick} from 'vue'
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import extStorage from "src/utils/extStorage";
const http=(request as any).dataSet
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import UploadFile from './UploadFile.vue'
import File  from './File.vue'
import { getFileType } from 'src/utils/getFileType'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  url?: string;
  preview?: string;
  originFileObj?: any;
}
interface IState{
  customLabelV:string
  documentName:string
emptyType:string
emptyText:string
dataSetInfo:any
creator:number
isEditMd:boolean
isMdContent:boolean
fileList:any
initEditData:() => void
editVisible:boolean
uploadFileVisible:boolean
editBase:() => void
back:() => void
tabChange:(v:any) => void
descBeforeUpload:(val:any) => void
saveMd:() => void
editMd:() => void
openUpload:() => void
closeUpload:() => void
saveBaseInfo:() => void
closeBaseModel:() => void
}
export default defineComponent({
  name: '',
  components: {
    AntdvMarkdown,
    File,
    UploadFile,
    LoadingOutlined
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const {data_id,common,user_id}=route.query
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    // const user_id=lStorage.get('user_id')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,showNav:true,backOff:false,showPageEdit:false})
    const state:IState=reactive({
      customLabelV:'',
      documentName:'',
      emptyText:'123',
      emptyType:'empty',
      dataSetInfo:{},
      creator:Number(lStorage.get('user_id')),
      isEditMd:false,
      isMdContent:true,
      fileList:[],
      uploadFileVisible:false,
      editVisible:false,
      editBase:()=>{
        state.initEditData()
        state.editVisible=true
      },
      initEditData:()=>{
        let obj=[{
          uid:'-1',
          name:'',
          status:'',
          url:state.dataSetInfo.cover,
        }]
        coverFileList.value=obj
        ForumSearch.name=state.dataSetInfo.name
        ForumSearch.description=state.dataSetInfo.description
        ForumSearch.cover=state.dataSetInfo.cover
        ForumSearch.categoryText=state.dataSetInfo.categorys[0].name
        ForumSearch.category=[state.dataSetInfo.categorys[0].name]
        let label=state.dataSetInfo.labels.reduce((pre:any,cur:any)=>{
          pre.indexOf(cur.name)===-1 && pre.push(cur.name)
          return pre
        },[])
        ForumSearch.label=label
        ForumSearch.doc_name=state.dataSetInfo.doc_name
        ForumSearch.documents=state.dataSetInfo.documents
      },
      back:()=>{router.go(-1)},
      tabChange:(v:any)=>{
        if (v === 'file') {
          getDataFileList()
        }
        if (v === 'document') {
          state.isEditMd = false
        }
      },
      descBeforeUpload:(file: any)=>{
        if (getFileType(file.name) === 'md') {
          state.dataSetInfo.doc_name = file.name
          // console.log(file)
          var reader = new FileReader()
          reader.readAsText(file, 'utf-8')
          // console.log(reader)
          reader.onload = () => {
            if (reader.result) {
              state.dataSetInfo.documents = reader.result.toString()
              state.isMdContent = state.dataSetInfo.documents ? true : false
              state.isEditMd = true
            }
          }
        } else {
          message.warn('请上传md文件')
        }
        return false
      },
      saveMd:()=>{
        let obj={
          data_id:data_id,
          content:state.dataSetInfo.documents
        }
        http.editDoc({param:{...obj}}).then((res:any)=>{
          message.success('修改成功')
          detailed()
          state.isEditMd = false
        })
      },
      editMd:()=>{
        state.isEditMd = true
        // this.documents = (this.dataSetInfo as any).documents
      },
      openUpload:()=>{
        state.uploadFileVisible = true
      },
      closeUpload:()=>{
        state.uploadFileVisible = false
      },
      saveBaseInfo:()=>{
        formRef.value.validate().then(() => {
          // console.log(ForumSearch);
          // console.log('验证过');
          http.editInfo({param:{...ForumSearch}}).then((res:any)=>{
            message.success('修改成功')
            detailed()
            state.editVisible=false
          })
      })
        
      },
      closeBaseModel:()=>{
        state.editVisible=false
      },
    })
    const isShowEditMd=computed(()=>{
      return (state.isEditMd && state.isMdContent)?true:false
    })
    function detailed(){
      
      http.detailed({param:{data_id:data_id,common:common,user_id:user_id}}).then((res:any)=>{
        state.fileList=res.data.files                     
        state.dataSetInfo = res.data
        state.dataSetInfo.creator=Number(state.dataSetInfo.creator)
        state.isMdContent = state.dataSetInfo.documents ? true : false
      })
    }
    function getDataFileList(flag = false) {
      http.getDataFileList({param:{ data_id:data_id }}).then((res:any) => {
          if (flag) {
            detailed()
          }
          state.fileList = res.data
      })
    }

    //  基础信息编辑
    var ChunkStatus:any= reactive({})
    const coverFileList = ref<FileItem[]>([])
    const previewImage = ref<string | undefined>('')
    const previewVisible = ref<boolean>(false);
    var loading:Ref<boolean> =ref(false)
    var navList:any= reactive([])
    var openCustom:Ref<boolean> =ref(false)
    const refCustomLabel = ref<HTMLElement>();
    let formRef = ref();

    var ForumSearch:any=reactive({
        user_id:user_id,
        data_id:data_id,
        common:[3,5].includes(Number(lStorage.get('role')))?0:1,
        name:'',
        description:'',
        cover:'',
        categoryText:'',
        category:[],
        label:[],
        doc_name:'',
        documents:'',
    })
    const rules={
        name: [
          { required: true, message: '请输入数据集名称', trigger: 'onfocus'},
        ],
        categoryText: [{ required: true, message: '请选择数据集类型', trigger: 'change' }],
    }
    function getBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    const handlePreview = async (file: FileItem) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    }
    const handleChange = ({ fileList: newFileList }: any) => {
      if(newFileList && newFileList.length){
        let file=newFileList[0]
        const isJpgOrPng = ['image/jpeg','image/png'].includes(file.type)
        coverFileList.value=isJpgOrPng?newFileList:[]
      }
      // coverFileList.value = newFileList;
    };
    function beforeUpload(file:any){
      // console.log(file)
      const isJpgOrPng = ['image/jpeg','image/png'].includes(file.type)
      if (!isJpgOrPng) {
        message.warn('图片类型不正确')
        return false
      }
      loading.value = true
      const fd = new FormData()
      fd.append('upload_file', file)
      http.upLoadCover({param:fd}).then((res:any)=>{
        loading.value = false
        // console.log(res)
        let data=res.data
        let obj=[{
          uid:'-1',
          name:data.name,
          status:'',
          url:data.path,
        }]
        ForumSearch.cover=data.path,
        coverFileList.value=obj
      })
    }
    const handleCancel = () => {
      previewVisible.value = false;
    }
    function removeLabel(val:any){
      let num=ForumSearch.label.indexOf(val)
      if(num!==-1){
        ForumSearch.label.splice(num,1)
      }
    }
    function clickCustomLabel(){
      openCustom.value=true
      nextTick(()=>{
        refCustomLabel.value && refCustomLabel.value.focus()
      })
    }
    function customFinish() {
      // console.log(state.customLabelV)
      if (state.customLabelV.trim()) {
          ForumSearch.label.push(state.customLabelV)
          state.customLabelV = ''
          openCustom.value = false
        } else {
          openCustom.value = false
        }
    }
    function changeLabel() {
      state.customLabelV = state.customLabelV.length > 10 ? state.customLabelV.slice(0, 10) : state.customLabelV
    }
    function categoryList(){
      navList.length=0
      http.categoryList().then((res:IBusinessResp)=>{
          navList.push(...res.data)
      })
    }
    onMounted(()=>{
      categoryList()
      detailed()
    })
    return {...toRefs(state),isShowEditMd,getDataFileList,ForumSearch,rules,coverFileList,ChunkStatus,previewVisible,previewImage,formRef,refCustomLabel,openCustom,loading,navList,handlePreview,handleChange,beforeUpload,handleCancel,removeLabel,clickCustomLabel,customFinish,changeLabel}
  },
})
</script>
<style scoped lang="less">
.dataset-detail-box {
  border-radius: 6px;
  padding-bottom: 20px;
  background: #fff;
  box-shadow: 0px 3px 6px 0px @shadow-color;
  .dataset-detail-base-box {
    display: flex;
    flex-direction: row;
    padding: 20px;

    .img {
      width: 202px;
      height: 180px;
      flex-shrink: 0;
      padding-right: 22px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .base {
      width: 100%;
      display: flex;
      flex-direction: column;

      .dataset-name {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .dataset-detail-btn {
          .iconfont.icon-fanhui:hover,
          .iconfont.icon-bianji1:hover {
            background: @theme-color;
            color: #f7f7f7;
          }
        }

        h2 {
          color: #404040;
          font-size: 16px;
        }

        .data-name {
          display: block;
          width: 520px;
        }

        > div {
          span {
            font-size: 16px;
            width: 38px;
            height: 38px;
            background: #ebeff8;
            margin-left: 11px;
            display: inline-block;
            text-align: center;
            line-height: 38px;
            border-radius: 50%;
            color: @theme-color;
            cursor: pointer;
          }
        }
      }

      .description {
        color: #808080;
        font-size: 14px;
        min-height: 68px;
      }
      .biaoqian-box {
        margin: 14px 0;
        color: #b2b2b2;
        span {
          margin-right: 9px;
          font-size: 12px;
        }
      }

      .base-footer {
        margin-top: auto;
        line-height: 16px;
        display: flex;
        > span {
          margin-right: 18px;
          color: #b2b2b2;
        }

        .role-info {
          i {
            width: 18px;
            height: 18px;
            background: @theme-color;
            display: inline-block;
            border-radius: 50%;
            text-align: center;
            line-height: 18px;
            color: #fff;
          }
        }
        .file-sum ,.file-size,.file-time ,.file-type {
          display: flex;
          align-items: center;
          i {
            margin-right: 5px;
            color: #FFAF47;
          }
          span{
            font-size: 14px;
          }
        }
      }
    }
  }

  .dataset-detail-file-box {
    background: #fff;

    .empty-file {
      text-align: center;
      // height: 800px;

      .empty-action-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;

        .empty-file-action {
          margin-bottom: 20px;
          text-align: center;

          > p {
            font-size: 16px;
            margin-bottom: 13px;
            color: #636363;
          }
        }
      }
    }

    .ant-tabs-bar {
      margin: 0;
    }

    .explain {
      .v-note-wrapper.shadow {
        box-shadow: none !important;
        z-index: 150;
      }
    }

    .ant-tabs-nav-wrap {
      padding-left: 60px;
    }

    > .ant-tabs {
      min-height: 500px;

      .document {
        // padding: 0 60px;

        .view-md,
        .edit-md {
          position: relative;

          .action-upload {
            // margin-right: -40px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 15px;
            span {
              color: @theme-color;
            }
            .iconfont{
              background: #ebeff8;
              width: 38px;
              height: 38px;
              color: @theme-color;
              display: inline-block;
              text-align: center;
              line-height: 38px;
              border-radius: 50%;
              cursor: pointer;
              margin-top: 15px;
              margin-left: 15px;
              &:hover {
                color: #f7f7f7;
                background: @theme-color;
              }
            }
          }

          .action {
            text-align: right;
            padding: 0 10px;
            .icon-bianji1.iconfont {
              // margin-right: -40px;
              &:hover {
                background: @theme-color;
                color: #f7f7f7;
              }
            }

            > span {
              background: #ebeff8;
              width: 38px;
              height: 38px;
              color: @theme-color;
              display: inline-block;
              text-align: center;
              line-height: 38px;
              border-radius: 50%;
              cursor: pointer;
              margin-top: 15px;
              margin-left: 15px;

              &.iconbaocun {
                margin-bottom: 15px;
              }
            }
          }
        }
      }
    }
  }

  .base-info-model {
    .modal-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      line-height: 40px;
      background: transparent !important;
      padding: 0px 28px;

      > span {
        &.iconfont {
          cursor: pointer;
        }
      }
    }

    .modal-body {
      padding-bottom: 70px !important;
    }

    .modal-footer {
      button {
        margin-left: 25px;
        color: #fff;
      }

      .close {
        color: rgba(0, 0, 0, 0.65);
        background-color: #fff;
      }

      .determine {
        background-color: @theme-color;
      }

      .close:hover {
        background-color: rgb(255, 255, 255, 0.7);

        border: 1px solid transparent;
        box-shadow: 0 2px 0 @shadow-color;
      }

      .determine:hover {
        background-color: @theme-color;

        border: 1px solid transparent;
      }
    }
  }
}

.update-data-set-modal {
  .ant-modal-header {
    border-bottom: unset;
    padding-top: 20px;
  }
  .ant-modal-body {
    padding-top: 0;
    .ant-upload.ant-upload-select-picture-card {
      border: unset;
    }
    .ant-radio-group {
      label.ant-radio-wrapper {
        margin-right: 28px;
      }
    }
  }
  .ant-modal-footer {
    text-align: center;
    border-top: unset;
    padding-bottom: 30px;
  }
  .ant-modal-content {
    .ant-modal-close {
      top: -4px;
    }
  }
}
.markdown__editor {
  min-height: 300px;
}
.create-form {
        padding: 0px 22px 30px 22px;
        display: flex;
        flex-direction: row;

        .base-info>div {
            margin-bottom: 32px;
        }

        >div:nth-child(1) {
            width: 50%;
            padding-right: 21px;
        }

        >div:nth-child(2) {
            width: 50%;
            padding-left: 21px;
            border-left: 1px solid #ebebeb;
        }

        label {
            margin: 9px 0px;
            display: block;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 400;

            .label-hint {
                color: rgba(0, 0, 0, 0.25);
                font-size: 12px;
                margin-left: 13px;
            }
            i{
              color: #ff0918;
            }
        }

        .datacategory-list {
            label {
                display: inline-block;
                margin: 0;
                padding: 0;
                margin-right: 28px;

                span.ant-radio+* {
                    padding-left: 4px;
                    padding-top: 12px;
                }
            }

        }

        .label-list {
            display: flex;
            flex-wrap: wrap;

            >span {
                margin: 0px 5px 0px 0px;
                padding: 5px 15px;
                background: #ebebeb;
                margin-bottom: 5px;
                position: relative;
                border-radius: 5px;
                margin-right: 10px;

                >.remove {
                    position: absolute;
                    font-size: 12px;
                    background: red;
                    width: 14px;
                    height: 14px;
                    top: -5px;
                    right: -5px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 14px;
                    cursor: pointer;
                }

                &.active {
                    background: @theme-color;
                    color: #ffffff;
                }
            }

            .edit-box {
                margin: 0px 5px 0px 0px;
                padding: 0px 0px;
                background: #ebebeb;
                margin-bottom: 5px;
                position: relative;
                width: 120px;
                cursor: pointer;

                >span {
                    // padding: 0px 15px;
                    display: block;
                    text-align: center;
                    width: 100%;
                    line-height: 30px;
                    color: @theme-color;
                    border: 1px solid @theme-color;
                    border-radius: 5px;
                    background: #ffffff;

                    &:hover {
                        background: #F8EFFF;
                    }
                }
            }


        }

        .all-label {
            // border-top: 0.1px dashed #c9c4c4;
            margin-top: 20px;

            label {
                color: #c9c4c4;
            }

            .all-label-list {
                display: flex;
                flex-wrap: wrap;

                >span {
                    margin: 0px 5px 0px 0px;
                    padding: 2px 15px;
                    background: #ffffff;
                    margin-bottom: 5px;
                    border: 1px dashed #c9c4c4;
                    border-radius: 4px;

                    &.active {
                        background: @theme-color;
                        color: #ffffff;
                    }
                }

                .custom-label {
                    color: @theme-color;

                    >span {
                        vertical-align: revert;
                    }
                }
            }
        }


        .cover {
            .flex-row {
                display: flex;
                :deep(.ant-upload.ant-upload-select-picture-card){
                  border: 1px dashed rgba(52, 131, 226, 0.61);
                }
                // .showImg{
                //   border: 1px dashed rgba(52, 131, 226, 0.61);
                // }
                // >div {
                    // width: 104px;
                    // height: 104px;
                    // border-radius: 5px;
                    // margin-right: 30px;

                    .ant-upload.ant-upload-select-picture-card {
                        width: 100%;
                        height: 100%;
                    }
                    .ant-upload-picture-card-wrapper {
                        height: 100%;
                    }

                    .ant-upload.ant-upload-select-picture-card>.ant-upload {
                        padding: 0px;
                    }

                    .uploading-box {
                        width: 100%;
                        height: 100%;
                        background-image: url("src/assets/images/dateSet/uploading.png");
                        background-repeat: no-repeat;
                        background-size: 100% 100%;

                        >i {
                            font-size: 30px;
                        }
                    }

                    >img {
                        width: 100%;
                        height: 100%;
                    }
                // }
            }
        }

        .file-upload-box {
            margin-bottom: 42px;

            .ant-upload {
                button {
                    background: @theme-color;
                    border-radius: 5px;
                    color: #ffffff;
                    .icon-upload{
                        font-size: 12px;
                        padding-right: 6px;
                    }
                }
            }

            .progress-box {
                max-height: 500px;
                overflow-y: auto;
                overflow-x: hidden;

                >div {
                    padding-bottom: 10px;
                    background: #ffffff;
                    box-shadow: 0px 0px 40px 0px rgb(242 197 162 / 27%);
                }

                .progress-item {
                    display: flex;
                    flex-direction: row;
                    margin-top: 15px;

                    padding: 16px;
                    border-radius: 6px;

                    >span:nth-child(1) {
                        width: 24px;
                        height: 26px;
                        flex-shrink: 0;

                        svg {
                            vertical-align: middle;
                            width: 24px;
                            height: 26px;
                            // fill: #fff;
                            .st7{
                                fill: #FFFFFF;
                            }
                            .st6 {
                                fill-rule: evenodd;
                                clip-rule: evenodd;
                                fill: #107C41;
                            }
                        }

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    >span:nth-child(2) {
                        width: 100%;
                        margin: 0 10px;

                        >.item-top {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            list-style: none;
                            line-height: 30px;

                            >span:nth-child(1) {
                                color: #404040;
                                font-size: 14px;
                            }

                            i {
                                display: none;
                                width: 20px;
                                font-style: normal;
                                height: 20px;
                                border-radius: 50%;
                                border: 1px solid @theme-color;

                                text-align: center;
                                line-height: 17px;
                                font-size: 12px;
                                color: @theme-color;
                                cursor: pointer;
                            }

                            .icon-shanchu {
                                color: #9A9A9A;
                                padding: 0 7px;

                                &.iconfont {
                                    cursor: pointer;
                                }

                                &:hover {
                                    //width: 32px;
                                    //height: 32px;
                                    background-color: #EBEFF8;
                                    border-radius: 50%;
                                }
                            }
                        }

                        .file-size {
                            color: #000000;
                            opacity: 0.5;
                        }
                    }

                    // >span:nth-child(3) {
                    //     flex-shrink: 0;
                    //     width: 20px;
                    //     height: 20px;


                    // }
                }

                div>.progress-item:hover {
                    >:nth-child(2) {

                        i {
                            display: inline-block;
                        }
                    }
                }

                .detail-box {
                    padding: 0 16px;
                    transition: 0.5s;
                    overflow: hidden;

                    .detail-name {
                        color: rgba(64, 64, 64, 0.45);
                        font-size: 12px;
                    }

                    .ant-progress-status-success {
                        .ant-progress-bg {
                            // background-color: rgba($success-color, 1);
                            background-color: rgba(@theme-color, 1);
                        }
                    }

                    .ant-progress-bg {
                        background-color: rgba(@theme-color, 0.4);
                        height: 4px !important;
                    }
                }

                .look-btn {
                    margin-left: 16px;
                    cursor: pointer;
                }
            }

            .chunk-list {
                >div {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }
            }
        }

        .md-upload-box {
            .ant-upload {
                button {
                    background: @theme-color;
                    border-radius: 5px;
                    color: #ffffff;
                    .icon-upload{
                        font-size: 12px;
                        padding-right: 6px;
                    }
                }
            }

            .md-info {


                >div {
                    display: flex;
                    flex-direction: row;
                    padding: 6px 64px;
                    background: #ffffff;
                    margin-top: 15px;

                    >:nth-child(1) {
                        width: 100%;
                    }

                    >:nth-child(2) {
                        flex-shrink: 0;
                        width: 20px;
                        height: 20px;

                        i {
                            display: none;
                            width: 20px;
                            font-style: normal;
                            height: 20px;
                            border-radius: 50%;
                            border: 1px solid @theme-color;

                            text-align: center;
                            line-height: 17px;
                            font-size: 12px;
                            color: @theme-color;
                            cursor: pointer;
                        }
                    }
                }

                >div:hover {
                    >:nth-child(2) {

                        i {
                            display: block;
                        }
                    }
                }

            }
        }
    }
:deep(.ant-modal-body .ant-form-item-control){
  flex: 0 0 100%;
} 
:deep(.ant-radio-group){
  display: flex;
}   
</style>
<style lang="less">
.base-info{
  :deep(.ant-modal-body .ant-form-item-control){
    flex: 0 0 100%;
  }
  :deep(.ant-form-item-control){
    flex: 0 0 100%;
  }  
}
</style>
