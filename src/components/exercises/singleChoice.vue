<template>
    <div class="single-choice-box">
        <h2 class="question-title">{{index+1}}、{{data?.question}}<i class="correct-answer" v-if="isShowAnswer">(正确答案：{{getAnswer(data.answers[0].answer,data.options)}})</i></h2>
        <a-radio-group class="answer-list" @change="answerChange" v-model:value="data.student_answer[0]">
            <div v-for="(item,index) in data.options" :key="item.id">
                <a-radio class="answer-item"  :value="item.id" >{{numToAbc(Number(index)+1)}}、{{item.option}}</a-radio>
            </div>
        </a-radio-group>
    </div>
</template>

<script lang="ts">
import { defineComponent,reactive ,ref,watch,toRefs} from 'vue'
import _ from "lodash"
import {numToAbc} from "src/utils/common"
import { number } from 'echarts'
export default defineComponent({
    props:['modelValue','index','isShowAnswer'],
    setup(props,{emit}) {
        const reactiveData:any=reactive({data:props.modelValue})
        const index=ref(props.index)
        let {data}=toRefs(reactiveData)
        console.log(data);
        
        watch(props,()=>{
            console.log(props);
            data.value=props.modelValue
            index.value=props.index
            console.log(data);
            
        },{deep:true,immediate:true})
        function answerChange(val:Event){
            // data.value.answers[0].answer=getAnswer(data.value.answers[0].id,data.value.options)
            emit("update:modelValue",data.value)
            emit("answerChange",data.value)
        }
        // 获取答案
        function getAnswer(id:number,options:Array<any>){
            console.log(id,options);
            
           let i= _.findIndex(options,(o:any)=>{
                return Number(id)===o.id
            })
            console.log(i);
            
            return numToAbc(i+1)
        }
        return {data,answerChange,index,...toRefs(reactiveData),numToAbc,getAnswer}
    },
})
</script>



<style lang="less">
.single-choice-box{
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
            font-size: 14px;
            margin-bottom: 10px;
            .ant-radio-checked{
                 vertical-align: middle;
            }
           
        }
    }
}
</style>