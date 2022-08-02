<template>
    <div class="ques">
        <div>第{{NoToCh(queNumber+1)}}题</div>
        <div>
            {{ quesItem.ques}}
        </div>
         <a-radio-group v-model:value="value" style="width: 100%" @change='change'>
            <div><a-radio :value="0">正确</a-radio></div>
            <div><a-radio :value="1">错误</a-radio></div>
        </a-radio-group>
    </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
  defineProps,
  withDefaults
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import choiceQuestion from './choiceQuestion/index.vue'
import { number } from "echarts";
import { NoToCh } from "src/utils/common";
interface Props { 
  quesItem:any;
  queNumber:Number;
selectedAnswer:any;
}
const props = withDefaults(defineProps<Props>(),{
  quesItem: () =>{},
  queNumber:()=>1,
  selectedAnswer:()=>null,
});
var value:any=ref([])
var emit = defineEmits<{(e:"update:selectedAnswer",selectedAnswer:any): void}>();
function change(checkedValue:any){
    console.log(checkedValue)
    emit("update:selectedAnswer",checkedValue);
}
</script>
<style lang="less" scoped>
.ques{
   background-color: #F9F9F9;
   padding:10px 24px;
   >div{
       margin-bottom: 10px;
   }
}
</style>