<template>
    <div class="trainEnvironment" v-layout-bg>
       <div class="top-info-btn">
           <div>
               <span class="star">*</span>
               <span>实训环境</span>
               <span class="orange">已选总内存：<span class="number">2</span>G</span>
           </div>
           <div>
               <a-button type="primary" v-if="!edit" @click="toEdit">编辑</a-button>
               <a-button type="primary" v-if="edit" @click="toSave">保存</a-button>
           </div>
       </div>
       <div class="envirList">
           <div class="envirItem" v-for="(item,index) in propTrainDetailInfo.server" :key="index.toString()">
               <div class='env-wrap-header'>{{item.name}}</div>
               <div class="env-cont-wrap">
                   <div>内存:{{item.ram}}</div>
                    <div>CPU:{{item.cpu}}</div>
                    <div class="cont-delete">
                        <span>硬盘:{{item.disk}}</span>
                        <span><span v-if="edit" class="iconfont icon-shanchu-copy"></span></span>
                    </div>
               </div>
           </div>
           <div class="uploadEnvir" v-if="edit" @click="selectEnvir">
               <div>
                   <span class="iconfont icon-tianjia"></span>
               </div>
               <div>选择环境</div>
           </div>
           <div>
               <selectEnvir @select-envir-ok='selectEnvirOk' @select-envir-cancel='selectEnvirCancel' :envirVisible='envirVisible' />
           </div>
       </div>
    </div>
</template>
<script lang="ts">
interface Istate{
   edit:boolean,
   envirVisible:boolean
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import selectEnvir from '../../components/selectEnvir/index.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'trainEnvironment',
    props:['propTrainDetailInfo','trainId'],
    components:{
        Empty,
        selectEnvir
    },
    setup(props,context){
    const http=(request as any).teacherExperimental
    const state:Istate=reactive({
      edit:false,
      envirVisible:false
    })
    const methods={
      toEdit(){
          state.edit=true
      },
      toSave(){
          state.edit=false
      },
      selectEnvir(){
          state.envirVisible=true
      },
      selectEnvirOk(){
          state.envirVisible=false
      },
      selectEnvirCancel(){
          state.envirVisible=false
      }
    }
    onMounted(()=>{
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.trainEnvironment{
    margin: 10px;
    .top-info-btn{
        display: flex;
        justify-content:space-between;
        .orange{
            color: #f6a600;
            margin-left: 20px;
            .number{
                font-size: 24px;
            }
        }
    }
    .envirList{
        margin-top: 20px;
        display: flex;
        .envirItem{
            width: 15%;
            height: 121px;
            margin-right: 13px;
            vertical-align: top;
            border-radius: 4px;
            overflow: hidden;
            .env-wrap-header {
            background: #8955B5;
            text-align: left;
            color: #fff;
            padding: 3px 10px;
            height: 25px;
            line-height: 20px;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
        }
        .env-cont-wrap {
            padding: 7px;
            border: 1px solid #D5D5D5;
            border-top: none;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            transition: all .3s;
            .cont-delete{
                display: flex;
                justify-content: space-between;
            }
        }
        }
        .uploadEnvir{
            width: 15%;
            height: 115px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            color: @theme-color;
            border: 1px dashed @theme-color;
        }
    }
}
</style>