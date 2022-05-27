<template>
    <div class="chooseStyles">
        <div class="styleItem" v-for="(item,index) in data" :key="index">
            <a-radio-group v-model:value="checkVal" class="radioGroup" @change="handleChange" :disabled="disabled">
                <a-radio class="radio" :value="item.value">
                    <div v-if="type=='img'" class="imgBox">
                        <img :src="item.label">
                        <div class="mask"></div>
                    </div>
                    <div v-else class="colorBox" :style="{backgroundColor:item.label}"></div>
                </a-radio>
            </a-radio-group> 
            <div class="titleInfo">{{titleInfo}}</div> 
        </div>
    </div>
</template>
<script lang="ts" setup>
  import {
      defineComponent,
      ref,
      onMounted,
      reactive,
      inject,
      watch
    } from "vue";
interface Props {
    titleInfo?: string;
    type?:string;
    data?:any;
    checkVal?: any;
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    titleInfo: '',
    type: '',
    data:{},
    checkVal: '',
    disabled: false
});
const checkVal = ref<any>()
watch(()=>props.checkVal, newVal => {
  checkVal.value = newVal
},{immediate: true})
const emit = defineEmits<{
  (e: "update:checkVal", val: number): void;
}>();
const handleChange = (e:any) => {
  emit('update:checkVal', checkVal.value)
}
</script>
<style lang="less" scoped>
 .chooseStyles{
     display: flex;
     justify-content: space-between;
 }  
 .styleItem{
     position: relative;
 }
 .titleInfo{
     color:#808294;
     width: 100%;
     text-align: center;
 }
 .imgBox{
    border: 1px solid #808294;
    padding: 2px;
    position: relative;
    .mask{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: var(--white-45);
      display: none;
    }
 }
 .colorBox{
     width:348px;
     height: 40px;
 }
 .radio {
     display: block;
    :deep(.ant-radio-inner ){
      width: 20px;
      height: 20px;
      position: absolute;
      top: 5px;
      left:320px;
      z-index: 9;
    }
    :deep(.ant-radio-input ){
      width: 16px;
      height: 16px;
    }
    /* 单选选中样式 */
    :deep(.ant-radio-checked){
      .ant-radio-inner {
        background-color: #FF9544;
        border: none;
      }
      &+span{
        .imgBox{
          border-color: var(--primary-color);
          .mask{
            display: block;
          }
        }
      }
    }
    :deep(.ant-radio-inner::after ){
      content: "";
      width: 12px;
      height: 8px;
      border: 2px solid white;
      border-top: transparent;
      border-right: transparent;
      text-align: center;
      display: block;
      position: absolute;
      top: 4px;
      left: 4px;
      transform: rotate(-45deg);
      border-radius: 0px;
      background: none;
    }
  }
  .radioGroup{
      display:block;
  }
</style>