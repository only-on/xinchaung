<template>
  <div class="createOrEditWrap" v-layout-bg>
    <div class="create-form">
      <div class="base-info">
        <h2 class="create-title">基本信息</h2>
        <div>
          <label for="name">
            <i>*</i>
            数据名称
          </label>
          <a-input placeholder="请输入数据名称" v-model="ForumSearch.name" />
        </div>
        <div>
          <label for="datacategory">数据简介</label>
          <a-textarea
            v-model="ForumSearch.description"
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

            <!-- <div>
              <a-upload
                name="upload_file"
                list-type="picture-card"
                class="avatar-uploader"
                v-model:file-list="coverFileList"
                :show-upload-list="true"
                :before-upload="beforeUpload"
                @preview="handlePreview"
              >
                <div class="uploading-box">
                  <loading-outlined v-if="loading"></loading-outlined>
                </div>
              </a-upload>
            </div>
            <div v-if="ForumSearch.cover" class="showImg">
              <img :src="ForumSearch.cover" alt="avatar" />
            </div> -->
          </div>
        </div>
        <div class="datacategory-box">
          <label for="datacategory">
            <i>*</i>
            选择类型
          </label>
          <div class="datacategory-list">
            <a-radio-group name="radioGroup" v-model="ForumSearch.category">
              <a-radio v-for="(item, index) in navList" :value="item.name" :key="index">
                {{ item.name }}
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <div>
          <label for="label">标签</label>
          <div class="label-list">
            <span v-for="(item, index) in labelList" :key="index" class="active">
              {{ item }}
              <i class="remove iconfont iconguanbi" @click="removeLabel(item)"></i>
              <!-- <span @click="removeLable(item)" class="remove iconfont iconguanbi"></span> -->
            </span>
            <span class="edit-box" v-if="labelList && labelList.length < 3">
              <span @click="clickCustomLabel" v-show="!openCustom">
                <span class="iconfont iconbiaoqian"></span>
                自定义标签
              </span>
              <a-input
                ref="refCustomLabel"
                @keyup.enter="customFinish"
                @blur="customFinish"
                @change="changeLabel"
                v-show="openCustom"
                v-model="customLabelV"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="file-upload">
        <h2 class="create-title">数据文件</h2>
        <div class="file-upload-box">
          <label for="file">
            <i>*</i>
            数据集
          </label>
          <div>
            <a-upload :multiple="true" :before-upload="fileBeforeUpload" :show-upload-list="false">
              <a-button>
                <!-- <a-icon type="upload" /> -->
                <span class="icon iconfont iconupload"></span>
                上传数据集
              </a-button>
            </a-upload>
            <div class="chunk-list">
              <div v-for="(v, k, i) in ChunkStatus" :key="i">
                <span>文件名称：{{ v.name }}</span>
                <span>计算md5进度：{{ v.chunks + '/' + v.currentChunk }}</span>
              </div>
            </div>
            <div class="progress-box scroll-bar-customize">
              <div v-for="(value, key, index) in fileList" :key="index">
                <div class="progress-item">
                  <span class="img" :class="getFileType(value.name)">
                    <!-- {{ getFileType(value.name) }} -->
                    <!-- <w-csv v-if="getFileType(value.name) === 'csv'" />
                    <w-xls v-if="getFileType(value.name) === 'excel'" />
                    <w-zip v-if="getFileType(value.name) === 'zip'" />
                    <w-txt v-if="getFileType(value.name) === 'txt'" />
                    <w-rar v-if="getFileType(value.name) === 'rar'" />
                    <w-other v-if="getFileType(value.name) === 'other'" />
                    <w-ppt v-if="getFileType(value.name) === 'ppt'" />
                    <w-dm v-if="getFileType(value.name) === 'md'" />
                    <w-docx v-if="getFileType(value.name) === 'word'" /> -->
                  </span>
                  <span class="">
                    <span class="item-top">
                      <span>{{ value.name }}</span>
                      <span class="deleteicon" v-if="value.status !== 'end'" @click="deleteFile(value, key)">
                        <i class="iconguanbi iconfont"></i>
                      </span>
                      <span
                        v-if="value.status === 'end'"
                        class="iconshanchu iconfont"
                        @click="removeFile(value, key)"
                      ></span>
                    </span>
                    <span class="file-size">{{ value.data.size }}</span>
                    <span><a-progress :percent="value.progress" /></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="md-upload-box">
          <label for="file">
            说明
            <span class="label-hint">仅支持.md格式文件</span>
          </label>
          <span></span>
          <div>
            <a-upload :before-upload="MdFileBeforeReader" :show-upload-list="false">
              <a-button>
                <!-- <a-icon type="upload" /> -->
                <span class="icon iconfont iconupload"></span>
                上传说明
              </a-button>
            </a-upload>
            <div class="md-info" v-if="documentName">
              <div>
                <span>{{ documentName }}</span>
                <span>
                  <i @click="RemoveMdFile()">x</i>
                  <!-- <span @click="RemoveMdFile()" class="remove iconfont .iconguanbi"></span> -->
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action">
      <a-button @click="closeCreateModal">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </div>
  </div>
</template>
<script  lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed,nextTick} from 'vue'
import request from 'src/api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import extStorage from "src/utils/extStorage";
import chinaToPy from 'src/utils/py'
import { getFileType } from 'src/utils/getFileType'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
// import Upload from '@/utils/MoreUpload'
import csv from 'src/assets/images/file/csv.svg'
import xls from 'src/assets/images/file/xls.svg'
import other from 'src/assets/images/file/other.svg'
import txt from 'src/assets/images/file/txt.svg'
import rar from 'src/assets/images/file/rar.svg'
import zip from 'src/assets/images/file/zip.svg'
import docx from 'src/assets/images/file/doc.svg'
import doc from 'src/assets/images/file/doc.svg'
import ppt from 'src/assets/images/file/ppt.svg'
import dm from 'src/assets/images/file/dm.svg'
const http=(request as any).dataSet
interface IForumSearch{
  name:string,
  description:string,
  cover:string
  category:string
}
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
interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}
export default defineComponent({
  name: '',
  components: {
    LoadingOutlined,
    PlusOutlined,
    // csv,
    // 'w-xls': xls,
    // 'w-txt': txt,
    // 'w-rar': rar,
    // 'w-zip': zip,
    // 'w-other': other,
    // 'w-docx': docx,
    // 'w-doc': doc,
    // 'w-ppt': ppt,
    // 'w-dm': dm,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    const uid=lStorage.get('user_id')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,showNav:true,backOff:false,showPageEdit:false})

    const previewVisible = ref<boolean>(false);
    const previewImage = ref<string | undefined>('')

    var navList:any= reactive([])
    var labelList:any= reactive([])
    var ChunkStatus:any= reactive({})
    var fileList:any= reactive([])
    const coverFileList = ref<FileItem[]>([])
    // var coverFileList:FileItem[] = reactive([])
    var loading:Ref<boolean> =ref(false)
    var openCustom:Ref<boolean> =ref(false)
    var customLabelV:Ref<string> =ref('')
    var documentName:Ref<string> =ref('')
    let refCustomLabel = ref()
    const ForumSearch:IForumSearch=reactive({
      name:'',
      description:'',
      cover:'',
      category:''
    })
    const rules={
        name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur'},
        ],
        description: [{ required: true, message: '请输入试卷描述类型', trigger: 'blur' }],
    }
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
    function removeLabel(val:any){

    }
    function clickCustomLabel() {
      openCustom.value=true
      nextTick(()=>{
        refCustomLabel.value.focus()
      })
      // this.openCustom = true
      // this.$nextTick(function () {
      //   ;(this.$refs.customLabel as any).focus()
      // })

    }
    function customFinish() {
      // if (this.customLabelV.trim()) {
      //     this.labelList.push(this.customLabelV)
      //     this.customLabelV = ''
      //     this.openCustom = false
      //   } else {
      //     this.openCustom = false
      //   }
    }
    function changeLabel() {
      // this.customLabelV = this.customLabelV.length > 10 ? this.customLabelV.slice(0, 10) : this.customLabelV
    }
    function closeCreateModal() {
      router.go(-1)
    }
    function submit() {
      // router.go(-1)
    }
    function fileBeforeUpload(){

    }
    function deleteFile(value:any, key:any){

    }
    function removeFile(value:any, key:any){

    }
    function MdFileBeforeReader(){

    }
    function RemoveMdFile(){

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
    const handleCancel = () => {
      previewVisible.value = false;
    }
    function categoryList(){
      navList.length=0
      http.categoryList().then((res:IBusinessResp)=>{
          navList.push(...res.data)
          // option.unshift({uid:'',name:'全部'})
          // console.log(option)
      })
    }
    onMounted(()=>{
     categoryList()
      // init()
    })
    return {handlePreview,handleChange,previewImage,coverFileList,handleCancel,ForumSearch,beforeUpload,navList,loading,labelList,openCustom,removeLabel,clickCustomLabel,customFinish,changeLabel,customLabelV,closeCreateModal,submit,fileBeforeUpload,getFileType,ChunkStatus,fileList,deleteFile,removeFile,MdFileBeforeReader,RemoveMdFile,documentName,previewVisible}
  },
})
</script>
<style scoped lang="less">
.createOrEditWrap {
    padding: 27px 16px;
    background: white;
    border-radius: 6px;
    //box-shadow: 0px 0px 0px 1px #eeeeee;

    .header-box {
        color: #B2B2B2;

        >span {
            font-size: 12px;
            cursor: pointer;
            margin-right: 8px;

            &:nth-child(1),
            &:nth-child(3) {
                color: #404040;
            }

            &:nth-child(2) {
                color: #B2B2B2;
            }
        }
    }

    .create-title-box {
        //display: flex;
        //align-items: center;
        //justify-content: space-between;
        //width: 57%;
    }

    .create-title {
        color: #404040;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 24px;
    }

    .action {
        text-align: center;

        button {
            margin-right: 10px;
        }
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
                    .iconupload{
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

                            .iconshanchu {
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
                    .iconupload{
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
}

.upload-drawer-detail {
    .title {
        display: flex;
        justify-content: space-between;
    }

    .ant-drawer-wrapper-body {
        display: flex;
        flex-direction: column;

        .ant-drawer-header {
            height: 55px;
            flex-shrink: 0;
        }

        .ant-drawer-body {
            height: 100%;
            overflow-y: auto;
        }

        .ant-drawer-body {
            //火狐
            scrollbar-color: rgba(@theme-color, .8) rgba(@theme-color, .2);
            scrollbar-width: thin;

            //谷歌
            //高宽分别对应横竖滚动条的尺寸
            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            //滑块
            &::-webkit-scrollbar-thumb {
                border-radius: 3px;
                background: rgba(@theme-color, .9);
            }

            //轨道
            &::-webkit-scrollbar-track {
                border-radius: 3px;
                background: rgba(@theme-color, .1);
            }
        }
    }
}
// .avatar-uploader > .ant-upload {
//   width: 128px;
//   height: 128px;
// }
// .ant-upload-select-picture-card i {
//   font-size: 32px;
//   color: #999;
// }

// .ant-upload-select-picture-card .ant-upload-text {
//   margin-top: 8px;
//   color: #666;
// }
</style>
