<template>
    <div class="single-choice-box">
        <h2 class="question-title">{{index+1}}、{{data?.question}}</h2>
        <a-radio-group class="answer-list" @change="answerChange" v-model:value="data.answers[0].id">
            <div v-for="(item,index) in data.options" :key="index.toString()">
                <a-radio class="answer-item"  :value="item.id" >{{item.option}}</a-radio>
            </div>
        </a-radio-group>
    </div>
</template>

<script lang="ts">
import { defineComponent,reactive ,ref,watch,toRefs} from 'vue'
import _ from "lodash"
export default defineComponent({
    props:['modelValue','index'],
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
            
        },{deep:true})
        function answerChange(val:Event){
            data.value.answers[0].answer=getAnswer(data.value.answers[0].id,data.value.options)
            emit("update:modelValue",data.value)
            emit("answerChange",data.value)
        }
        // 获取答案
        function getAnswer(id:number,options:Array<any>){
           let i= _.findIndex(options,(o:any)=>{
                return id===o.id
            })
            return options[i].option
        }
        return {data,answerChange,index,...toRefs(reactiveData)}
    },
})
</script>



<style lang="less">
.single-choice-box{
    .question-title{
        white-space: normal;
        font-size: 14px;
        text-align: justify;
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