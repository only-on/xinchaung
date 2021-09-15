<template>
   <div class="creatpost"  v-layout-bg>
      <a-form ref="formRef" :model="formState" :label-col="{span:4}" :wrapper-col="{span:16}" labelAlign="right" :rules="rules">
        <a-form-item label="旧密码"  name="psd">
          <a-input v-model:value="formState.psd" />
        </a-form-item>
        <a-form-item label="新密码"  name="newPsd">
          <a-input v-model:value="formState.newPsd" />
        </a-form-item>
        <a-form-item label="再次输入新密码"  name="confirmPsd">
          <a-input v-model:value="formState.confirmPsd" />
        </a-form-item>
      </a-form>
      <div class="foot">
        <a-button type="primary" @click.prevent="onSubmit">{{' 保 存 '}}</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
const http=(request as any).studentForum
interface form{
  psd:string,
  newPsd:string,
  confirmPsd:string
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
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const {editId}= route.query
    var updata=inject('updataNav') as Function
    // updata({showContent:true,navType:false,navPosition:'outside'})

    const state:Istate=reactive({
      formRef:'formRef',
      formState:{
        psd:'',
        newPsd:'',
        confirmPsd:''
      },
      rules:{
        psd: [{ required: true, message: '请输入旧密码', trigger: 'blur'},],
        newPsd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPsd: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
      },
      options:{
        placeholder: "输入内容...",
        theme: "snow",
      },
      getDetail:()=>{
        http.postsDetailed({param:{id:editId}}).then((res:IBusinessResp)=>{
            state.formState.psd=''
            state.formState.newPsd=''
            state.formState.confirmPsd=''
        })
      },
      onSubmit:()=>{
        state.formRef.validate().then(() => {
            console.log('验证过');
            http.saveInformation({param:{forum:{...state.formState}}}).then((res:IBusinessResp)=>{
              
            // message.success(editId?'修改成功':'发布成功')
            // router.go(-1)
              
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
