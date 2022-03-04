<template>
  <div class="Category flexCenter" v-for="v in props.FileList" :key="v.name" :class="v.name === activeItem.fileItem.name?'CategoryActive':''">
    <div class="upper"  @click="select(v)">
      <div class="iconBox">
        <CaretDownOutlined v-if="v.children && v.children.length && v.show"/>
        <CaretRightOutlined v-if="v.children && v.children.length && !v.show" />
      </div>
      <span class="itemImg" :style="`background-image: url(${iconList[getFileType(v.name)]});`"></span>
      <span class="name single-ellipsis">{{v.name}}</span>
    </div>
    <div class="flexCenter level" v-if="v.children && v.children.length && v.show" >
      <FileList :FileList="v.children" @selectFile="itemFile" />
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
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import iconList from 'src/utils/iconList'
import { getFileType } from 'src/utils/getFileType'
import {CaretDownOutlined,CaretRightOutlined} from '@ant-design/icons-vue';

// 采用ts专有声明，有默认值
interface Props {
  FileList: any[];
}
const emit = defineEmits<{
  (e: "selectFile", val: any): void;
}>();
const props = withDefaults(defineProps<Props>(), {
  FileList: () => [],
});
const activeItem:any=reactive({
  fileItem:{},
})
const select=(val:any)=>{
  console.log(val.name)
  if(val.children && val.children.length){
    val.show=!val.show
  }else{
    activeItem.fileItem=val
    emit('selectFile',val)
  }
}
const itemFile=(val:any)=>{
  if(val.children && val.children.length){
    val.show=!val.show
  }else{
    activeItem.fileItem=val
    emit('selectFile',val)
    // select(val)
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
  opacity: 0.56;
  background-color: #ffeed8;
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
</style>
