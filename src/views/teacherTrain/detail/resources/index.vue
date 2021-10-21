<template>
    <div class="resources" v-layout-bg>
       <div class="resource-top">
           <span class="choiceFile">
               选择文件:
                <a-upload
                name="file"
                :beforeUpload='beforeUpload'
                >
                   <a-input style="width:140px" v-model:value="name"></a-input><a-button type="primary">浏览</a-button>
                </a-upload>
            </span>
           <span>资源说明：<a-input style="width:140px" v-model:value="introduce"></a-input><a-button type="primary" @click="uploadFile">上传文件</a-button><span class="fileLimit">文件限制：512M，文件格式：gif,jpg,png,mp4,xlsx,xls,docx,doc,rar,pdf,ppt,pptx</span></span>
       </div>
       <div>
           <a-config-provider>
                    <a-table :columns="columns" :data-source="data"></a-table>
                    <template #renderEmpty>
                        <div><empty type="tableEmpty"></empty></div>
                    </template>
                </a-config-provider>
       </div>
    </div>
</template>
<script lang="ts">
interface Istate{
   columns:any[],
   data:any[],
   file:any,
   name:string,
   introduce:string,
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId'],
    components:{
        Empty
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
        columns: [{
                title: '资源名称',
                dataIndex: 'name',
                ellipsis: true,
            },
            {
                title: '资源说明',
                dataIndex: 'username',
                ellipsis: true,
            },
            {
                title: '文件类型',
                dataIndex: 'department',
                ellipsis: true,
            },
            {
                title: '文件大小',
                dataIndex: 'gender',
            },
            {
                title: '上传时间',
                dataIndex: 'email',
                align: 'center',
            },
            {   title: '操作', 
                dataIndex: 'action', 
                align: 'center', 
                slots: { customRender: 'action' } 
            },],
        data:[],
        file:'',
        name:'',
        introduce:''
    })
    const methods={
       beforeUpload(file:any){
           console.log(file)
           state.name=file.name
           state.file=file
        return false
       },
       uploadFile(){
           if(!state.file){
               message.warning('请上传文件！')
               return
           }
           const type=state.file.name.split(".")[state.file.name.split(".").length-1]
           if(type!=='gif'&&type!=='jpg'&&type!=='png'&&type!=='mp4'&&type!=='xlsx'&&type!=='xls'&&type!=='docx'&&type!=='doc'&&type!=='rar'&&type!=='pdf'&&type!=='ppt'&&type!=='pptx'){
               message.warning("文件格式不正确！")
               return
           }
           if(!state.introduce){
               message.warning('资源说明不能为空！')
               return
           }
           const fd=new FormData()
          fd.append('resource',state.file)
          fd.append('train_id',props.trainId)
          fd.append('introduce',state.introduce)
           http.uploadResource({param:fd}).then((res: any) => {
             console.log(res)
             message.warning('文件上传成功')
             state.file=''
             state.name=''
             state.introduce=''
        })
        .catch(() => {
          message.error('网络错误')
        })
       }
    }
    onMounted(()=>{
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.resources{
    margin: 10px;
    .ant-upload-list{
            display: none;
    }
    .resource-top{
        display: flex;
        .choiceFile{
            margin-right:20px;
        }
        .ant-btn{
                margin-left: 10px;
            }
        .fileLimit{
            color:#777;
            font-size: 14px;
            margin-left: 10px;
        }
    }
}
</style>