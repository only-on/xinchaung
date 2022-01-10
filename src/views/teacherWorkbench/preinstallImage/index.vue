<template>
    <div class="preinstallImage">
        <div>
            <a-input-search placeholder="请输入关键字查询" v-model:value='imageName' style="width: 506px" @search="onSearch" />
        </div>
        <div v-if="ifTip" class="loading">
            <a-spin tip="加载中...">
            <div class="spin-content">
            </div>
            </a-spin>
        </div>
        <div v-else>
            <div v-if="total" class='image-list'>
                <div class="image-item" v-for="(item,index) in mirrorList" :key="index.toString()">
                    <div class="image-base">
                        <h3 class="image-name">{{item.name}}</h3>
                        <div class="type">{{item.tag.join('/')}}</div>
                        <div class="memory">
                            <div>容量:{{item.size}}</div>
                            <div>系统：{{item.classify.name}}</div>
                        </div>
                        <img class="img-type" v-if="item.ostypes==='kvm'" :src="kvmImg">
                        <img class="img-type" v-if="item.ostypes==='docker'" :src="dockerImg">
                    </div>
                    <div class="image-desc">
                        <p v-if="item.description!==''">{{item.description}}</p>
                        <p v-else>暂无介绍</p>
                    </div>
                </div>
            </div>
            <empty v-else></empty>
        </div>
        <div class="pagination">
            <a-pagination :hideOnSinglePage='true' :defaultPageSize='params.limit' @change='pageChange' v-model:value="current" :total="total"/>
        </div>
       
    </div>
</template>
<script lang="ts">
import { defineComponent,onMounted,reactive,toRefs } from 'vue'
import {getPresetMirror} from "../api"
import Empty from 'src/components/Empty.vue'
import  kvmImg from "src/assets/images/workbench/kvm.png"
import dockerImg from "src/assets/images/workbench/docker.png"
interface IparamsType{
    name:string,
    limit:number,
    withs:string,
    page:number,
    is_init: number
}
interface Istate{
    imageName:string,
    params:IparamsType,
    mirrorList:any[],
    current:number,
    total:number,
    ifTip:boolean,
}
export default defineComponent({
    name:'preinstallImage',
    components:{
       Empty 
    },
    setup() {
         const state:Istate=reactive({
             params:{
                name:'',
                limit:12,
                withs:'classify',
                page:1,
                is_init:1
             },
             mirrorList:[],
             imageName:'',
             current:1,
             total:0,
             ifTip:true
        })
        const methods={
            onSearch(){
                state.params.name=state.imageName
                methods.PresetMirror()
            },
            PresetMirror(){
                state.ifTip=true
                getPresetMirror(state.params).then((res:any)=>{
                    state.mirrorList=res.data.list
                    state.total=res.data.page.totalCount
                    state.ifTip=false
                })
            },
            pageChange(page:any){
                state.params.page=page
                methods.PresetMirror()
            }
        }
        onMounted(()=>{
            methods.PresetMirror()
        })
        return {...toRefs(state),...methods,kvmImg,dockerImg}
    },
})
</script>
<style lang="less">
.preinstallImage{
    .loading{
        padding:245px;
    }
    .spin-content {
    padding: 30px;
    }
}
.image-list{
    display: flex;
    flex-wrap: wrap;
}
.image-item {
    width: 24%;
    margin-top: 20px;
    background: #fff;
    height: 240px;
    transition: .5s;
    box-sizing: border-box;
    box-shadow: 0px 3px 6px 0px var(--black-0-7);
    margin-right: 14px;
}
.image-item:nth-child(4n){
    margin-right: 0px;
}
.image-base {
    flex-shrink: 0;
    // background: linear-gradient(45deg,var(--purpleblue-5), var(--blue-4) );
    background: linear-gradient(45deg, #6C70EA, #69C0FF);
    border-radius: 4px 4px 0 0;
    position: relative;
    padding: 14px;
    height: 100px;
    .image-name{
        color:white;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .type{
        font-size: 12px;
        color:#ffde00;
    }
    .memory{
        font-size: 12px;
        line-height: 25px;
        color: hsla(0,0%,100%,.5);
    }
    .img-type{
        position: absolute;
        right: 20px;
        bottom: -15px;
        width: 64px;
        height: 64px;
        box-shadow: 0 4px 6px 0 var(--black-0-7);
        border-radius: 50%;
        overflow: hidden;
        }
}
.image-desc {
    padding: 22px 14px 14px 14px;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    p{
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        overflow: hidden;
    }
}
.memory{
    display: flex;
    >div{
        &:nth-child(1){
            margin-right: 15px;
        }
    }
}
.pagination{
    text-align: center;
    margin: 32px auto 0 auto;
}

</style>