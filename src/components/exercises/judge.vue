<template>
    <div class="judge-box">
        <h2 class="question-title">{{index+1}}、{{modelValue.question}}<i class="correct-answer" v-if="isShowAnswer">(正确答案：{{getAnswer(modelValue.answers[0].answer,modelValue.options)}})</i></h2>
        
        <a-radio-group class="answer-list" v-model:value="modelValue.student_answer[0]">
            <div v-for="(item,index) in modelValue.options" :key="index.toString()">
                <a-radio class="answer-item"  :value="item.id" >{{item.option}}</a-radio>
            </div>
            
        </a-radio-group>
    </div>
</template>

<script lang="ts">
import { defineComponent,reactive ,ref, toRefs,watch} from 'vue'
import _ from "lodash"
export default defineComponent({
    props:['modelValue','index','isShowAnswer'],
    setup(props,{emit}) {
        const {modelValue,index} =toRefs(props)
        // 获取答案
        function getAnswer(id:number,options:Array<any>){
            console.log(id,options);
            
           let i= _.findIndex(options,(o:any)=>{
                return Number(id)===o.id
            })
            console.log(i);
            
            return options[i].option
        }
        return {index,modelValue,getAnswer}
    },
})
</script>



<style lang="less">
.judge-box{
    .question-title{
        white-space: normal;
        font-size: 14px;
        text-align: justify;
        .correct-answer{
            color: #FF8F00;
            font-style: normal;
            margin-left: 10px;
        }
    }
    .answer-list{
        .answer-item{
            margin-bottom: 10px;
            font-size: 14px;
            .ant-radio-checked{
                 vertical-align: middle;
            }
           
        }
    }
}
</style>
