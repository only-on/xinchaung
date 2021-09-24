<template>
    <div class="exerciseList">
        {{componentData}}
        <div class="directoryList">
            <div class="data-set-listItem" v-for="(item,index) in componentData" :key="index.toString()">
                <div class="exam-list-title">{{item.name}}</div>
                <div class="exam-list-time"><i class="iconfont icon-shijian"></i>{{item.created_at}}</div>
                <div class="exam-list-num"><i class="iconfont icon-xiangmu"></i>0</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent,inject,Ref,ref,toRefs} from 'vue'
export default defineComponent({
    setup:(props:any,context:any)=>{
        console.log(inject('componentData'),'componentDatalist')
        var componentData:any=[]
        componentData=inject('componentData')
        return {componentData}
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
}

</style>