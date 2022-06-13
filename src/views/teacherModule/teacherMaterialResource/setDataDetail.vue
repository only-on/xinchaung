<template>
  <div class="detail">
    <div class="header">
      <div class="img flexCenter" :style="`background-image: url(${state.detail.cover});`">
      {{state.detail.cover?'':'封面不存在'}}
      </div>
      <div class="header_mid">
        <div class="title flexCenter">
          <div class="sign">{{state.detail.type_name}}</div>
          <div class="titText single_ellipsis" :title="state.detail.name">{{state.detail.name}}</div>
        </div>
        <div class="describe ellipsis">
          {{state.detail.description}}
        </div>
        <div class="labels" v-if="state.detail.tags && state.detail.tags.length">
          <span v-for="(v, index) in state.detail.tags" :key="index">
            {{v}} <span v-if="index !== state.detail.tags.length - 1"> / </span>
          </span>
        </div>
        <div class="info flexCenter">
          <div class="item userAvatar" v-if="userInfo.avatar">
            <img :src="userInfo.avatar" alt="">
            <span>{{userInfo.username}}</span>
          </div>
          <div class="item">
            <span>数量</span>
            <span>{{state.detail.item_count}}</span>
          </div>
          <div class="item">
            <span>大小</span>
            <span>{{state.detail.item_size}}</span>
          </div>
          <div class="item">
            <span>创建日期</span>
            <span>{{state.detail.created_at}}</span>
          </div>
          <div class="item">
            <span>类型</span>
            <span>{{state.detail.categoryText}}</span>
          </div>
        </div>
      </div>
      <div class="header_right">
        <div v-if="(currentTab === '1' && [3,5].includes(role))"> 
          <a-button type="primary" class="brightBtn" @click="edit()"> 编辑</a-button>
          <a-button type="primary" class="delete" @click="deleteImages()"> 删除</a-button>
        </div>
      </div>
    </div>
    <div class="fileList">
      <div class="title flexCenter">
        <div class="tab flexCenter">
          <span v-for="v in tabs" :key="v" class="item" :class="(activeTab === v && tabs.length>1)?'active':''" @click="clickTab(v)">
            {{v}}
            <span v-if="v === '文件列表'">({{state.fileList && state.fileList.length}})</span>
          </span>
        </div>
        <div class="right">
          <template v-if="currentTab === '1' && activeTab==='说明文档' && !showEditMd && [3,5].includes(role)">
            <a-button type="primary"  @click="editMark"> 编 辑</a-button>
          </template>
          <template v-if="currentTab === '1' && activeTab==='说明文档' && showEditMd">
          <span class="data-set-hint">仅支持单个md格式文件上传</span>
            <a-upload class="upload" :showUploadList="false" :before-upload="readMdFile" accept=".md" :custom-request="()=>{}">
              <a-button type="primary" class="brightBtn"> 上 传 </a-button>
            </a-upload>
            <a-button type="primary" @click="docUpload"> 保 存 </a-button>
          </template>
          <a-button type="primary" v-if="activeTab==='文件列表'" class="brightBtn" :disabled="state.fileList.length?false:true" @click="downLoadAll()"> 下载全部</a-button>
          <a-button type="primary" v-if="currentTab === '1' && activeTab==='文件列表' && [3,5].includes(role)" class="" @click="addFile()"> 上传文件</a-button>
        </div>
      </div>
      <div class="content">
        <div v-if="activeTab==='说明文档'">
          <MarkedEditor v-model="state.document.content" class="markdown__editor" :preview="previewMark" />
        </div>
        <div v-show="activeTab==='文件列表'" class="fileBox">
          <div class="left">
            <div class="custom_input">
              <a-input-search v-model:value="state.fileKeyWord" placeholder="请输入搜索关键字"/>
            </div>
            <div class="file textScrollbar">
              <FileList :FileList="state.fileKeyWord?searchFileList:state.fileList" @selectFile="selectFile" :activeItem="state" />
            </div>
          </div>
          <div class="right">
            <div class="fileItem flexCenter" v-if="state.fileItem.id">
              <div class="flexCenter">
                <div class="img" :style="`background-image: url(${getFileTypeIcon(state.fileItem.file_name)});`"> </div>
                <div class="fileInfo">
                  <div class="fileName single_ellipsis" :title="state.fileItem.file_name">{{state.fileItem.file_name}}</div>
                  <div class="info">
                    <span>{{state.fileItem.sizeString?state.fileItem.sizeString:bytesToSize(state.fileItem.size)}}</span>
                    <span>{{state.fileItem.created_at}}</span>
                  </div>
                </div>
              </div>
              <div class="flexCenter caozuo">
                <a-button v-if="currentTab === '1' && [3,5].includes(role)" type="primary" size="small" @click="deleteFile(state.fileItem)"> 删 除 </a-button>
                <a-button type="primary" class="brightBtn" size="small" @click="downLoadFile(state.fileItem)"> 下 载 </a-button>
              </div>
            </div>
            <div class="fileView" v-show="state.fileItem.id">
              <!-- <h2>文件内容</h2> -->
              <div v-if="state.fileItem.suffix === 'md'">
                <MarkedEditor v-model="state.fileItem.document" class="markdown__editor" :preview="true" />
              </div>
              <div v-else-if="['MP4', 'mp4'].includes(state.fileItem.suffix)">
                <video :src="env ? '/proxyPrefix' + state.fileItem.path : state.fileItem.path" :controls="true" height="440" width="847" :poster="videoCover"> 您的浏览器不支持 video 标签</video>
              </div>
              <div v-else-if="['doc','docx','ppt','pptx','pdf'].includes(state.fileItem.suffix)" class="pdfBox">
                <!-- <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'"/> -->
                <PdfVue :url="state.fileItem.path" />
              </div>
              <div v-else-if="['jpg','jpeg','png','gif'].includes(state.fileItem.suffix)">
                <img :src="state.fileItem.path" alt="" class="imgBox">
              </div>
              <!-- ="['md','mp4','pdf'].includes(state.fileItem.suffix) === false" -->
              <div v-else>
                <Empty type="filePreview"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-modal title="编辑" width="620px" :visible="visible" @cancel="handleCancel" class="editImage">
    <BaseInfo v-if="visible"  ref="baseInfoRef" :materialType="state.detail.type_name" 
    :editInfo="{name:state.detail.name,
      description:state.detail.description,
      tags:state.detail.tags,
      is_public:state.detail.is_public,
      cover:state.detail.cover,
      categoryText:state.detail.categoryText
      }"
     class="con"/>
    <template #footer>
        <Submit @submit="handleOk" @cancel="handleCancel"></Submit>
      </template>
  </a-modal>
  <!-- 上传文件 弹窗 -->
  <a-modal v-model:visible="addFileVisible"  :title="`上传文件`" class="uploadImage" :width="900">
    <div>
      <upload-file ref="uploadFileRef" :slab_uid="state.detail.uid" :type="state.detail.type" :fileList="AddFileLObj.AddFileList" :complete="AddFileLObj" />
    </div>
    <template #footer>
      <Submit @submit="SaveFile()" @cancel="cancelAddFile()" :loading="AddFileLObj.complete"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  createVNode
} from "vue";
import Submit from "src/components/submit/index.vue";
import BaseInfo from './components/baseInfo.vue'
import PdfVue from "src/components/pdf/pdf.vue";
import FileList from "./FileList.vue";
import { getFileType,getFileTypeIcon,readFile } from 'src/utils/getFileType'
import { bytesToSize } from "src/utils/common"
import MarkedEditor from "src/components/editor/markedEditor.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import uploadFile from './components/uploadFile.vue'
import { downloadUrl } from "src/utils/download";
import videoCover from 'src/assets/images/common/videoCover.jpg'
import extStorage from "src/utils/extStorage";
const env = process.env.NODE_ENV == "development" ? true : false;
const router = useRouter();
const route = useRoute();
const {currentTab, editId ,cardType,type,user_id} = route.query;
const userInfo = reactive<any>({
  avatar: route.query?.avatar,
  username: route.query?.username
})
const http = (request as any).teacherMaterialResource;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
updata({
  tabs: [{ name: `${type}详情`, componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

// 采用ts专有声明，有默认值
interface Props {
  msg?: string;
  labels?: string[];
}
// const props = withDefaults(defineProps<Props>(), {
//   msg: "hello",
//   labels: () => ["one", "two"],
// });

const state:any=reactive({
  detail:{},
  document:{
    file:'',       // 上传的md  原文件
    content:''     // markdown 数据
  },
  fileList:[],
  fileItem:{},
  fileKeyWord:'',  //  搜索文件列表关键词
})


const tabs=computed(()=>{
  return ['说明文档','文件列表']
})
const activeTab: Ref<string> = ref('说明文档');
const clickTab=(v:string)=>{
  activeTab.value=v
}
const previewMark: Ref<boolean> = ref(true);
const showEditMd: Ref<boolean> = ref(false);
const editMark=()=>{
  // 保存markdown 接口
  previewMark.value=false
  showEditMd.value=true
}
// 本地读取文件
const readMdFile = (file: any) => {
 readFile(file).then((text:any)=>{
    previewMark.value=false
    state.document.file=file
    state.document.content=text
    return false
  })
  
};
const docUpload = () => {
  // let data=
  let data:any={
    data_id:editId,
    content:state.document.content,
 }
  http.editDoc({param:{...data}}).then((res:any)=>{
    previewMark.value=true
    showEditMd.value=false
    message.success('保存成功')
    detailed()
  })
};
//  文件列表操作
const searchFileList=computed(()=>{
  let arr=[]
  if(state.fileList && state.fileList.length && state.fileKeyWord){
    arr=state.fileList.filter((item:any) => {return item.file_name.indexOf(state.fileKeyWord)!==-1 });
  }else{
    arr=state.fileList
  }
  console.log(arr)
  return arr
})
// 
const selectFile=(val:any)=>{
  console.log(val) 
  state.fileItem=val
}
const deleteFile=(val:any)=>{
  const deleteParam = {
  file_id: val.uid,
  file_name: val.name,
}
http.deleteItemFile({param:{...deleteParam}}).then((res:any)=>{
  message.success('删除成功')
  getDataFileList()
  detailed()
})
}
const downLoadFile=(val:any)=>{
  http.download({param:{data_id:editId,file_id:val.uid}}).then((res:any)=>{
    let {download_path,name}=res.data
    let url=`${env?'/proxyPrefix':''}${download_path}`
    downloadUrl(url,name)
  })
}
const downLoadAll=()=>{
  http.download({param:{data_id:editId}}).then((res:any)=>{
    let {download_path,name}=res.data
    let url=`${env?'/proxyPrefix':''}${download_path}`
    downloadUrl(url,name)
  })
}
var visible: Ref<boolean> = ref(false);
const edit=()=>{
  visible.value=true
}
const deleteImages=()=>{
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
    let deleteParam = `data_id=${state.detail.uid}&data_name=${state.detail.name}`;
      http.deleteDataSet({ urlParams: { deleteParam: deleteParam } }).then((res: IBusinessResp) => {
        http.deletDataset({ urlParams: { datasetID: editId } }).then((res: IBusinessResp) => {
          message.success({duration:1,content:'删除成功'})
          setTimeout(()=>{
            router.go(-1);
          },1000)
        });
      });
    },
  });
}
const handleCancel=()=>{
  visible.value=false
}
const baseInfoRef = ref()

const handleOk=async()=> {
  let params: any = {};
  await baseInfoRef.value.fromValidate()
  Object.assign(params, baseInfoRef.value.formState)
 let ForumSearch:any={
   category: [params.categoryText],
    user_id:user_id,
    data_id:editId,
    common: Number(params.is_public),
    name:params.name,
    description:params.description,
    cover: params.cover,
    label: params.tags,
    doc_name:'',
    documents:state.document.content,
 }
  http.editInfo({param:{...ForumSearch}}).then((res:any)=>{
    const  param = {
      name: params.name,
      tags: params.tags,
      slab_uid: editId,
      is_public: Number(params.is_public)
    }
    http.updateDataset({urlParams: {datasetID: editId}, param}).then((res: any) => {
      message.success('修改成功')
      detailed()
      visible.value=false
    })
  })
  // if(ForumSearch.common !== oldCommon.value){
  //   console.log(ForumSearch.common)
  //   let obj:any={
  //     data_id:editId,
  //     user_id:user_id,
  //   }
  //   ForumSearch.common === 1 ? http.toPublic({param:{...obj}}) :http.toPrivate({param:{...obj}})
  // }
}
//  上传文件
var addFileVisible: Ref<boolean> = ref(false);
const uploadFileRef = ref()
const AddFileLObj:any=reactive({
  complete:false,
  AddFileList:{}
})
const addFile=()=>{
  addFileVisible.value=true
}
const SaveFile=()=>{
  // console.log(AddFileLObj.AddFileList)
  // const list=Object.values(AddFileLObj.AddFileList)
  // if(list.length){
  //   let items:any=[]
  //   list.forEach((v:any)=>{
  //     var {name,file_url,suffix,size}=v
  //     items.push({file_name:name,file_url,suffix,size})
  //   })
  //   http.SaveFile({param:{items},urlParams:{editId:editId}}).then((res: IBusinessResp) => {
  //     //   要添加loading
  //     message.success('上传成功')
  //     AddFileLObj.AddFileList={}
  //     // getDetailFile()
  //     addFileVisible.value=false
  //   })
  // }else{
  //    addFileVisible.value=false
  // }
  AddFileLObj.AddFileList={}
  addFileVisible.value=false
  getDataFileList()
  detailed()
}
const cancelAddFile=()=>{
  uploadFileRef.value?.removeAllFile()
  addFileVisible.value=false
  getDataFileList()
  AddFileLObj.AddFileList={}
}
var oldCommon: Ref<number> = ref(0);
//   数据集部分单独
function detailed(){
  let common=Number(currentTab)===0?1:0
  http.detailed({param:{data_id:editId,common:common,user_id:user_id}}).then((res:any)=>{
    state.detail={
      ...res.data
    }
    //common
    
    state.detail.is_public=String(res.data.common)
    state.detail.categoryText=res.data.categorys[0].name
    state.detail.item_count=res.data.amount
    state.detail.item_size=res.data.size
    state.detail.type_name='数据集'
    state.document.content=res.data.documents
    state.detail.tags=[]
    state.detail.created_at = res.data.created_at.substr(0, 10)
    if(res.data.labels && res.data.labels.length){
      res.data.labels.forEach((v:any)=>{
        state.detail.tags.push(v.name)
      })
    }
    // name:state.detail.name,description:state.detail.description,tags:state.detail.tags,is_public:state.detail.is_public,cover:state.detail.cover

    oldCommon.value=res.data.common
  })
}
function getDataFileList() {
  state.fileList.length=0
  http.getDataFileList({param:{ data_id:editId }}).then((res:any) => {
    const list=res.data
    list.length?selectFile(list[0]):selectFile({})
    if(list.length){
      list.map((v:any)=>{
        v.suffix=''     //  v.suffix=v.class  //现在没有预览地址  字段置空
        v.id=v.uid
        v.file_name=v.name
        v.sizeString=v.size
      })
      selectFile(list[0])
      state.fileList.push(...list)
    }
    console.log(list)
  })
}
onMounted(() => {
  detailed()
  getDataFileList()
});
</script>
<style scoped lang="less">
.markdown__editor {
  height: 400px;
}

.detail{
  height: 600px;
  // border: 1px solid #76e6bb;
  .header{
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    background: var(--white-100);
    padding: 20px 24px;
    .img{
      width: 270px;
      height: 150px;
      background: url("src/assets/images/cover2.png") no-repeat;
      background-size: 100% 100%;
      justify-content: center;
    }
    .header_mid{
      // flex: 1;
      width: 770px;
      padding-left: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .sign{
        width: 64px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 2px;
        color: #fff;
        line-height: 20px;
        text-align: center;
        font-size: var(--font-size-sm);
      }
      .titText{
        color: var(--black-85);
        padding-left: 1rem;
        font-size: var(--font-size-16);
        line-height: 32px;
      }
      .describe{
        color: var(--black-45);
        height: 48px;
        line-height: 24px;
        -webkit-line-clamp: 2;
      }
      .labels{
        align-self: baseline;
        padding: 3px 14px;
        border-radius: 2px;
        background: var(--primary-1);
        color: var(--primary-color);
      }
      .info{
        color: var(--black-45);
        .item{
          margin-right: 2rem;
          span{
            padding-right: 6px;
          }
          &.userAvatar{
            img{
              width: 20px;
              height: 20px;
              border-radius: 50%;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .header_right{
      display: flex;
      flex-direction: column;
      width: 88px;
      .delete{
        margin-top: 1rem;
      }
    }
  }
  .fileList{
    padding: 20px 24px;
    background: var(--white-100);
    // border: 1px solid #76e6bb;
    .title{
      
      justify-content: space-between;
      .tab{
        // width: 300px;
        .item{
          // width: 50%;
          // margin-bottom: 2px;
          line-height: 32px;
          width: max-content;
          padding: 0 1rem;
          margin: 0 1rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          text-align: left;
        }
        .active{
          border-bottom: 2px solid var(--primary-color);
        }
      }
      .right{
        .data-set-hint {
          font-size: 12px;
          font-style: normal;
          color: var(--black-25);
          margin-right: 10px;
        }
        .ant-btn{
          margin-left: 10px;
        }
      }
    }
    .content{
      padding-top: 24px;
      .fileBox{
        padding-top: 20px;
        display: flex;
        .left{
          width: 24%;
          .custom_input{
            margin-bottom: 20px;
          }
          .file{
            max-height: 460px;
            overflow-y: scroll;
          }
        }
        .right{
          flex:1;
          padding-left: 2rem;
          .fileItem{
            padding: 9px 0;
            justify-content: space-between;
            .img{
              width: 40px;
              height: 40px;
              // background: url("src/assets/images/cover2.png") no-repeat;
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
            .fileInfo{
              padding-left: 1rem;
              .fileName{
                letter-spacing: 0.7px;
                color: var(--black-85);
                max-width: 650px;
              }
              .info{
                color: var(--black-45);
                font-size: var(--font-size-sm);
                span{
                  margin-right: 1rem;
                }
              }
            }
            .caozuo{
              .brightBtn{
                margin-left: 1rem;
              }
            }
          }
          .fileView{
            padding-top: 2rem;
            height: 460px;
            .pdfBox{
              height: 100%;
            }
            .video{
              width: 100%;
              height: 450px;
              object-fit: fill;
            }
            .imgBox{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
