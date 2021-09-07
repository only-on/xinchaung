<template>
    <div class="listItem">
        <div class="content-title">{{title}}</div>
            <div class="content-list" v-for="(item,index) in infoList" :key="index">
                <div :style="{'background':color1,}" :class="4>3?'content-item min-content-item':'content-item max-content-item'">
                <span :style="{'border':circlecolor}">
                    <span :style="{'background':circlecolor}">{{index+1}}</span>
                </span>
                <span v-if="listname=='knowledge_map_name'">{{item.knowledge_map_name}}</span>
                <span v-else>{{item.name}}</span>
            </div>
         </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, PropType,Ref,toRefs,watch} from 'vue'
interface dataProps{
  name:string,
  knowledge_map_name:string,
}
export default defineComponent({
    name:'listItem',
    props:{
        infoList:{
            type:Array as PropType<dataProps[]>,
            required:false,
        },
        title:{
            type:String,
            required:true
        },
        listname:{
            type:String,
            required:false
        },
        circlecolor:{
            type:String,
            required:false,
        },
        color1:{
            type:String,
            required:false
        }
    },
    setup:(props,{emit})=>{
        // const aa:Ref<PropType<dataProps[]>|undefined>=props.infoList
        watch(()=>props.infoList,()=>{
            console.log(props.infoList,'props')
        })
    }
})
</script>
<style lang="less">
     .content-title{
        font-size: @font-size-base;
        color: #050101;
        letter-spacing: 1px;
        font-weight: 700;
        flex-shrink: 0;
        line-height: 45px;
    }
     .min-content-item{
        height: 32px;
    }
    .max-content-item{
        height: 44px;
    }
    .content-item{
        border-radius: 14px;
        padding-left: 13px;                                             
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        font-size: 12px;
        // background: linear-gradient(90deg,rgba(18,144,239,0.12) 24%, rgba(98,126,234,0.00) 78%);
        >span:nth-child(1) {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: inline-block;
        line-height: 22px;
        text-align: center;
        padding: 2px;
        margin-right: 14px;
        background: #e2f1fd;
        // border: 1px solid #1290ef;
            >span {
                display: inline-block;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                // background: #1290ef;
                color:@white;
            }
        }
    }
</style>