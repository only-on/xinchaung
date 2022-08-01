<template>
    <div class="answerQuesCom">
        <div class="list">
           <div class="title">{{dataList.title}}</div> 
           <div class="tip">
               <div class="tip_name">考试说明</div>
               <div>交互设计本质上就是设计产品的使用方式的过程，账号怎么填写；表单怎么导出；数据怎么筛选；列表怎么排序等等。针对每个功能的使用方式，都可以花很长的时间去考虑其合理性。一个项目的交互，就是这个项目所有功能使用方式的总和。</div>
           </div>
           <div>
               <div v-for="(item,index) in dataList.list" :key="index">
                   <!-- 单选题 -->
                   <div v-if="item.type==1">
                       <div class="quesType">单选题<span>共 {{}}题 共{{}}分</span></div>
                       <div class="quesList">
                           <div v-for="(it,j) in item.quesList" :key="j">
                           <choice-question :quesItem='it' :queNumber='j' v-model:selectedAnswer='it.selectedAnswer' ></choice-question>
                       </div>
                       </div>
                   </div>
                   <!-- 判断题 -->
                    <div v-if="item.type==2">
                        <div class="quesType">判断题<span>共 {{}}题 共{{}}分</span></div>
                         <div v-for="(it,j) in item.quesList" :key="j">
                           <judge-question :quesItem='it' :queNumber='j' v-model:selectedAnswer='it.selectedAnswer' ></judge-question>
                         </div>
                    </div>
                    <!-- 填空题 -->
                     <div v-if="item.type==3">
                        <div class="quesType">填空题<span>共 {{}}题 共{{}}分</span></div>
                         <div v-for="(it,j) in item.quesList" :key="j">
                           <completion-question :quesItem='it' :queNumber='j' v-model:selectedAnswer='it.selectedAnswer' ></completion-question>
                         </div>
                    </div>
                    <!-- 解答题 -->
                    <div v-if="item.type==4">
                        
                    </div>
               </div>
           </div>
        </div>
        <div class="answer_list">

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
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import choiceQuestion from './choiceQuestion/index.vue'
import judgeQuestion from './judgeQuestion/index.vue'
import completionQuestion from './completionQuestion/index.vue'
interface Props { 
  dataList:any;
}
const props = withDefaults(defineProps<Props>(),{
  dataList: () =>{},
});
</script> 
<style lang="less" scoped>
.answerQuesCom{
    display: flex;
    .list{
        background: white;
        flex: 1;
        padding:40px;
        .title{
        font-size: 18px;
        font-weight:bold;
        margin-bottom: 24px;
        width: 100%;
        text-align: center;
        }
        .tip{
            background-color: #F9F9F9;
            padding: 24px;
           >div:nth-child(1){
               width: 100%;
               text-align: center;
               margin-bottom:16px;
           }
        }
    }
    .answer_list{
        width:300px;
        height: 300px;
    }
    .quesType{
        padding:20px 0px;
    }
}
</style>