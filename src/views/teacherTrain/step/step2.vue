<template>
   <div class="selectEnvir"  v-layout-bg>
       <div>
        <div>
            <a-button type="primary" @click="selectMirror">
                <span class="icon-tianjia iconfont"></span>选择镜像
            </a-button>
        </div>
        <div class="listTable">
            <div class="listItem">
                <span>u16_k_2g2g50b_vnc</span>
                <div class="itemselect">
                    <a-form-item label="cpu">
                        <a-select default-value="lucy" style="width: 120px" @change="handleChange">
                            <a-select-option value="jack">
                                Jack
                            </a-select-option>
                            <a-select-option value="lucy">
                                Lucy
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="内存">
                        <a-select default-value="lucy" style="width: 120px" @change="handleChange">
                            <a-select-option value="jack">
                                Jack
                            </a-select-option>
                            <a-select-option value="lucy">
                                Lucy
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="硬盘">
                        <a-select default-value="lucy" style="width: 120px" @change="handleChange">
                            <a-select-option value="jack">
                                Jack
                            </a-select-option>
                            <a-select-option value="lucy">
                                Lucy
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="GPU">
                        <a-select default-value="lucy" style="width: 120px" @change="handleChange">
                            <a-select-option value="jack">
                                Jack
                            </a-select-option>
                            <a-select-option value="lucy">
                                Lucy
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    </div>
                <!-- </a-form> -->
                <span class="icon-shanchu-copy iconfont"></span>
            </div>
        </div>
       </div>
       <a-drawer
        title="设置环境"
        placement="right"
        :closable="false"
        :visible="visible"
        width="800"
        :after-visible-change="afterVisibleChange"
        @close="onClose"
        >
        <select-mirror></select-mirror>
        </a-drawer>
      <div class="foot">
        <a-button  @click.prevent="onCancel"> 取 消 </a-button>
        <a-button class="next" type="primary" @click.prevent="previousStep"> 上一步 </a-button>
        <a-button class='save' type="primary" @click.prevent="onSave">下一步</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
import uploadImage from '../components/uploadImage/uploadImage.vue'
import selectMirror from '../components/selectMirror/index.vue'
const http=(request as any).teacherTrain
interface paramsType{
    container:any[],
    image:number,
    flavor:any[],
    is_use_gup:number
}
interface Istate{
    params:paramsType,
    visible:boolean
}
export default defineComponent({
  name: 'CreatePosts',
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
     })
     const methods={
         previousStep(){
             context.emit('step-status',0)
         },
         choiceEnvir(){
             http.selectEnvir({param:state.params}).then((res:any)=>{

             })
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
     }
    onMounted(()=>{
        
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
.selectEnvir{
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
      .listItem{
          display:flex;
          height: 64px;
        //   line-height:64px;
          border: 1px solid #D9D9D9;
          background-color: #F5F5F5;
          justify-content:space-between;
          align-items: center;
          padding: 0 14px;
          .itemselect{
              display: flex;
              .ant-form-item{
                  margin-bottom: 0px;
              }
          }
      }
  }
}
</style>
