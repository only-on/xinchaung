<template>
    <div>
        <div class="exerciseList">
        <div class="directoryList">
            <div class="data-set-listItem" v-for="(item,index) in componentData" :key="index.toString()">
                <div class="exam-list-title">{{item.name}}</div>
                <div class="exam-list-time"><i class="iconfont icon-shijian"></i>{{item.created_at.split(" ")[0]}}</div>
                <div class="exam-list-num"><i class="iconfont icon-xiangmu"></i>{{item.questions_count}}</div>
                <div class="exam-list-delete" @click="deleteExamItem(item.id)"><i class="iconfont icon-shanchu-copy"></i></div>
            </div>
        </div>
    </div>
    </div>
</template>
<script lang="ts">
import {defineComponent,}from 'vue'
import request from "../../../api";
interface paramsType{
    pool_id:string
}
export default defineComponent({
    name:'privateExercises',
    props: ["componentData"],
     setup:(props,{emit})=>{
        const teacherDataExerApi = (request as any).teacherDataExercises
        function deleteExamItem(id:any){
            console.log(id,'id')
           const params: paramsType={pool_id:id}
           teacherDataExerApi.deleteExercise({urlParams:params})
           emit('pool_id',id)
        }
        return {deleteExamItem}
    }
})
</script>
<style lang="less" scoped>
    .data-set-listItem{
        border-radius: 5px;
        border: 1px solid #DDDDDD;
        padding: 6px 10px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        cursor: pointer;
        transition: all 0.5s;  
        height: 60px;
        align-items: center;
        .exam-list-title {
        width: 50%;
        margin-left: 25px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #595B5A;
        font-size: 16px;
        cursor: pointer;
        margin-right: 10%;
    }
    .exam-list-time{
        width: 10%;
        height: 30px;
        display: flex;
        align-items: center;
        color: #B7B7B7;
        .icon-shijian{
            margin-right: 5px;
            font-size: 12px;
        }
    }
    .exam-list-num {
        width: 10%;
        height: 30px;
        display: flex;
        align-items: center;
        color: #B7B7B7;
        .icon-xiangmu{
            margin-right: 5px;
            font-size: 12px;
        }
    }
    .exam-list-delete{
        margin-right: 25px;
    }
    .icon-shanchu-copy{
         font-size:16px;
         color: #B7B7B7;
    }
}

</style>