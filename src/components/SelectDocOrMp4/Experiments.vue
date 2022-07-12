<template>
  <div class="search flexCenter">
    <div class="flexCenter classifyTabs">
      <span class="left" :class="init_type === 1? 'active':''" @click="changeTab(1)">公开实验</span>
      <span class="right" :class="init_type === 0? 'active':''" @click="changeTab(0)">我的实验</span>
    </div>
    <div class="baocun">
      <a-button type="primary" @click="Reselection()">保存实验</a-button>
    </div>
  </div>
  <div style="margin-bottom: 24px;">
    <a-input-search style="width:364px"  v-model:value="docOrMp4Drawer.name" placeholder="请输入搜索关键词" @search="searchDocOrMp4List" @keyup.enter="searchDocOrMp4List()" />
  </div>
  <div class="Exhibition flexCenter">
    <div class="left">
      <span>已选择 <span class="num">{{docOrMp4Drawer.selectList.length}}</span> 个实验</span>
      <span>共 <span class="num">{{classNum}}</span> 课时</span>
    </div>
    <span class="empty" @click="qingkong()">清空</span>
  </div>
  <a-spin :spinning="docOrMp4Drawer.loading" size="large" tip="Loading...">
    <div class="dataList setScrollbar">
      <div class="list" v-if="docOrMp4Drawer.list.length">
        <div class="item flexCenter" v-for="v in docOrMp4Drawer.list" :key="v" :class="docOrMp4Drawer.activeFile.id === v.id ? 'active' : ''">
          <div class="flexCenter left">
            <!-- <a-checkbox v-model:checked="v.checked"></a-checkbox> -->
            <div class="task_type" :style="{ color: v.type_obj.color}">{{v.type_obj.name}}</div>
            <span v-if="v.is_high" class="iconfont icon-gaopei gaopeiColor"></span>
            <div class="quName single_ellipsis">
              {{v.name}}
            </div>
          </div>
          <div class="flexCenter right">
            <div class="class-time">推荐课时 {{v.class_cnt}}</div>
            <div class="icon">
              <a-button class="iconfont" @click="getDetailFile(v)" type="text" :disabled="v.is_selected">
              {{ docOrMp4Drawer.selectListIds.includes(v.id) ? "取消" : "选择" }}
              </a-button>
              <!-- <a-button class='cursor' :type="v.generateLoad?'link':'text'" v-else @click="openEnv(statusList[k].id,k)"></a-button> -->
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
    @showSizeChange="showSizeChange"
    @change="pageChange"
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
import { useRouter, useRoute } from "vue-router";
import iconList from "src/utils/iconList";
import { IBusinessResp } from "src/typings/fetch.d";
import { getFileTypeIcon } from 'src/utils/getFileType'
import { bytesToSize } from "src/utils/common"
import request from "src/api/index";
import { getTypeList } from 'src/views/teacherModule/teacherExperimentResourcePool/config'
const route = useRoute();
const { courseId } = route.query;
const http = (request as any).teacherExperimentResourcePool;
interface Props { 
  selectList:any;     // 选中的文件对象
}
const props = withDefaults(defineProps<Props>(),{
  selectList: () => [],
});
// if(props.selectList && props.selectList.length){

// }
const emit = defineEmits<{
  (e: "selectSourceMaterialFile", val: any): void;
  (e: "preservation", val: any): void;
  
}>();
const docOrMp4Drawer: any = reactive({
  list: [],
  page: 1,
  limit: 10,
  name:'',
  totalCount: 0,
  loading: false,
  activeFile: {}, //  选择的素材
  selectList:[],   // 选择的实验
  selectListIds:[]  // 实验ids
});
// console.log(props.selectList)
if(props.selectList.length){
  props.selectList.forEach((v:any)=>{
    docOrMp4Drawer.selectList.push(v)
    docOrMp4Drawer.selectListIds.push(v.content_id)
  })
}
// console.log(docOrMp4Drawer)
const classNum=computed(()=>{
  let num=0
  if(docOrMp4Drawer.selectList.length){
    docOrMp4Drawer.selectList.forEach((v:any)=>{
      num+=Number(v.class_cnt)
    })
  }
  return num
})
var init_type:Ref<number>=ref(1)
const changeTab=(v:number)=>{
  init_type.value=v
  docOrMp4Drawer.page = 1;
  getExperiments()
}
const getDetailFile = (val:any) => {
  let n=docOrMp4Drawer.selectListIds.indexOf(val.id)
  if(n === -1){
    docOrMp4Drawer.selectList.push(val)
    docOrMp4Drawer.selectListIds.push(val.id)
  }else{
    docOrMp4Drawer.selectList.splice(n,1)
    docOrMp4Drawer.selectListIds.splice(n,1)
  }
};
// 获取实验列表
const getExperiments = () => {
  const {page,limit,name}=docOrMp4Drawer
  let obj={
    init_type:init_type.value,
    page,
    limit,
    name,
    course_id:courseId
  }
  docOrMp4Drawer.loading=true
  docOrMp4Drawer.list.length=0
 http.getExperimentList2({param:{...obj}}).then((res: IBusinessResp) => {
    docOrMp4Drawer.loading = false
    // if (!res) return
    const { list, page }  = res.data
    list.map((v: any) => {
      v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    docOrMp4Drawer.list.push(...list)
    docOrMp4Drawer.totalCount = page.totalCount
  })
};
const showSizeChange = (current: any,size: any) => {
  // console.log(size);
  docOrMp4Drawer.page = 1
  docOrMp4Drawer.limit = size;
  getExperiments();
};
const pageChange = (current: any) => {
  docOrMp4Drawer.page = current;
  getExperiments();
};
const selectDocOrMp4File = (val: any) => {
  docOrMp4Drawer.activeFile = { ...val};
  emit("selectSourceMaterialFile", val);
};
const searchDocOrMp4List = () => {
  docOrMp4Drawer.page = 1;
  getExperiments();
};
const Reselection=()=>{
  emit('preservation',docOrMp4Drawer.selectListIds)
}
const qingkong=()=>{
  docOrMp4Drawer.selectList=[]
  docOrMp4Drawer.selectListIds=[]
}
// watch(()=>{ return props.tags},(val:any)=>{
//   // console.log(val)
//   docOrMp4Drawer.page = 1;
//   getExperiments();
// })
onMounted(()=>{
  getExperiments();
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
  .baocun{
    .ant-btn-primary{
      font-size: 14px;
      box-shadow: none;
      text-shadow: none;
      height: 34px;
      border-radius: 17px;
      padding: 4px 27px;
    }
  }
}
.Exhibition{
  padding:0px 1rem 10px;
  margin-bottom: 20px;
  justify-content:space-between;
  .left{
    .num{
      color:var(--primary-color);
    }
  }
  .empty{
    cursor:pointer;
    color:var(--primary-color);
  }
}
.dataList {
    height: calc(100% - 175px);
    overflow: auto;
    .list {
      // padding: 0 20px;
      min-height: 500px;
      .item {
        height: 54px;
        background: #fafafa;
        // border-radius: 10px;
        margin-bottom: 20px;
        padding: 6px 1rem;
        justify-content:space-between;
        .left {
            // width: 55%;
            flex:1;
            .task_type{
              width:70px;
              margin-left: 1rem;
            }
          }
        .right {
          width:188px;
          justify-content: space-between;
          .class-time{
            color:var(--black-45);
          }
          .icon{
            // width: 60px;
            // margin-right:60px;
            .iconfont {
              color: var(--primary-color);
              // display: none;
            }
          }
        }
        .icon-gaopei{
            // font-size: 16px;
            margin-right: 4px;
            // margin-top: 2px;
          }
        .quName {
          // word-break: break-all;
          color: var(--black-85);
          max-width: 220px;
          // margin-bottom: 2px;
        }
      }
      .item:hover {
        background: #ffeed8;
        // border: 1px solid #ffcaa1;
        cursor: pointer;
        .tags{
          display: none;
        }
      }
      .active {
        background: #fffbf6;
        border: 1px solid #ffcaa1;
      }
    }
  }
</style>
