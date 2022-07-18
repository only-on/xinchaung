<template>
  <div class="Category flexCenter" v-for="(v,k) in totalList" :key="`${k}${v.uid}`" :class="v.id === props.activeItem.fileItem.id?'CategoryActive':''">
    <div class="upper"  @click="selectFile(v)">
      <div class="iconBox">
        <CaretDownOutlined v-show="v.children && v.children.length && v.show"/>
        <CaretRightOutlined v-show="v.children && v.children.length && !v.show"/>
      </div>
      <span class="itemImg" :style="`background-image: url(${getFileTypeIcon(v.file_name)});`"></span>
      <span class="name single_ellipsis" :title="v.file_name">{{v.file_name}}</span>
    </div>
    <div class="flexCenter level" v-if="v.children && v.children.length && v.show">
      <FileList :FileList="v.children" @selectFile="selectFile"  :activeItem="props.activeItem"/>
    </div>
  </div>
  <div class="more" v-if="currentPage !==PageCount && props.FileList.length" @click="changePage()">加载更多</div>
  <div v-if="!props.FileList.length">
    <Empty :text="'暂无文件'" />
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  Ref,
  computed,
  reactive,
  defineProps,
  withDefaults,
  watch
} from "vue";
import { getFileTypeIcon } from 'src/utils/getFileType'
import {CaretDownOutlined,CaretRightOutlined} from '@ant-design/icons-vue';

interface Props {
  FileList: any[];
  activeItem: any
}
const emit = defineEmits<{
  (e: "selectFile", val: any): void;
}>();
const props = withDefaults(defineProps<Props>(), {
  FileList: () => [],
  activeItem: {}
});

// const List:any=reactive([])
var currentPage: Ref<number> = ref(1);
var PageCount: Ref<number> = ref(1);
var limit: Ref<number> = ref(9);


var totalList:any=computed(()=>{
  let arr:any=[]
  let curLength=currentPage.value * limit.value
  let length=curLength > props.FileList.length ? props.FileList.length : curLength
  // console.log(length-1)
  props.FileList.forEach((v:any,k:number)=>{
    if(k <= length-1){
      arr.push(v)
    }
  })
  if(props.FileList.length){
    // console.log(props.FileList)
    PageCount.value=Math.ceil(props.FileList.length / limit.value)
    // List.push(...props.FileList)
  }
  // console.log('totalList:',arr)
  return arr
})
watch(()=>{ return props.FileList},(val)=>{
  currentPage.value=1
},{immediate:true,deep:true})
const changePage=()=>{
  currentPage.value = currentPage.value < PageCount.value ? currentPage.value += 1 :PageCount.value
}

const selectFile=(val:any)=>{
  // console.log('1',val.name)
  if(val.children && val.children.length){
    val.show=!val.show
  }else{
    props.activeItem.fileItem=val
    emit('selectFile',val)
  }
}
</script>
<style scoped lang="less">
.Category{
  line-height: 40px;
  cursor: pointer;
  flex-direction: column;
  
  .iconBox{
    width: 12px;
    span{
      color: var(--black-45);
      font-size: 12px;
    }
  }
  .itemImg{
    width: 16px;
    height: 16px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .name{
    color: #808080;
    font-size: var(--font-size-sm);
    margin-left: 10px;
    max-width: 100px;
  }
}
.CategoryActive{
  background-color: rgba(255,238,216,0.56);
}
.upper{
  display: flex;
  width: 100%;
  align-items: center;
}
.level{
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: normal;
  padding-left: 20px;
}
.more{
  text-align: center;
  color: var(--black-65);
  line-height: 40px;
  cursor: pointer;
}
</style>
