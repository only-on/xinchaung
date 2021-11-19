<template>
    <div class="resources">
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
                    <a-table :columns="columns" :data-source="data" rowKey="id">
                         <template #action='{record}'>
                            <div class='action'>
                                <span class="spanleft" @click='deleteUploadFile(record.id)'>删除</span>
                                <span @click="downLoad(record.url)">下载</span>
                                <!-- <a :href="record.url">下载</a> -->
                            </div>
                        </template>
                    </a-table>
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
   size:string,
   introduce:string
} 
import { defineComponent,onMounted,watch,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
import  FileSaver  from 'file-saver'
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId','resource','type'], // type 判断是否是课程资源
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
                dataIndex: 'describe',
                ellipsis: true,
            },
            {
                title: '文件类型',
                dataIndex: 'posfix',
                ellipsis: true,
            },
            {
                title: '文件大小',
                dataIndex: 'size',
            },
            {
                title: '上传时间',
                dataIndex: 'created_at',
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
        size:'',
        introduce:''
    })
    const methods={
       beforeUpload(file:any){
           console.log(file)
           state.name=file.name
           state.file=file
           state.size=file.size
        return false
       },
       getResourceList(){
          const params={
              type:2,
              id:props.trainId,
          }
           http.resourceList({param:params}).then((res:any)=>{
               console.log(res)
               state.data=res.data.list
            //    context.emit('stepFourInfo',state.data)
            inject['stepInfoFour']=state.data
           })
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
           const params={
                relate_id:props.trainId,
                name:state.name,
                url:"/resource/"+state.name,
                size:state.size.toString(),
                posfix:type,
                describe:state.introduce,
                type:2
           }
           http.uploadResource({param:params}).then((res:any)=>{
               console.log(res)
                methods.getResourceList()
           })
           .catch(() => {
             message.error('网络错误')
            })
       },
       deleteUploadFile(id:any){
           http.deleteResource({urlParams:{resource:id}}).then((res:any)=>{
               console.log(res)
               message.warning('删除成功')
               methods.getResourceList()
           })
       },
       downLoad(url:any){
            let development=process.env.NODE_ENV == 'development' ? true : false;
            let baseurl=development?'http://localhost:3000/proxyPrefix':""
            FileSaver.saveAs(baseurl+url);
       }
    }
    //  watch(()=>props.resource,(val:any)=>{
    //      console.log(val,'sssdccccddccddcdcdc')
    //      if(val!=={}){
    //          state.data=val;
    //      }
    // },{
    //     deep:true,
    //     immediate:true
    // })
    onMounted(()=>{
        methods.getResourceList()
        console.log(inject['stepInfoFour'])
            if(inject['stepInfoFour']){
            state.data=inject['stepInfoFour']
        }
        
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
     .action{
            color: @theme-color;
            .spanleft{
                margin-right: 5px;
            }
        }
}
</style>