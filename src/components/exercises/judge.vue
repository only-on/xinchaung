<template>
    <div class="judge-box">
        <h2 class="question-title">{{index+1}}、{{data.name}}</h2>
        
        <a-radio-group class="answer-list" @change="answerChange" v-model:value="data.answers[0].id">
            <div v-for="(item,index) in data.options" :key="index.toString()">
                <a-radio class="answer-item"  :value="item.id" >{{item.option}}</a-radio>
            </div>
            
        </a-radio-group>
    </div>
</template>

<script lang="ts">
import { defineComponent,reactive ,ref} from 'vue'
import {AnswerType} from "./exercises.type"
import _ from "lodash"
export default defineComponent({
    props:['modelValue','index'],
    setup(props,{emit}) {
        const data:any=reactive(props.modelValue)
        const index=ref(props.index)
        function answerChange(val:Event){
            data.answers[0].answer=getAnswer(data.answers[0].id,data.options)
            emit("update:modelValue",data)
        }
        // 获取答案
        function getAnswer(id:number,options:Array<any>){
           let i= _.findIndex(options,(o:any)=>{
                return id===o.id
            })
            return options[i].option
        }
        return {data,answerChange,index}
    },
})
</script>



<style lang="less">
.judge-box{
    .question-title{
        white-space: normal;
        font-size: 14px;
        text-align: justify;
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
