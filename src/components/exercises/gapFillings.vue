<template>
    <div class="gap-filling-box">
        <h2 class="question-title">{{index}}、{{data.name}}</h2>
        <div class="answer-list">
            <div class="answer-item" v-for="(item,index) in data.options" :key="index.toString()"><label>答案{{Number(index)+1}}：</label><a-input></a-input></div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent,reactive,ref } from 'vue'

export default defineComponent({
    props:["index","modelValue"],
    setup(props) {
        const data:any=reactive(props.modelValue)
        const index=ref(props.index)

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
