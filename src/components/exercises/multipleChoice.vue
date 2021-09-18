<template>
    <div class="multiple-choice-box">
        <h2 class="question-title">{{index+1}}、{{data.question}}</h2>
        <a-checkbox-group class="answer-list" @change="answerChange" v-model:value="data.student_answer">
            <div v-for="(item,index) in data.options" :key="index.toString()">
                <a-checkbox class="answer-item"  :value="item.id" >{{numToAbc((Number(index))+1)}}、{{item.option}}</a-checkbox>  
            </div>
        </a-checkbox-group>
    </div>
</template>

<script lang="ts">
import { defineComponent,reactive ,ref,watch,toRefs,Ref} from 'vue'
import _ from "lodash"
import {numToAbc} from "src/utils/common"
export default defineComponent({
    props:['modelValue','index'],
    setup(props,{emit}) {
        const reactiveData:any=reactive({data:props.modelValue})
       
        const index=ref(props.index)
        let {data}=toRefs(reactiveData)

        watch(props,()=>{
            data.value=props.modelValue
            index.value=props.index
        },{deep:true,immediate:true})
        function answerChange(val:any){
            data.value.student_answer=val
            // emit("update:modelValue",data.value)
            emit("answerChange",data.value)
        }
        // 获取答案
        function getAnswer(ids:Array<number>,options:Array<any>){
            let answer:Array<any>=[]
            options.forEach((item)=>{
                if (ids.indexOf(item.id)!==-1) {
                    let temp={
                        id:item.id,
                        answer:item.option
                    }
                    answer.push(temp)
                }
            })
            return answer
        }
        return {data,answerChange,index,numToAbc}
    },
})
</script>



<style lang="less">
.multiple-choice-box{
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
