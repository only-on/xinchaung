<template>
    <div class="multiple-choice-box">
        <h2 class="question-title">{{index+1}}、{{data.name}}</h2>
        <a-checkbox-group class="answer-list" @change="answerChange" v-model:value="answers">
            <div v-for="(item,index) in data.options" :key="index.toString()">
                <a-checkbox class="answer-item"  :value="item.id" >{{item.option}}</a-checkbox>  
            </div>
        </a-checkbox-group>
    </div>
</template>

<script lang="ts">
import { defineComponent,reactive ,ref} from 'vue'
import _ from "lodash"
export default defineComponent({
    props:['modelValue','index'],
    setup(props,{emit}) {
        const data:any=reactive(props.modelValue)
        const index=ref(props.index)
        const answers=ref([])
        function answerChange(val:any){
            data.answers=getAnswer(val,data.options)
            emit("update:modelValue",data)
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
        return {data,answerChange,index,answers}
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
