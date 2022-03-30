<template>
  <div>
    <a-drawer
    :title="props.docOrMp4Type === 1 ? '选择文档' : '选择视频'"
    class="select-docOrMp4-drawer"
    :destroyOnClose="true"
    :closable="false"
    placement="right"
    :visible="docOrMp4Drawer.visible"
    width="640"
    @close="closeDrawerDoc"
  >
    <div class="search flexCenter">
      <!-- <div class="item custom_select">
        <a-select
          style="width: 260px"
          v-model:value="docOrMp4Drawer.catalogueId"
          :placeholder="`请选择${props.docOrMp4Type === 1 ? '文档' : '视频'}目录`"
          :options="catalogueOptions"
          @change="searchDocOrMp4List"
        ></a-select>
      </div> -->
      <div class="flexCenter classifyTabs">
        <span :class="is_public === 1? 'active':''" @click="changeTab(1)">公开素材</span>
        <span :class="is_public === 0? 'active':''" @click="changeTab(0)">私有素材</span>
      </div>
      <div class="item custom_input">
        <a-input-search
          v-model:value="docOrMp4Drawer.file_name"
          placeholder="请输入搜索关键字"
          @search="searchDocOrMp4List"
        />
      </div>
    </div>
    <a-spin :spinning="docOrMp4Drawer.loading" size="large" tip="Loading...">
      <div class="dataList setScrollbar">
        <div class="list" v-if="docOrMp4Drawer.list.length">
          <div class="item" v-for="v in docOrMp4Drawer.list" :key="v" :class="docOrMp4Drawer.activeFile.id === v.id ? 'active' : ''">
            <div class="flexCenter itemInfo" :class="(v.show && 5)?'openInformation':''">
              <div class="flexCenter left">
              <!-- <span class="fileIcon" :style="`background-image: url(${iconList[props.docOrMp4Type === 1?'ppt':'mp4']});`"></span> -->
              <div class="docBg"></div>
              <div class="info">
                <div class="quName single_ellipsis">{{v.file_name}}</div>
                <div class="information">
                  <div class="portrait flexCenter">
                    <div class="flexCenter imgBox" v-if="is_public === 1">
                      <span class="img"></span>
                      <span class="text">系统内置</span>
                    </div>
                    <div class="tags flexCenter">
                      <span>素材标签1/</span>
                    </div>
                    <div class="numSize">
                      <div class="text">
                        <span>数量</span>
                        <span>20</span>
                      </div>
                      <div class="text">
                        <span>大小</span>
                        <span>{{ bytesToSize(v.size)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div class="flexCenter right">
                <!-- <span> {{ bytesToSize(v.size)}} </span> -->
                <span class="iconfont" @click="v.show = ! v.show">
                  {{ v.show ? "收起" : "展开" }}
                </span>
              </div>
            </div>
            <!-- 是否有文件列表 -->
            <div class="fileList" v-if="v.show && 5" :class="(v.show && 5)?'openFile':''">
              <div v-for="i in [{id:1,name:'文件1'},{id:2,name:'文件2'},{id:3,name:'文件3'},]" class="flexCenter fileItem" :class="docOrMp4Drawer.activeFile.id === i.id ? 'activeFileItem':''">
                <div class="flexCenter">
                  <span class="fileIcon" :style="`background-image: url(${iconList[props.docOrMp4Type === 1?'ppt':'mp4']});`"></span>
                  <!-- <span class="fileIcon" :style="`background-image: url(${getFileTypeIcon(v.file_name)});`"></span> -->
                  <span>文件名称</span>
                </div>
                <span>2M</span>
                <span class="select"  @click="selectDocOrMp4File(i)">
                  {{ docOrMp4Drawer.activeFile.id === i.id ? "取消" : "选择" }}
                </span>
              </div>
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
    />
  </a-drawer>
  </div>
</template>
<script lang="ts" setup>

import {
  Ref,
  ref,
  onMounted,
  reactive,
  defineProps,
  withDefaults,
  watch
} from "vue";
import { getFileTypeIcon } from 'src/utils/getFileType'
import iconList from "src/utils/iconList";
import { bytesToSize } from "src/utils/common"
import { SelectTypes } from "ant-design-vue/es/select";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const http = (request as any).teacherExperimentResourcePool;
// 采用ts专有声明，有默认值
interface Props {
  docOrMp4Type: number;
  visible: boolean;
  activeFile:any
}
const props = withDefaults(defineProps<Props>(), {
  docOrMp4Type:1,
  visible:false,
  activeFile: () => {},
});
const emit = defineEmits<{
  (e: "selectDocOrMp4File", val: any): void;
  (e: "closeDrawerDoc"): void;
}>();
const docOrMp4Drawer: any = reactive({
  visible: false,
  list: [],
  page: 1,
  limit: 10,
  totalCount: 20,
  loading: false,
  catalogueId: '', // 目录列表第一个
  file_name: "",
  activeFile: {}, //  选择或上传的文档、视频
});

watch(()=>{return props.visible},(val:boolean)=>{
  docOrMp4Drawer.visible=props.visible
  // console.log(val)
},{immediate:true})
docOrMp4Drawer.activeFile={ ...props.activeFile}
// 目录  视频和文档公用字段   弹窗和抽屉共用
const catalogueOptions = ref<SelectTypes["options"]>([
  { label: "公有", options: [{ label: "共有1", value: 1 }] },
  { label: "私有", options: [{ label: "私有1", value: 2 }] },
]);
// 获取文档目录
const getCatalogue = () => {
  let type=props.docOrMp4Type === 1?3:4
  http.getCatalogueList({urlParams:{typeId:type}}).then((res: IBusinessResp) => {
    interface IOptions {
      value: string;
      label: string;
    }
    let data = res.data;
    // console.log('[获取题库目录] ', data);
    catalogueOptions.value![0].options.length = 0;
    catalogueOptions.value![1].options.length = 0;
    (data.private && data.private.length)?data.private.forEach((v: any) => {
      let obj: IOptions = { value: v.id, label: v.name };
      catalogueOptions.value![1].options.push(obj);
    }):'';
    (data.public && data.public.length)?data.public.forEach((v: any) => {
      let obj: IOptions = { value: v.id, label: v.name };
      catalogueOptions.value![0].options.push(obj);
    }):'';
    if(data.private && data.private.length){
      docOrMp4Drawer.catalogueId=data.private[0].id
    }
    if(data.public && data.public.length){
      docOrMp4Drawer.catalogueId=data.public[0].id
    }
    getDocOrMp4List()
    // docOrMp4Drawer.catalogueId   upDoc.catalogue  默认第一个
  })
};

var is_public:Ref<number>=ref(1)
const changeTab=(v:number)=>{
  is_public.value=v
}

// 获取文档、视频  列表
const getDocOrMp4List = () => {
  const {file_name,page,limit}=docOrMp4Drawer
  let params:any={file_name,page,limit}
  docOrMp4Drawer.loading=true
  docOrMp4Drawer.list.length=0
 http.getFileList({param:{...params},urlParams:{dataId:docOrMp4Drawer.catalogueId}}).then((res: IBusinessResp) => {
    docOrMp4Drawer.loading=false
    const {list,page}=res.data
    list.map((v:any)=>{
      v.show=false
      v.fileList=[1,2,3,4,5]
    })
    docOrMp4Drawer.list.push(...list);
    docOrMp4Drawer.totalCount=page.totalCount
    // console.log(docOrMp4Drawer.list)
  });
};
const closeDrawerDoc = () => {
  emit("closeDrawerDoc");
};
const selectDocOrMp4File = (val: any) => {
  docOrMp4Drawer.activeFile = { ...val};
  emit("selectDocOrMp4File", val);
};
const searchDocOrMp4List = () => {
  docOrMp4Drawer.page = 1;
  getDocOrMp4List();
};
const pageChange = (current: any) => {
  docOrMp4Drawer.page = current;
  getDocOrMp4List();
};
onMounted(()=>{
  getCatalogue()
})
</script>
<style scoped lang="less">
.select-docOrMp4-drawer {
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
              padding-left: 10px;
              
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
            .text{
              color: var(--black-45);
              font-size: var(--font-size-sm);
            }
            .portrait{
              .imgBox{
                width: 100px;
              }
              .img{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-image: url('src/assets/images/teacherExperimentResourcePool/base_info_bg.png');
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
          border: 1px dashed rgba(112,112,112,0.15);
        }
        .fileList{
          .fileItem{
            height: 40px;
            justify-content: space-between;
            background: rgba(0,0,0,0.04);
            margin-bottom: 20px;
            color:#808080 ;
            .select{
              width: 60px;
              text-align: center;
              cursor: pointer;
              color: var(--primary-color);
              // justify-content: center;
            }
          }
          .fileItem:hover{
            background: #ffeed8;
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
          // font-size: 20px;
          // cursor: pointer;
          // padding: 0 12px;
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
      }
      .active {
        background: #fffbf6;
        border: 1px solid #ffcaa1;
      }
    }
  }
}
.ant-pagination {
  text-align: center;
}
</style>
