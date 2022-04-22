<template>
  <div v-if="docOrMp4Drawer.visible">
    <a-drawer
      class="ExperimentsAndMaterials"
      :destroyOnClose="true"
      :closable="false"
      placement="right"
      :visible="true"
      width="640"
      @close="closeDrawerDoc"
  >
  <div class="select flexCenter">
    <div class="flexCenter type">
      <span @click="selectType(1)" :class="selectNum === 1?'active':''">实 验</span>
      <span @click="selectType(2)" :class="selectNum === 2?'active':''">备课资料</span>
    </div>
    <span class="iconfont icon-guanbi" @click="closeDrawerDoc"></span>
  </div>
  <div v-if="selectNum === 2" class="flexCenter classifyTabs tags">
    <span :class="tags === '教学指导'? 'active':''" @click="changeTab('教学指导')">教学指导</span>
    <span :class="tags === '备课资料'? 'active':''" @click="changeTab('备课资料')">备课资料</span>
    <span :class="tags === '课件'? 'active':''" @click="changeTab('课件')">课件</span>
  </div>
  <SourceMaterial v-if="selectNum === 2" :activeFile="docOrMp4Drawer.activeFile" :tags="tags" @selectSourceMaterialFile="selectSourceMaterialFile"/>
  <Experiments v-if="selectNum === 1" :selectList="docOrMp4Drawer.selectList" @preservation="preservation" />
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

import iconList from "src/utils/iconList";
import { bytesToSize } from "src/utils/common"
import { SelectTypes } from "ant-design-vue/es/select";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import SourceMaterial from './SourceMaterial.vue'
import Experiments from './Experiments.vue'
const http = (request as any).teacherMaterialResource;
var selectNum:Ref<number>=ref(1)
// 采用ts专有声明，有默认值
interface Props {
  visible: boolean;
  activeFile?:any;
  selectList?:any
}
const props = withDefaults(defineProps<Props>(), {
  visible:false,
  selectList: () => [],
  activeFile: () => {},
});
// console.log(props)
const emit = defineEmits<{
  (e: "selectDocOrMp4File", val: any): void;
  (e: "closeDrawerDoc"): void;
}>();
const docOrMp4Drawer: any = reactive({
  visible: false,
  activeFile: {}, //  选择的素材
  selectList:[]   //  选择的实验
});

docOrMp4Drawer.activeFile={ ...props.activeFile}
docOrMp4Drawer.selectList={ ...props.selectList}


var tags:Ref<string>=ref('教学指导')

const changeTab=(v:string)=>{
  tags.value=v
}

const selectType=(v:number)=>{
  selectNum.value=v
}

watch(()=>{return props.visible},(val:boolean)=>{
  docOrMp4Drawer.visible=props.visible
  // console.log(val)
},{immediate:true})

const preservation=(val:any)=>{
  // docOrMp4Drawer.selectList={...val}
  let obj={
    type:selectNum.value,
    list:val
  }
  emit("selectDocOrMp4File",obj);
}

const closeDrawerDoc = () => {
  emit("closeDrawerDoc");
};
const selectSourceMaterialFile=(val:any)=>{
  console.log(val)
  let obj={
    type:2,
    item:val
  }
  emit("selectDocOrMp4File", obj);
}
</script>
<style scoped lang="less">
.ExperimentsAndMaterials {
  .select{
    justify-content:space-between;
    .type{
      margin-bottom:24px;
      span{
        border-bottom: 4px solid transparent;
        margin-right: 50px;
        padding-bottom: 8px;
        cursor: pointer;
        color:var(--black-45);
      }
      .active{
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }
    .iconfont{
      cursor:pointer;
    }
  }
  .tags{
    width:300px;
    margin-bottom:24px;
  }
}
.ant-pagination {
  text-align: center;
  
}
</style>
