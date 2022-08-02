<template>
    <div class="answerQuesCom">
        <div class="list">
           <Outline :title="headerObj.title" :explain="headerObj.explain" :explainText="headerObj.explainText" />
            <TopicDisplay />
        </div>
        <div class="answer_list">
            <div class="answer_list_top">
                <div class="countdown_div">
                    <a-statistic-countdown
                        title=""
                        :value="deadline"
                        style="margin-right: 50px"
                        @finish="onFinish"
                        format="m 分 s 秒"
                    />
                </div>
                 <div v-for="(item,index) in dataList.list" :key="index">
                     <div>
                         <div class="name">
                         {{typeNames[item.type-1]}}
                        </div>
                        <div class="answerDiv">
                            <div v-for="(it,j) in item.quesList" :key="j" :class="['ifanswer',it.selectedAnswer?'answerd':'unanswer']">
                            {{j+1}}
                            </div>
                        </div>
                     </div>
                 </div>
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
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue";
import TopicDisplay from 'src/components/TopicDisplay/index.vue'
import Outline from 'src/components/TopicDisplay/outline.vue'
import dayjs, { Dayjs } from 'dayjs';
interface Props { 
  dataList:any;
}
const props = withDefaults(defineProps<Props>(),{
  dataList: () =>{},
});
const typeNames=['单选题','判断题','填空题','解答题','编程题','模型题']
const deadline=Date.now() + 1000 * 60 * 60 * 2 + 1000 * 30
const headerObj:any=reactive({
  title:'单元测验-《大学计算机基础第3版》第3、4章（一）-计算思维、数值与字符编码',
  explain:'作业/考试说明',
  explainText:'交互设计本质上就是设计产品的使用方式的过程，账号怎么填写；表单怎么导出；数据怎么筛选；列表怎么排序等等。针对每个功能的使用方式，都可以花很长的时间去考虑其合理性。一个项目的交互，就是这个项目所有功能使用方式的总和。',
})
function onFinish(){
      console.log('finished!');
};
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
        .answer_list_top{
           background-color: white; 
           .countdown_div{
               background-color:#EFF2E8;
               height:60px;
               color: var(--primary-color);
               display: flex;
               justify-content: center;
               align-items: center;
               font-size: 24px;
               >span{
                font-size: 16px;
               }
           }
        }
        .name{
            margin-top: 20px;
            margin-bottom: 5px;
        }
    }
    .quesType{
        padding:20px 0px;
    }
    .answerDiv{
        display: flex;
        flex-wrap: wrap;
    }
    .ifanswer{
        width: 34px;
        height: 34px;
        background-color: #ededed;
        margin-right: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
    }
    .answerd{
        background-color: var(--primary-color);
        color: white;
    }
}
</style>