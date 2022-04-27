<template>
    <div class="chooseStyles">
        <div class="styleItem" v-for="(i,index) in data">
            <a-radio-group v-model:value="value" class="radioGroup">
                <a-radio class="radio" :value="index">
                    <div v-if="type=='img'" class="imgBox">
                        <img :src="i">
                    </div>
                    <div v-else class="colorBox" :style="{backgroundColor:i}"></div>
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
      inject
    } from "vue";
interface Props {
    titleInfo?: any;
    type?:any;
    data?:any;
}

const props = withDefaults(defineProps<Props>(), {
    titleInfo: { },
    type:{},
    data:{}
});
const value:any=ref()
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
    }
    :deep(.ant-radio-input ){
      width: 16px;
      height: 16px;
    }
    /* 单选选中样式 */
    :deep(.ant-radio-checked .ant-radio-inner ){
      background-color: #FF9544;
      border: none;
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