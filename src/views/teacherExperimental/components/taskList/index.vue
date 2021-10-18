<template>
    <div class="taskList">
        <div class="listItem" v-for="(item,index) in contentList" :key='index.toString()'>
            <span class="name">
                <span class="number">{{Number(index)+1}}</span>
                <span>{{item.name}}</span>
            </span>
            <span class="status">状态：{{item.step.state===1?'显示':'隐藏'}}</span>
            <span class="points-box">知识点：{{item.step.knowledges.join()}}</span>
            <span class="more-icon" :title='item.step.knowledges.join()'>
                <div></div>
                <div></div>
                <div></div>
            </span>
            <span>
                <span v-if="!edit" class="iconfont icon-shanchu-copy"></span>
            </span>
        </div>
    </div>
</template>
<script lang="ts">
interface Istate{
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
export default defineComponent({
    name:'taskList',
    props:['contentList','edit'],
    setup(props,context){
    const state:Istate=reactive({

    })
    const methods={
    }
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
    .taskList{
        width: 100%;
        margin: 0 auto;
        .listItem{
            width: 100%;
            padding: 20px;
            box-shadow: 0 0 5px #ccc;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all .3s;
            display: flex;
            justify-content:space-between;
            align-items: center;
            .number{
                display: inline-block;
                text-align: center;
                color: #fff;
                border-radius: 50%;
                width: 30px;
                line-height: 30px;
                height: 30px;
                margin-right: 5px;
                background: #8955B5;
            }
            .iconfont{
                color:@theme-color;
                size: 24px;
            }
            .more-icon{
                border-radius: 20px;
                width: 40px;
                height: 15px;
                line-height:15px;
                background: #f2e5ff;
                text-align: center;
                div{
                    border-radius: 50px;
                    background: #8955B5;
                    width: 5px;
                    height: 5px;
                    display: inline-block;
                    margin: 2px 4px;
                    cursor: pointer;
                }
            }
        }
    }
</style>