<template>
    <div class="judge-box">
        <h2 class="question-title">{{index+1}}、{{modelValue.question}}</h2>
        
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
    props:['modelValue','index'],
    setup(props,{emit}) {
        const {modelValue,index} =toRefs(props)
        return {index,modelValue}
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
