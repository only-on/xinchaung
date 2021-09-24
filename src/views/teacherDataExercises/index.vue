<template>
    <div id='teacherDataExercises' v-layout-bg>
        <div class="conTop">
             <div class="searchInput">
                <a-input-search style="width:503px;padding:8px 5px 8px 30px" placeholder="请输入目录名称关键字查询" />
            </div>
            <div v-if="type">
                <a-button type="primary" @click="createExcerise">创建目录</a-button>
            </div>
             <a-modal class="createExercise" :visible="visible" title="创建目录" width="900px" @cancel="handleCancel" @ok="handleOk">
                <div class="modal-con">
                        <a-form-item
                            label="名称"
                            >
                            <a-input
                                
                                placeholder="请输入名称"
                                style="width:690px"
                            />
                            <!-- v-decorator="[
                                'username',
                                { rules: [{ required: true, message: '请输入内容',max:30 }] },
                                ]" -->
                        </a-form-item>
                        <a-form-item label="描述">
                            <a-textarea
                            :auto-size="{ minRows:4, maxRows:7 }"
                                placeholder="请输入描述内容">
                            </a-textarea>
                        </a-form-item>
                </div>
            </a-modal>
        </div>
        <component :is="componentName" :componentData='componentData' />
    </div>
</template>
<script lang="ts">
import {defineComponent,inject,watch,reactive,toRefs, onMounted, ToRefs,Ref,ref,provide} from 'vue'
import privateExercises from './privateExercises/index.vue'
import shareExercises from './shareExercises/index.vue'
import request from "../../api";
interface Iitem{
  name:string,
  componenttype:any,
}
interface state{
    tabs:Array<Iitem>,
    componentName:string,
    componentNames:Array<string>,
    componentData:any,
}
interface createExerciseParam{
    name:string,
    description:string,
    initial:boolean,
}
export default defineComponent({
    name:'teacherDataExercises',
    components: {
        privateExercises,
        shareExercises
    },
     setup:(props,context)=>{
        const teacherDataExerApi = (request as any).teacherDataExercises
        const state:state=reactive({
            componentName:'',
            componentNames:['shareExercises','privateExercises'],
            tabs:[{name:'共有',componenttype:0},{name:'私有',componenttype:1}],
            componentData:[]
       })
        var type:Ref<any>=ref(0)
        var visible:Ref<any>=ref(false)
        var form:Ref<any>=ref()
        var componentData=ref([])
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:state.tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true})
    watch(()=>{return configuration.componenttype},(val)=>{
      state.componentName=state.componentNames[val]
      type.value=val
      getExerciseList()
    })
    function getExerciseList(){
          teacherDataExerApi.getExerciseList({param:{initial:!type.value}}).then((res:any)=>{
              componentData.value=res?.data.list
              console.log(componentData,'componentData')
              provide('componentData',componentData)
          })
        console.log(teacherDataExerApi)
    }
    function createExcerise(params:createExerciseParam){
        visible.value=true
        console.log(visible)
        // teacherDataExerApi.createExercise({param:params}).then((res:any)=>{
        //     console.log(res)
        // })
    }
    function handleOk(){
         visible.value=false
        form.value.validateFields((err:any, values:any) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    } 
    function handleCancel(){
         visible.value=false
    }
    onMounted(()=>{
        getExerciseList()
    })
      return {...toRefs(state),type,componentData,visible,form,getExerciseList,createExcerise,handleOk,handleCancel}
    }
})
</script>
<style lang="less">
.conTop{
    display: flex;
    justify-content:space-between;
    margin-bottom: 20px;
}
.createExercise .ant-modal-footer{
    text-align: center;
}
.modal-con a-form-item{
    display: flex;
    justify-content: center;
}
</style>