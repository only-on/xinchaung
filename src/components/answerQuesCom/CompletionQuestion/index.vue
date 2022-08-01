<template>
    <div class="ques">
        <div>第{{NoToCh(queNumber+1)}}题</div>
        <div>
            {{ quesItem.ques}}
        </div>
        <div v-for="(ans,n) in quesItem.quesAnswer" :key="n">
              <div>
                  填空{{n+1}} <a-input v-model:value="selectedAnswer[n]" @change="change"/>
              </div>
        </div>
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
  selectedAnswer:()=>[],
});
var value:any=ref([])
var emit = defineEmits<{(e:"update:selectedAnswer",selectedAnswer:any): void}>();
function change(val:any){
    console.log(value.value)
    emit("update:selectedAnswer",value.value);
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