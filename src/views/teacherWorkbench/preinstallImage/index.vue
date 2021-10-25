<template>
    <div class="preinstallImage">
        <div>
            <a-input-search placeholder="请输入关键字查询" v-model:value='imageName' style="width: 506px" @search="onSearch" />
        </div>
        <div class='image-list'>
            <div class="image-item" v-for="(item,index) in mirrorList" :key="index.toString()">
                <div class="image-base">
                    <h3 class="image-name">{{item.name}}</h3>
                    <div class="type">{{item.tag.join()}}</div>
                    <div class="memory">
                        <div>容量:{{item.size}}</div>
                        <div>系统：{{item.classify.name}}</div>
                    </div>
                    <img src="">
                </div>
                <div class="image-desc">
                    <p>暂无介绍</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent,onMounted,reactive,toRefs } from 'vue'
import {getPresetMirror} from "../api"
interface IparamsType{
    name:string,
    limit:number,
    withs:string,
    page:number,
    is_init: number
}
interface Istate{
    imageName?:string,
    params:IparamsType,
    mirrorList:any[]
}
export default defineComponent({
    setup() {
         const state:Istate=reactive({
             params:{
                name:'',
                limit:16,
                withs:'classify',
                page:1,
                is_init:1
             },
             mirrorList:[]
        })
        const methods={
            onSearch(){
                console.log(state.imageName)
            },
            PresetMirror(){
                getPresetMirror(state.params).then((res:any)=>{
                    console.log(res)
                    state.mirrorList=res.data.list
                })
            }
        }
        onMounted(()=>{
            methods.PresetMirror()
        })
        return {...toRefs(state),...methods}
    },
})
</script>
<style lang="less">
.image-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.image-item {
    width: 24%;
    margin-top: 20px;
    background: #fff;
    height: 240px;
    transition: .5s;
    box-sizing: border-box;
    box-shadow: 0px 0px 3px 0px rgb(0 0 0 / 17%);
}
.image-base {
    flex-shrink: 0;
    background: linear-gradient(135deg,#b17cde,#7a87f5 99%);
    border-radius: 4px 4px 0 0;
    position: relative;
    padding: 14px;
    height: 100px;
    .image-name{
        color:white;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .type{
        font-size: 12px;
        color:#ffde00;
    }
    .memory{
        font-size: 15px;
        line-height: 25px;
        color: hsla(0,0%,100%,.5);
    }
}
.image-desc {
    padding: 14px;
    font-size: 12px;
    color: rgba(13,8,17,.55);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.memory{
    display: flex;
}
</style>