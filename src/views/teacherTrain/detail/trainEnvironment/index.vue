<template>
    <div class="trainEnvironment">
        <div class="top-info-btn">
           <div>
               <span class="star">*</span>
               <span>实训环境</span>
               <span class="orange">已选总内存：<span class="number">{{memoryNumber()}}</span>G</span>
           </div>
           <div v-if="trainType!=='1'">
               <a-button type="primary" v-if="!edit" @click="toEdit">编辑</a-button>
               <a-button type="primary" v-if="edit" @click="toSave">保存</a-button>
           </div>
        </div>
        <div class="selectMirror" v-if="edit">
            <a-button type="primary" @click="selectMirror">
                <span class="icon-tianjia iconfont"></span>选择镜像
            </a-button>
        </div>
        <div class="listTable">
            <div class="listItem" v-for="(item,index) in propTrainDetailInfo.container" :key='index.toString()'>
                <span class='itemname'>{{item.image_name}}</span>
                <div class="itemselect">
                    <a-form-item label="cpu">
                        <a-select :disabled='!edit' default-value="1" v-model:value="item.cpu"  class="selectWidth">
                            <a-select-option v-for="(item,index) in selectOption?.cpu" :key="index.toString()" :value="item.key">
                                {{item}}核
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="内存">
                        <a-select :disabled='!edit' default-value="2048" v-model:value="item.ram" class="selectWidth">
                            <a-select-option v-for="(item,index) in selectOption?.ram" :key="index.toString()" :value="item.key">
                                {{item}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="硬盘">
                        <a-select :disabled='!edit' default-value="30" v-model:value="item.disk"  class="selectWidth">
                            <a-select-option v-for="(item,index) in selectOption?.disk" :key="index.toString()" :value="item.key">
                                {{item}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item v-if="item.tags?.indexOf(3)!==-1" label="GPU">
                        <a-select :disabled='!edit' default-value="是" class="selectWidth">
                            <a-select-option :value="true">
                                是
                            </a-select-option>
                            <a-select-option :value="false">
                                否
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div v-if="edit" class="itemdelete">
                    <span @click="deleteItem(item)" class="icon-shanchu-copy iconfont"></span>
                </div>
            </div>
        </div>
        <a-drawer
        placement="right"
        :closable="false"
        :visible="visible"
        width="640"
        :after-visible-change="afterVisibleChange"
        @close="onClose"
        >
        <select-mirror @choice-item='choiceItem' @delete-item='deleteItem' :mirroridArr='mirroridArr'></select-mirror>
        </a-drawer>
    </div>
</template>
<script lang="ts">
interface IselectType{
 disk?:any[],
 ram?:any[],
 cpu?:any[]
}
interface Istate{
   edit:boolean,
   visible:boolean,
   mirroridArr:number[],
   selectOption:IselectType
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import selectMirror from '../../components/selectMirror/index.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'trainEnvironment',
    props:['propTrainDetailInfo','trainId','trainType'],
    components:{
        Empty,
        selectMirror
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
      edit:false,
      visible:false,
      mirroridArr:[],
      selectOption:{}
    })
    const methods={
      toEdit(){
          state.edit=true
      },
      toSave(){
          if(props.propTrainDetailInfo.container.length<1){
              message.warning('请至少选择一项记录！')
              return
          }
          state.edit=false
        //   
         console.log(props.propTrainDetailInfo.container,'数据888888')
            let container:any=[]
            props.propTrainDetailInfo.container.forEach((item:any,index:any)=>{
                container.push(
                    {image:item.id,
                    flavor: {
                    cpu:item.cpu?item.cpu:1,
                    ram:item.ram?item.ram:2048,
                    disk:item.disk?item.disk:30,
                    },
                    is_use_gpu:item.is_use_gpu
                })
            })
            console.log(container,'container')
            console.log(props.trainId)
            http.createMirrorTemplate({urlParams:{train:props.trainId},param:{container}}).then((res:any)=>{
                console.log(res)
                context.emit('step-status',2)
            })
      },
      afterVisibleChange(val:any) {
        console.log('visible', val);
      },
      onClose(){
          state.visible=false
      },
      choiceItem(item:any){
            console.log(item)
            props.propTrainDetailInfo.container.push(item),
            state.mirroridArr.push(item.id)
        },
        deleteItem(item:any){
            console.log(item)
            const index=state.mirroridArr.indexOf(item.id)
            props.propTrainDetailInfo.container.splice(index,1)
            state.mirroridArr.splice(index,1)
      },
      selectMirror(){
          state.visible=true
      },
      deleteSelectedEnvir(value:any){
           context.emit('selectedEnvirDelete',value)
      },
      configlist(){
            http.selectConfig().then((res:any)=>{
                console.log(res)
                state.selectOption=res.data.image_configs
            })
     },
      memoryNumber(){
          let ramnumber:number=0
          props.propTrainDetailInfo.container.forEach((item:any) => {
              console.log(item.ram)
            //   ramnumber=ramnumber+Number(item.ram.split('G')[0])
              ramnumber=ramnumber+Number(item.ram/1024)
          });
          return ramnumber
      }
    }
     watch(()=>props.propTrainDetailInfo.container,(val:any)=>{
        val.forEach((item:any)=>{
            state.mirroridArr.push(item?.image_id)
        })
        },{
        deep:true,
        immediate:true
    })
    onMounted(()=>{
        methods.configlist()
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
    // .envirList{
    //     margin-top: 20px;
    //     display: flex;
    //     .envirItem{
    //         width: 15%;
    //         height: 121px;
    //         margin-right: 13px;
    //         vertical-align: top;
    //         border-radius: 4px;
    //         overflow: hidden;
    //         .env-wrap-header {
    //         background: #8955B5;
    //         text-align: left;
    //         color: #fff;
    //         padding: 3px 10px;
    //         height: 25px;
    //         line-height: 20px;
    //         font-size: 13px;
    //         overflow: hidden;
    //         text-overflow: ellipsis;
    //         white-space: normal;
    //     }
    //     .env-cont-wrap {
    //         padding: 7px;
    //         border: 1px solid #D5D5D5;
    //         border-top: none;
    //         border-bottom-left-radius: 5px;
    //         border-bottom-right-radius: 5px;
    //         transition: all .3s;
    //         .cont-delete{
    //             display: flex;
    //             justify-content: space-between;
    //         }
    //     }
    //     }
    //     .uploadEnvir{
    //         width: 15%;
    //         height: 115px;
    //         border-radius: 4px;
    //         display: flex;
    //         flex-direction: column;
    //         justify-content: center;
    //         align-items: center;
    //         overflow: hidden;
    //         color: @theme-color;
    //         border: 1px dashed @theme-color;
    //     }
    // }
    .selectMirror{
        margin-top: 20px;
    }
    .listTable{
      width: 100%;
      margin-top: 30px;
      min-height: 400px;
      .listItem{
          display:flex;
          height: 64px;
          border: 1px solid #D9D9D9;
          background-color: #F5F5F5;
          justify-content:left;
          align-items: center;
          padding: 0 14px;
          margin-bottom: 20px;
          .itemname{
              width:20%;
          }
          .itemselect{
              display: flex;
              width: 70%;
              .ant-form-item{
                  margin-bottom: 0px;
              }
              .selectWidth{
                  width: 120px;
              }
          }
          .itemdelete{
              width: 10%;
              text-align: right;
          }
      }
  }
}
</style>