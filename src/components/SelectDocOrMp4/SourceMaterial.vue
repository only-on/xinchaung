<template>
  <div class="search flexCenter">
    <div class="flexCenter classifyTabs">
      <span class="left" :class="is_public === 1? 'active':''" @click="changeTab(1)">公开素材</span>
      <span class="right" :class="is_public === 0? 'active':''" @click="changeTab(0)">私有素材</span>
    </div>
    <div class="item custom_input">
      <a-input-search
        v-model:value="docOrMp4Drawer.file_name"
        placeholder="请输入搜索关键字"
        @search="searchDocOrMp4List"
        @keyup.enter="searchDocOrMp4List()" 
      />
    </div>
  </div>
  <a-spin :spinning="docOrMp4Drawer.loading" size="large" tip="Loading...">
    <div class="dataList setScrollbar">
      <div class="list" v-if="docOrMp4Drawer.list.length">
        <div class="item" v-for="v in docOrMp4Drawer.list" :key="v" :class="docOrMp4Drawer.activeFile.id === v.id ? 'active' : ''">
          <div class="flexCenter itemInfo" :class="(v.show && v.fileList.length)?'openInformation':''"  @click="v.item_count?getDetailFile(v):''">
            <div class="flexCenter left">
            <!-- <span class="fileIcon" :style="`background-image: url(${iconList[props.docOrMp4Type === 1?'ppt':'mp4']});`"></span> -->
            <div class="docBg" :style="`background-image: url(${v.cover});`"></div>
            <div class="info">
              <div class="quName single_ellipsis" :title="v.name">{{v.name}}</div>
              <div class="information">
                <div class="portrait flexCenter">
                  <div class="flexCenter imgBox" v-if="is_public === 1">
                    <!--  <span class="img" v-if="v.is_public"></span>-->
                    <span class="img" v-if="v.is_public" :style="`background-image: url(${v.user.avatar});`"></span>
                    <span class="text">{{v.username}}</span>
                  </div>
                  <div class="tags flexCenter">
                    <span>{{`${v.tags.join('/')}`}}</span>
                  </div>
                  <div class="numSize">
                    <div class="text">
                      <span>数量</span>
                      <span>{{v.item_count}}</span>
                    </div>
                    <div class="text">
                      <span>大小</span>
                      <!-- <span>{{ bytesToSize(v.item_size)}}</span> -->
                      <span>{{v.item_size}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div class="flexCenter right">
              <!-- <span> {{ bytesToSize(v.size)}} </span> -->
              <span class="iconfont" :class="v.item_count?'':'iconFontDis'">
                {{ v.show ? "收起" : "展开" }}
              </span>
            </div>
          </div>
          <!-- 是否有文件列表 -->
          <div class="fileList" v-if="v.show && v.fileList.length" :class="(v.show && v.fileList.length)?'openFile':''">
            <a-spin :spinning="v.loading" size="large" tip="Loading...">
              <div v-for="i in v.fileList" class="flexCenter fileItem" :class="docOrMp4Drawer.activeFile.id === i.id ? 'activeFileItem':''">
                <div class="flexCenter fileLeft">
                  <!-- <span class="fileIcon" :style="`background-image: url(${iconList[props.docOrMp4Type === 1?'ppt':'mp4']});`"></span> -->
                  <span class="fileIcon" :style="`background-image: url(${iconList[getFileTypeIcon(v.file_name)]});`"></span>
                  <span class="single_ellipsis">{{i.file_name}}</span>
                </div>
                <div class="flexCenter fileRight">
                  <span>{{bytesToSize(i.size)}}</span>
                  <span class="select"  @click="selectDocOrMp4File(i)">
                    {{ docOrMp4Drawer.activeFile.id === i.id ? "取消" : "选择" }}
                  </span>
                </div>
              </div>
            </a-spin>  
          </div>
        </div>
      </div>
      <Empty v-if="!docOrMp4Drawer.list.length && docOrMp4Drawer.loading===false" text="暂无文件" />
    </div>
  </a-spin>
  <a-pagination
    v-if="docOrMp4Drawer.totalCount > 10"
    show-size-changer
    v-model:current="docOrMp4Drawer.page"
    v-model:pageSize="docOrMp4Drawer.limit"
    :total="docOrMp4Drawer.totalCount"
    @change="pageChange"
    @showSizeChange="showSizeChange"
  />
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
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import iconList from "src/utils/iconList";
import { IBusinessResp } from "src/typings/fetch.d";
import { getFileTypeIcon } from 'src/utils/getFileType'
import { bytesToSize } from "src/utils/common"
import request from "src/api/index";
const http = (request as any).teacherMaterialResource;
interface Props { 
  activeFile:any;     // 选中的文件对象
  tags:string         //  资源标签名称
}
const props = withDefaults(defineProps<Props>(),{
  activeFile: () => {},
  tags:''
});

const emit = defineEmits<{
  (e: "selectSourceMaterialFile", val: any): void;
}>();
const docOrMp4Drawer: any = reactive({
  list: [],
  page: 1,
  limit: 10,
  totalCount: 0,
  loading: false,
  file_name: "",
  activeFile: {}, //  选择或上传的文档、视频
});
console.log(props.activeFile)
var is_public:Ref<number>=ref(1)
const changeTab=(v:number)=>{
  is_public.value=v
  docOrMp4Drawer.page = 1;
  getSourceMaterial()
}
const getDetailFile = (val:any) => {
  val.show = !val.show
  if(val.show === false){ // && val.fileList.length
    return
  }
  let obj={
    file_name:'',
    page:1,
    limit:9999,
  }
  val.loading=true
  val.fileList.length=0
  http.getDetailFile({param:{...obj},urlParams:{editId:val.id}}).then((res: IBusinessResp) => {
    const {list,page}=res.data
    // list.length?selectFile(list[0]):''
    val.loading=false
    val.fileList.push(...list)
  })
};
// 获取文档、视频  列表
const getSourceMaterial = () => {
  const {file_name,page,limit}=docOrMp4Drawer
  let params:any={file_name,page,limit}
  let obj={
    tags:props.tags,
    is_public:is_public.value,
    name:file_name,
    page,
    limit
  }
  docOrMp4Drawer.loading=true
  docOrMp4Drawer.list.length=0
 http.dataSets({param:{...obj}}).then((res: IBusinessResp) => {
    docOrMp4Drawer.loading=false
    const {list,page}=res.data
    list.map((v:any)=>{
      v.show=false
      v.loading=false
      v.fileList=[]
    })
    docOrMp4Drawer.list.push(...list);
    docOrMp4Drawer.totalCount=page.totalCount
    // console.log(docOrMp4Drawer.list)
  });
};
const showSizeChange = (current: any,size: any) => {
  // console.log(size);
  docOrMp4Drawer.page = 1
  docOrMp4Drawer.limit = size;
  getSourceMaterial();
};
const pageChange = (current: any) => {
  docOrMp4Drawer.page = current;
  getSourceMaterial();
};
const selectDocOrMp4File = (val: any) => {
   docOrMp4Drawer.activeFile = { ...val};
  emit("selectSourceMaterialFile", val);
};
const searchDocOrMp4List = () => {
  docOrMp4Drawer.page = 1;
  getSourceMaterial();
};
watch(()=>{ return props.tags},(val:any)=>{
  // console.log(val)
  docOrMp4Drawer.page = 1;
  docOrMp4Drawer.file_name = '';
  getSourceMaterial();
})
onMounted(()=>{
  getSourceMaterial();
})
</script>
<style scoped lang="less">
.search {
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
    .item {
      width: 260px;
    }
  }
.dataList {
    height: calc(100% - 175px);
    overflow: auto;
    .list {
      // padding: 0 20px;
      min-height: 500px;
      .item {
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 10px;
        margin-bottom: 20px;
        padding: 6px;
        .itemInfo{
          // height: 64px;
          justify-content: space-between;
          .left {
            // width: 55%;
            .docBg{
              width: 94px;
              height: 50px;
              // background: rgba(0,0,0,0.00);
              background-image: url('src/assets/images/teacherExperimentResourcePool/base_info_bg.png');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              border-radius: 6px;
              // margin-left: 6px;
            }
            .info{
              padding-left: 1rem;
              
            }
          }
          .right {
            width: 60px;
            justify-content: center;
          }
          .quName {
            // word-break: break-all;
            max-width: 400px;
            color: var(--black-85);
            margin-bottom: 6px;
          }
          .information{
            // height: 30px;
            .text{
              color: var(--black-45);
              font-size: var(--font-size-sm);
            }
            .portrait{
              line-height: 22px;
              .imgBox{
                width: 100px;
              }
              .img{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                // src/assets/images/admin/home/env3.png
                background-image: url('src/assets/images/admin/home/env3.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                margin-right: 6px;
              }
              .tags{
                span{
                  color: var(--primary-color);
                  font-size: var(--font-size-sm);
                }
              }
            }
            .numSize{
              display: none;
              // opacity: 0;
              .text{
                display: inline-block;
                margin-right: 2rem;
                span{
                  margin-right: 4px;
                }
              }
            }
          }
        }
        .openInformation{
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px dashed rgba(112,112,112,0.15);
        }
        .fileList{
          .fileItem{
            height: 40px;
            background: rgba(0,0,0,0.04);
            margin-bottom: 20px;
            color:#808080 ;
            .fileLeft{
              // width: 50%;
              .single_ellipsis{
                width: 240px;
              }
            }
            .fileRight{
              justify-content: space-between;
              flex: 1;
              padding-left: 2rem;
            }
            .select{
              width: 60px;
              text-align: center;
              cursor: pointer;
              color: var(--primary-color);
              // justify-content: center;
            }
          }
          .fileItem:hover{
            background: rgb(255, 238, 217,.24);
          }
          .activeFileItem{
            background: #fffbf6;
            border: 1px solid #ffcaa1;
          }
        }
        .openFile{
          // margin: 1rem 0;
        }
        .fileIcon {
          width: 20px;
          height: 24px;
          background-size: 100%;
          margin: 0  1rem;
        }
        .iconfont {
          color: var(--primary-color);
          display: none;
          // font-size: 20px;
          // cursor: pointer;
          // padding: 0 12px;
        }
        .iconFontDis{
          color: var(--black-45);
          cursor: no-drop;
        }
      }
      .item:hover {
        // background: #fffbf6;
        cursor: pointer;
        box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16); 
        .tags{
          display: none;
        }
        .itemInfo .information .numSize{
          display: block;
          // display: flex;
          // opacity: 1;
        }
        .iconfont{
          display: block;
        }
      }
      .active {
        background: #fffbf6;
        border: 1px solid #ffcaa1;
      }
    }
  }
</style>
