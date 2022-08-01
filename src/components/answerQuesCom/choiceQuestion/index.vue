<template>
    <div class="ques">
        <div>第{{NoToCh(queNumber+1)}}题</div>
        <div>
            {{ quesItem.ques}}
        </div>
         <a-checkbox-group v-model:value="value" style="width: 100%" @change='change'>
            <div v-for="(ans,n) in quesItem.quesAnswer" :key="n">
              <a-checkbox :value="selectChoice[n]">{{selectChoice[n]}}、{{ans}}</a-checkbox>
            </div>
        </a-checkbox-group>
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
const selectChoice:any=['A','B','C','D','E','F']
var emit = defineEmits<{(e:"update:selectedAnswer",selectedAnswer:any): void}>();
function change(checkedValue:any){
    console.log(checkedValue)
    emit("update:selectedAnswer",checkedValue);
}
</script>
<style lang="less" scoped>
.ques{
   background-color: #F9F9F9;
   padding:24px 24px 10px 24px;
   >div{
       margin-bottom: 10px;
   }
}
</style>