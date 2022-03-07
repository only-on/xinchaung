<template>
  <div class="detail">
    <div class="header">
      <div class="img">
        <!-- :style="`background-image: url(${detail.url});`" -->
      </div>
      <div class="header_mid">
        <div class="title flexCenter">
          <div class="sign">数据集</div>
          <div class="titText single-ellipsis">python数据分析与机器学习实战</div>
        </div>
        <div class="describe ellipsis">
          这幅春联之所以能够流传下来，是因为它的预言。孟昶是后蜀的末代皇帝，这幅对联题自宋太祖赵匡胤灭蜀的前一年。宋朝建立后，真的在每年农历二月十六日设置了“长春节”，庆贺宋太祖的诞辰。
        </div>
        <div class="labels flexCenter">
          <span v-for="v in 3" :key="v">
            {{'标签1'}}
          </span>
        </div>
        <div class="info flexCenter">
          <div class="item">
            <span>数量</span>
            <span>20</span>
          </div>
          <div class="item">
            <span>大小</span>
            <span>123M</span>
          </div>
          <div class="item">
            <span>创建日期</span>
            <span>2020/02/17</span>
          </div>
        </div>
      </div>
      <div class="header_right">
        <div v-if="true"> 
          <a-button type="primary" class="edit_bt"> 编辑</a-button>
          <a-button type="primary" class="delete"> 删除</a-button>
        </div>
      </div>
    </div>
    <div class="fileList">
      <div class="title flexCenter">
        <div class="tab flexCenter">
          <span v-for="v in tabs" :key="v" class="item" :class="(activeTab === v && tabs.length>1)?'active':''" @click="clickTab(v)">
            {{v}}
            <span v-if="v === '文件列表'">({{searchFileList && searchFileList.length}})</span>
          </span>
        </div>
        <div class="right">
          <template v-if="currentTab === '1' && activeTab==='说明文档' && !showEditMd">
            <a-button type="primary"  @click="editMark"> 编 辑</a-button>
          </template>
          <template v-if="currentTab === '1' && activeTab==='说明文档' && showEditMd">
          <span class="data-set-hint">仅支持单个md格式文件上传</span>
            <a-upload class="upload" :showUploadList="false" :before-upload="readFile" accept=".md">
              <a-button type="primary" class="edit_bt"> 上 传 </a-button>
            </a-upload>
            <a-button type="primary" @click="docUpload"> 保 存 </a-button>
          </template>
          <a-button type="primary" v-if="activeTab==='文件列表'" class="edit_bt"> 下载全部</a-button>
          <a-button type="primary" v-if="currentTab === '1' && activeTab==='文件列表'" class=""> 上传文件</a-button>
        </div>
      </div>
      <div class="content">
        <div v-if="activeTab==='说明文档'">
          <MarkedEditor v-model="state.document.content" class="markdown__editor" :preview="previewMark" />
        </div>
        <div v-if="activeTab==='文件列表'" class="fileBox">
          <div class="left">
            <div class="custom_input">
              <a-input-search v-model:value="state.fileKeyWord" placeholder="请输入搜索关键字"/>
            </div>
            <div class="file textScrollbar">
              <FileList :FileList="searchFileList" @selectFile="selectFile" :activeItem="activeItem" />
            </div>
          </div>
          <div class="right">
            <div class="fileItem flexCenter">
              <div class="flexCenter">
                <div class="img" :style="`background-image: url(${getFileTypeIcon(state.fileItem.name)});`"> </div>
                <div class="fileInfo">
                  <div class="fileName">{{state.fileItem.name}}</div>
                  <div class="info">
                    <span>2M</span>
                    <span>2020/12/02/17</span>
                  </div>
                </div>
              </div>
              <a-button type="primary" class="edit_bt" size="small" @click="downLoadFile(state.fileItem)"> 下 载 </a-button>
            </div>
            <div class="fileView">
              <!-- <h2>文件内容</h2> -->
              <div v-if="getFileType(state.fileItem.name) === 'md'">
                <MarkedEditor v-model="state.fileItem.document" class="markdown__editor" :preview="true" />
              </div>
              <div v-if="getFileType(state.fileItem.name) === 'mp4'">
                <video :src="env ? '/proxyPrefix' + state.fileItem.url : state.fileItem.url" :controls="true"> 您的浏览器不支持 video 标签</video>
              </div>
              <div v-if="getFileType(state.fileItem.name) === 'pdf'">
                <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'"/>
                <!-- <PdfVue :url="state.fileItem.pdf" /> -->
              </div>
              
            </div>
          </div>
        </div>
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
  Ref,
  inject,
  computed,
  toRefs,
  watch,
} from "vue";
import PdfVue from "src/components/pdf/pdf.vue";
import FileList from "./FileList.vue";
import { getFileType,getFileTypeIcon } from 'src/utils/getFileType'
import MarkedEditor from "src/components/editor/markedEditor.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const env = process.env.NODE_ENV == "development" ? true : false;
const router = useRouter();
const route = useRoute();
const {currentTab, editId } = route.query;
const http = (request as any).teacherMaterialResource;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "数据集详情", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const activeItem:any=reactive({
  fileItem:{},
})
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
    content:'1、vue是否能升级，升级后ant-design-vue是否正常，升级后私包使用是否正常\r\n2'     // markdown 数据
  },
  fileList:[
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test.py", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test.tar", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "course.txt", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "文件夹1", size: "0.4 KB",show:false,
      children:[
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "文件夹1-1", size: "0.4 KB",show:false,
        children:[
          {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test1-1-3.py", size: "0.4 KB",

          },
          {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "文件夹1-1-3", size: "0.4 KB",show:false,
          children:[
            {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test1-1-3-4.py", size: "0.4 KB"},
            {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test1-1-3-4.doc", size: "0.4 KB"},
          ]
          },
        ]
        },
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test1-2.py", size: "0.4 KB"},
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test1-2.tar", size: "0.4 KB"},
      ]
    },
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test2.py", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test2-2.tar", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "course2.txt", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "文件夹2", size: "0.4 KB",show:false,
      children:[
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "ms2-2.txt", size: "0.4 KB"},
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test2-2.py", size: "0.4 KB"},
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test2-2.tar", size: "0.4 KB"},
      ]
    },
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test3.py", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test3.tar", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "course3.txt", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "文件夹3", size: "0.4 KB",show:false,
      children:[
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "ms3-3.txt", size: "0.4 KB"},
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test3-3.py", size: "0.4 KB"},
        {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test3-3.tar", size: "0.4 KB"},
      ]
    },
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test4.py", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "test4.tar", size: "0.4 KB"},
    {uid: "e7771e6a776c11ec9b9e0242ac110004", name: "course4.txt", size: "0.4 KB"},
  ],
  fileItem:{ name: "ms.txt",},
  fileKeyWord:'',  //  搜索文件列表关键词
})
var activeKey: Ref<number> = ref(1);

var isDataSet: Ref<boolean> = ref(true);

const tabs=computed(()=>{
  if(isDataSet.value===true){
    return ['说明文档','文件列表']
  }else{
    return ['文件列表']
  }
})
const activeTab: Ref<string> = ref(isDataSet.value?'说明文档':'文件列表');
const clickTab=(v:string)=>{
  activeTab.value=v
}
const previewMark: Ref<boolean> = ref(true);
const showEditMd: Ref<boolean> = ref(false);
const editMark=()=>{
  // 保存markdown 接口
  // previewMark.value=false
  showEditMd.value=true
}
// 本地读取文件
const readFile = (file: any) => {
  const suffix = (file && file.name).split(".")[1];
  if (suffix !== "md") {
    message.warn("请上传 .md 格式文件");
    return false;
  }
  const reader = new FileReader();
  reader.readAsText(file, "utf-8");
  reader.onload = () => {
    if (reader.result) {
      previewMark.value=false
      state.document.file=file
      state.document.content=reader.result
      // resolve(reader.result);
    }
  };
};
const docUpload = () => {
  let file=state.document.file
  const fs = new FormData();
    fs.append("file", file);
    http.uploadDocFile({ param: fs }).then((res: any) => {
      previewMark.value=true
      // 请求数据集详情接口
    });
};
//  文件列表操作
const searchFileList=computed(()=>{
  let arr=[]
  if(state.fileList && state.fileList.length && state.fileKeyWord){
    arr=state.fileList.filter((item:any) => {return item.name.indexOf(state.fileKeyWord)!==-1 });
  }else{
    arr=state.fileList
  }
  return arr
})
// 
const selectFile=(val:any)=>{
  // console.log(val)
  state.fileItem=val
}
const downLoadFile=(val:any)=>{
  console.log(val)
  // const a: any = document.createElement("a");
  // a.href = val.path;
  // a.download = val.name;
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  // window.URL.revokeObjectURL(a.href);
}
// 初始化数据
const initData = () => {
  http.getDetail().then((res: IBusinessResp) => {
    // state.detail
  })
};
onMounted(() => {
  // initData();
});
</script>
<style scoped lang="less">
.markdown__editor {
  height: 400px;
}
.edit_bt{
  background-color: var(--brightBtn);
  border-color: var(--brightBtn);
}

.detail{
  padding: 20px 24px;
  height: 600px;
  // border: 1px solid #76e6bb;
  .header{
    height: 150px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    .img{
      width: 270px;
      height: 150px;
      background: url("src/assets/images/cover2.png") no-repeat;
      background-size: 100% 100%;
    }
    .header_mid{
      // flex: 1;
      width: 770px;
      padding-left: 24px;
      .sign{
        width: 50px;
        height: 20px;
        background: #ff6554;
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
        // height: 44px;
        line-height: 24px;
        -webkit-line-clamp: 2;
      }
      .labels{
        span{
          color: var(--brightBtn);
          padding: 12px;
        }
      }
      .info{
        color: var(--black-45);
        .item{
          margin-right: 2rem;
          span{
            padding-right: 6px;
          }
        }
      }
    }
    .header_right{
      display: flex;
      flex-direction: column;
      width: 88px;
      .edit{
        background-color: var(--brightBtn);
        border-color: var(--brightBtn);
      }
      .delete{
        margin-top: 1rem;
      }
    }
  }
  .fileList{
    padding: 24px 0;
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
              }
              .info{
                color: var(--black-45);
                font-size: var(--font-size-sm);
                span{
                  margin-right: 1rem;
                }
              }
            }
          }
          .fileView{
            padding-top: 2rem;
          }
        }
      }
    }
  }
}
</style>
