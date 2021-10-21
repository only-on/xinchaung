<template>
    <div class="trainCourseware" v-layout-bg>
        <div class="top-btn">
            <span>
                <a-upload
                    class="upload"
                    v-if="!edit"
                    name="file"
                    :multiple="true"
                    :beforeUpload='beforeUpload'
                >
                    <a-button type="primary">选择文件</a-button>
                </a-upload>
            </span>
            <span>
                <a-button type="primary" v-if="edit" @click="toModify">修改</a-button>
                <a-button type="primary" v-if="!edit" @click="ToSavepptModify">保存</a-button>
            </span>
        </div>
        <div class="pdtView" v-if="ppt_url">
            <iframe width="100%" height="460px" :src="ppt_url" frameborder="0"></iframe>
        </div>
        <div v-else>
            <empty text='亲~这里什么都没有~'></empty>
        </div>
    </div>
</template>
<script lang="ts">
interface Istate{
    edit:boolean,
    ppt_url:string,
    file:string
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'trainCourseware',
    props:['propTrainDetailInfo','trainId'],
    components:{
        Empty
    },
    setup(props,context){
    const http=(request as any).teacherExperimental
    const state:Istate=reactive({
        edit:true,
        ppt_url:'',
        file:''
    })
    let development=process.env.NODE_ENV == 'development' ? true : false;
    let baseurl=development?'http://localhost:3000/proxyPrefix':""
    const methods={
       toModify(){
           state.edit=false
       },  
       beforeUpload(file:any){
           console.log(file)
            state.file=file
            const fd = new FormData()
            fd.append('upload_type','train_ppt')
            fd.append('train_id',props.trainId)
            fd.append('file',file)
            http.trainUploadImage({param:fd}).then((res: any) => {
            state.file=res.datas.url
        })
        .catch((err:any) => {
          message.error(err.error)
        })
        return false
       },
       ToSavepptModify(){
           const formdata=new FormData()
           formdata.append('train_id',props.trainId)
           formdata.append('courseware',state.file)
           http.savepptModefiy({param:formdata}).then((res:any)=>{
               console.log(res)
              state.ppt_url=baseurl+res.datas.courseware_html
            //   context.emit('uploadppt')
           })
       }
    }
    onMounted(()=>{
        state.ppt_url=baseurl+props.propTrainDetailInfo.html_url
    })
    return {...toRefs(state),...methods,baseurl}
    }
})
</script>
<style lang="less">
.trainCourseware{
    .top-btn{
        display: flex;
        justify-content: space-between;
        .upload{
            display: flex;
        }
    }
    .pdtView{
        margin-top: 30px;
    }
    .ant-upload-list-item-info{
        width: 450px;
    }
}
</style>