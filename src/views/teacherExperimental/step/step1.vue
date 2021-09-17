<template>
   <div class="creat"  v-layout-bg>
      <div class="main">
        <div class="left">
          <a-form ref="formRef" :model="formState" :label-col="{span:6}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
            <a-form-item label="实训名称"  name="name">
              <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item label="课时"  name="train_time">
              <a-input v-model:value="formState.train_time" />
            </a-form-item>
            <a-form-item label="开始时间-结束时间" required name="start_time" class="selectDate">
              <!-- <a-range-picker v-model:value="formState.start_time" /> -->
              <a-date-picker placeholder="开始日期" v-model:value="formState.start_time" :format="dateFormat" />
              <a-date-picker placeholder="结束日期" v-model:value="formState.start_time" :format="dateFormat" />
            </a-form-item>
            <a-form-item label="实训课件"  name="courseware">
              <a-upload
                  v-model:file-list="formState.courseware"
                  name="file"
                  :before-upload="BeforeUpload"
                  accept=".ppt,.pptx,.pdf"
                >
                <a-button class="courseware">
                  <upload-outlined></upload-outlined>
                  选择文件
                </a-button>
              </a-upload>
            </a-form-item>
          </a-form>
        </div>
        <div class="right"></div>
      </div>
      <div class="foot">
        <a-button type="primary" @click.prevent="onSubmit">{{' 取 消 '}}</a-button>
        <a-button type="primary" @click.prevent="onSubmit">{{' 下一步 '}}</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject} from 'vue'
import { SmileOutlined, MehOutlined ,ClockCircleOutlined} from '@ant-design/icons-vue';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const http=(request as any).studentForum
interface form{
  name:string;
  train_time:string;
  start_time:string;
  end_time:string;
  url:string;
  guide:string;
  courseware:string;
  train_id:number | ''
}
interface Istate{
  formRef:any,
  formState:form,
  rules:any,
  onSubmit: () => void;
  BeforeUpload: () => void;
  options:any
}
export default defineComponent({
  name: 'CreatePosts',
  components: {
   ClockCircleOutlined
  },
  setup: (props,{emit}) => {
    const dateFormat = 'YYYY/MM/DD';
    const router = useRouter();
    const route = useRoute();
    const {editId}= route.query
    const options = {
      placeholder: "输入内容...",
      theme: "snow",
    };
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})

    const state:Istate=reactive({
      formRef:'formRef',
      formState:{
        name:'',
        train_time:'2',
        start_time:'',
        end_time:'',
        url:'',
        guide:'',
        courseware:'',
        train_id:''
      },
      rules:{
        name: [{ required: true, message: '请输入实训名称', trigger: 'blur'},],
        train_time: [{ required: true, message: '请输入课时', trigger: 'blur' },{ min: 1, max: 16, message: '课时1-16', trigger: 'blur'},],
        content: [{ required: true, message: '请输入帖子内容', trigger: 'blur' }],
      },
      options:{
        placeholder: "输入内容...",
        theme: "snow",
      },
      BeforeUpload:()=>{
        http.postsDetailed({param:{id:editId}}).then((res:IBusinessResp)=>{
            
        })
      },
      onSubmit:()=>{
        state.formRef.validate().then(() => {
            console.log('验证过');
            let obj={
              ...state.formState,
              // content:JSON.stringify(state.formState.content)
            }
            http.createForum({param:{forum:{...obj}}}).then((res:IBusinessResp)=>{
              message.success(editId?'修改成功':'发布成功')
                router.go(-1)
            })
        })
      }
    })
    onMounted(()=>{
     
    })
    return { ...toRefs(state),dateFormat};
  },
})
</script>

<style scoped lang="less">
.creat{
  .main{
    display: flex;
    justify-content: space-between;
    .left,.right{
      width: 48%;
    }
  }
}
.selectDate{
  :deep(ant-form-item-control-input-content){
    display: flex;
    justify-content: space-between;
  }
}
.courseware{
  color: #fff;
    background: #8955b5;
}
:deep(.ant-form-item-control){
    flex: 0 0 100%;
  }
  .foot{
    margin: 50px 0;
    width: 100%;
    text-align: center;
    .ant-btn{
      margin: 0 30px;
    }
  }
    
</style>
