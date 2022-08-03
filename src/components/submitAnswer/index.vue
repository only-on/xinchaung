<template>
    <div class="sunmit_answer">
        <div class="answer_list">
            <div class="answer_list_top">
                <div class="countdown_div">
                    <a-statistic-countdown
                        title=""
                        :value="deadline"
                        style="margin-right: 50px"
                        @finish="onFinish"
                        format="m 分 s 秒"
                        :value-style="{color:'#EF9544'}"
                    />
                </div>
                 <div class="ifAnswered_div" v-for="(item,index) in dataList.list" :key="index">
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
                 <div class="identify">
                     <div class="colorIdentify brightBtn"></div>
                     <span class="hasAnswered">已答</span>
                     <div class="colorIdentify"></div>
                     <span>未答</span>
                 </div>
            </div>
             <div class="submit_test">
            <a-button type='primary' class="submit_btn">提交试卷</a-button>
            <div class="tip_info">得分在统一提交后，在成绩详情可以查看</div>
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
} from "vue";
import { Modal, message } from "ant-design-vue";
interface Props { 
  dataList:any;
}
const props = withDefaults(defineProps<Props>(),{
  dataList: () =>{},
});
const typeNames=['单选题','判断题','填空题','解答题','编程题','模型题']
const deadline=Date.now() + 1000 * 60 * 60 * 2 + 1000 * 30
function onFinish(){
      console.log('finished!');
}
</script>
<style lang="less" scoped>
.answer_list{
        width:300px;
        height: 300px;
        .answer_list_top{
           background-color: white; 
           .countdown_div{
               border-radius:10px 10px 0px 0px;
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
    .ifAnswered_div{
        padding:0px 10px;
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
    .identify{
        display: flex;
        padding:20px 10px;
        margin-top:50px;
        margin-bottom: 20px;
        border-top: 1px dashed rgba(0,0,0,0.07);
        .colorIdentify{
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background-color:#ededed;
        margin-right: 10px;
        }
        .brightBtn{
            background-color:var(--brightBtn);
        }
        .hasAnswered{
            margin-right: 20px;
        }
    }
    .submit_test{
        .submit_btn{
            width: 100%;
        }
        .tip_info{
            color:rgba(0,0,0,0.25);
            font-size: 12px;
            padding: 10px;
        }
    }
</style>