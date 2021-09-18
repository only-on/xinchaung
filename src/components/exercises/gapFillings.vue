<template>
    <div class="gap-filling-box">
        <h2 class="question-title">{{index+1}}、{{data.question}}</h2>
        <div class="answer-list">
            <div class="answer-item" v-for="(item,index) in data.answers" :key="index.toString()"><label>答案{{Number(index)+1}}：</label><a-input v-model:value="data.student_answer[index]"></a-input></div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent,reactive,ref,watch,toRefs } from 'vue'

export default defineComponent({
    props:["index","modelValue"],
    setup(props,{emit}) {
        const reactiveData:any=reactive({data:props.modelValue})
        const index=ref(props.index)
        const {data}=toRefs(reactiveData)
        watch(props,()=>{
            data.value=props.modelValue
            index.value=props.index
        },{deep:true,immediate:true})

        watch(()=>props.modelValue,()=>{
            emit("answerChange",data.value)
        },{deep:true})
        return {
            data,
            index
        }
    },
})
</script>

<style lang="less">
.gap-filling-box{
    .question-title{
        white-space: normal;
        font-size: 14px;
        text-align: justify;
    }
    .answer-list{
        .answer-item{
            display: flex;
            flex-direction: row;
            margin-bottom: 20px;
            font-size: 14px;
            >label{
                width: 80px;
                line-height: 35px;
            }
        }
    }
}
</style>
