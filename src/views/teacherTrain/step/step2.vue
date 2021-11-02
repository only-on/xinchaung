<template>
   <div class="createProgress2"  v-layout-bg>
       <div>
        <div>
            <a-button type="primary" @click="selectMirror">
                <span class="icon-tianjia iconfont"></span>选择镜像
            </a-button>
        </div>
        <div class="listTable">
            <div class="listItem" v-for="(item,index) in mirrorTable" :key='index.toString()'>
                <span class='itemname'>{{item.name}}</span>
                <div class="itemselect">
                    <a-form-item label="cpu">
                        <a-select v-model:value="item.cpu"  class="selectWidth">
                            <a-select-option v-for="(item,index) in selectOption?.cpu" :key="index.toString()" :value="item.key">
                                {{item}}核
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="内存">
                        <a-select v-model:value="item.ram" class="selectWidth">
                            <a-select-option v-for="(item,index) in selectOption?.ram" :key="index.toString()" :value="item.key">
                                {{item}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="硬盘">
                        <a-select v-model:value="item.disk"  class="selectWidth">
                            <a-select-option v-for="(item,index) in selectOption?.disk" :key="index.toString()" :value="item.key">
                                {{item}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item v-if="item.tags.indexOf(3)!==-1" label="GPU">
                        <a-select default-value="是" class="selectWidth">
                            <a-select-option :value="true">
                                是
                            </a-select-option>
                            <a-select-option :value="false">
                                否
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div class="itemdelete">
                    <span @click="deleteItem(item)" class="icon-shanchu-copy iconfont"></span>
                </div>
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
      <div class="foot">
        <a-button  @click.prevent="onCancel"> 取 消 </a-button>
        <a-button class="next" type="primary" @click.prevent="previousStep"> 上一步 </a-button>
        <a-button class='save' type="primary" @click.prevent="nextStep">下一步</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
import uploadImage from '../components/uploadImage/uploadImage.vue'
import selectMirror from '../components/selectMirror/index.vue'
import messages from 'src/i18n/zh_CN'
const http=(request as any).teacherTrain
interface paramsType{
    container:any[],
    image:number,
    flavor:any[],
    is_use_gup:number
}
interface mirrorTableType{
    name:string,
    cpu:string,
    ram:string,
    disk:string,
    tags:number[]
}
interface Istate{
    params:paramsType,
    visible:boolean,
    mirrorTable:mirrorTableType[],
    mirroridArr:number[],
    selectOption:any,
}
export default defineComponent({
  name: 'CreatePosts',
   props:['trainId'],
  components: {
    uploadImage,
    selectMirror
  },
  setup: (props,context) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})
    const http=(request as any).teacherTrain
     const state:Istate=reactive({
         params:{
            container:[],
            image:0,
            flavor:[],
            is_use_gup:0
         },
         visible:false,
         mirrorTable:[],
         mirroridArr:[],
         selectOption:{}
     })
     const methods={
         previousStep(){
             context.emit('step-status',0)
         },
         selectMirror(){
             state.visible = true;
         },
        afterVisibleChange(val:any) {
        console.log('visible', val);
        },
        onClose() {
            state.visible = false;
        },
        choiceItem(item:any){
            console.log(item)
            state.mirrorTable.push(item),
            state.mirroridArr.push(item.id)
        },
        deleteItem(item:any){
            console.log(item)
            const index=state.mirroridArr.indexOf(item.id)
            state.mirrorTable.splice(index,1)
            state.mirroridArr.splice(index,1)
        },
        configlist(){
            http.selectConfig().then((res:any)=>{
                console.log(res)
                state.selectOption=res.data.image_configs
            })
        },
        // 第一步
        createTemplate(){
            console.log(state.mirrorTable,'数据888888')
            let container:any=[]
            state.mirrorTable.forEach((item:any,index:any)=>{
                container.push(
                    {image:item.id,
                    flavor: {
                    cpu:item.cpu,
                    ram:item.ram,
                    disk:item.disk
                    },
                    is_use_gpu:item.is_use_gpu
                })
            })
            console.log(container,'container')
            http.createMirrorTemplate({param:{container}}).then((res:any)=>{
                let topo_id=res.data.id
                http.saveMirrorEnvir({param:{train_id:props.trainId,topo_id:topo_id}}).then((res:any)=>{
                    console.log(res)
                    topo_id=''
                    context.emit('step-status',2)
                    inject['stepInfoTwo']=state.mirrorTable
                })
             })
            
         },
        onCancel(){

        },
        nextStep(){
        methods.createTemplate()
        context.emit('step-status',2)
        }
     }
    onMounted(()=>{
        console.log(inject['stepInfoTwo'],'第二步的数据')
        if(inject['stepInfoTwo']){
            state.mirrorTable=inject['stepInfoTwo']
        }
        methods.configlist()
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
.createProgress2{
    margin: 0px 30px;
    .foot{
    margin-top:30px;
    text-align: center;
    .next,.save{
      margin-left: 10px;
    }
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
