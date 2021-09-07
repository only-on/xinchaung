<template>
   <div class="creatpost"  v-layout-bg>
      <h1>发帖</h1>
      <a-form ref="formRef" :model="formState" :label-col="{span:6}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
        <a-form-item label="帖子名称"  name="name">
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="帖子类型"  name="type">
          <a-select v-model:value="formState.type" placeholder="请选择发帖类型">
            <a-select-option value="1">求助</a-select-option>
            <a-select-option value="2">分享</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div class="text">
        <QuillEditor toolbar="full" :options="options" v-model:content="formState.content"  /> 
      </div>
      <div class="foot">
        <a-button type="primary" @click.prevent="onSubmit">{{editId?' 修 改 ':' 保 存 '}}</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import { QuillEditor, Delta } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const http=(request as any).forum
interface form{
  title:string,
  type:string,
  content:string
}
interface Istate{
  formRef:any,
  formState:form,
  rules:any,
  onSubmit: () => void;
  getDetail: () => void;
  options:any
}
export default defineComponent({
  name: 'CreatePosts',
  components: {
   QuillEditor
  },
  setup: (props,{emit}) => {
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
        title:'',
        type:'1',
        content:''
      },
      rules:{
        title: [
          { required: true, message: '请输入帖子名称', trigger: 'blur'},
          { min: 1, max: 16, message: '名称长度为1-16个字符', trigger: 'blur'},
        ],
        type: [{ required: true, message: '请选择帖子类型', trigger: 'change' }],
        content: [{ required: true, message: '请输入帖子内容', trigger: 'blur' }],
      },
      options:{
        placeholder: "输入内容...",
        theme: "snow",
      },
      getDetail:()=>{
        http.postsDetailed({param:{id:editId}}).then((res:any)=>{
            // let typePosts={'分享':'1','求助':'2'}
            state.formState.title=res.data.title
            state.formState.type=res.data.type==='分享'?'1':'2'
            state.formState.content=res.data.content
        })
      },
      onSubmit:()=>{
        state.formRef.validate().then(() => {
            console.log('验证过');
            let obj={
              ...state.formState,
              content:JSON.stringify(state.formState.content)
            }
            http.createForum({param:{forum:{...obj}}}).then((res:IBusinessResp)=>{
              if(res){
                message.success(editId?'修改成功':'发布成功')
                router.go(-1)
              }
            })
        })
      }
    })
    editId?state.getDetail():''
    onMounted(()=>{
     
    })
    return { ...toRefs(state),editId};
  },
})
</script>

<style scoped lang="less">
.creatpost{
  height: 100%;
  overflow: auto;
}
  .header{
    display: flex;
    justify-content: space-between;
    width: @center-width;
    margin: 0 auto;
  }
  
    
  h1{
    color: #333;
    font-size: 17px;
    height: 20px;
    line-height: 20px;
    margin: 20px 0 10px 0;
  }
  :deep(.ant-form-item-control){
    flex: 0 0 100%;
  }
  

    :deep(.ql-container){
      text-align: center;
      height: calc(100% - 43px);
    }
  .text{
    height: 340px;
  }
  .foot{
    margin: 50px 0;
    width: 100%;
    text-align: center;
  }
    
</style>
