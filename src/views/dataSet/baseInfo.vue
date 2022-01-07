<template>

  <div class="edit-base-info create-form">
    <a-form :model="ForumSearch" :rules="rules" ref="formRef">
      <div class="base-info">
        <h2 class="create-title">基本信息</h2>
        <a-form-item label="数据名称" name="name">
          <a-input v-model:value="ForumSearch.name" placeholder="请输入数据名称" />
        </a-form-item>
        <div>
          <label for="datacategory">数据简介</label>
          <a-textarea
            v-model:value="ForumSearch.description"
            placeholder="请输入数据简介 最多250字"
            :maxLength="250"
            :auto-size="{ minRows: 4, maxRows: 7 }"
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
          <a-form-item label="选择类型" name="categoryText">
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
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,nextTick} from 'vue'
import SetList from './SetList.vue'
import {useStore} from "vuex"
import extStorage from "src/utils/extStorage";
import request from 'src/api/index'
const http=(request as any).dataSet
import { getFileType } from 'src/utils/getFileType'
import { Modal,message } from 'ant-design-vue';
import { RuleObject } from "ant-design-vue/es/form/interface";
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
}
export default defineComponent({
  name: '',
  components: {
   SetList
  },
  props:['data',''],
  setup: (props,context) => {
    
    
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    var ChunkStatus:any= reactive({})
    const coverFileList = ref<FileItem[]>([])
    const previewImage = ref<string | undefined>('')
    const previewVisible = ref<boolean>(false);
    var loading:Ref<boolean> =ref(false)
    var navList:any= reactive([])
    var openCustom:Ref<boolean> =ref(false)
    const refCustomLabel = ref<HTMLElement>();
    let formRef = ref();
    const state:IState=reactive({
      customLabelV:'',
      documentName:''
    })
    var ForumSearch:any=reactive({

    })
    async function fileListValidator(rule: RuleObject, value: string) {
      // console.log(state.ForumSearch.fileList)
      if (Object.keys(ForumSearch.fileList).length===0) {
        return Promise.reject("请选择数据集");
      } else {
        return Promise.resolve();
      }
    }
    const rules={
        name: [
          { required: true, message: '请输入数据集名称', trigger: 'blur'},
        ],
        categoryText: [{ required: true, message: '请选择数据集类型', trigger: 'change' }],
        fileList: [
        { required: true, message: "请选择数据集" },
        { validator: fileListValidator, message: "请选择数据集" },
      ],  
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
      // console.log(val)
      // console.log(state.customLabelV)
      state.customLabelV = state.customLabelV.length > 10 ? state.customLabelV.slice(0, 10) : state.customLabelV
    }
    onMounted(()=>{
     
    })
    return {props,...toRefs(state),rules,formRef,getFileType,handleChange,handlePreview,ChunkStatus,ForumSearch,coverFileList,beforeUpload,loading,previewVisible,previewImage,handleCancel,navList,removeLabel,clickCustomLabel,customFinish,changeLabel,openCustom};
  },
})
</script>
<style scoped lang="less">
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
                    background: var(--purpleblue-6);
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
                    color: var(--purpleblue-6);
                    border: 1px solid var(--purpleblue-6);
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
                        background: var(--purpleblue-6);
                        color: #ffffff;
                    }
                }

                .custom-label {
                    color: var(--purpleblue-6);

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
                    background: var(--purpleblue-6);
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
                                border: 1px solid var(--purpleblue-6);

                                text-align: center;
                                line-height: 17px;
                                font-size: 12px;
                                color: var(--purpleblue-6);
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
                            background-color: rgba(var(--purpleblue-6), 1);
                        }
                    }

                    .ant-progress-bg {
                        background-color: rgba(var(--purpleblue-6), 0.4);
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
                    background: var(--purpleblue-6);
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
                            border: 1px solid var(--purpleblue-6);

                            text-align: center;
                            line-height: 17px;
                            font-size: 12px;
                            color: var(--purpleblue-6);
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
</style>
