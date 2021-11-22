<template>
   <div class="creatpost"  v-layout-bg>
      <a-form ref="formRef" :model="formState" :label-col="{span:4}" :wrapper-col="{span:16}" labelAlign="right" :rules="rules">
        <a-form-item label="旧密码"  name="oldpass">
          <a-input v-model:value="formState.oldpass" />
        </a-form-item>
        <a-form-item label="新密码"  name="newpass">
          <a-input v-model:value="formState.newpass" />
        </a-form-item>
        <a-form-item label="再次输入新密码"  name="repeatnewpass">
          <a-input v-model:value="formState.repeatnewpass" />
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
const http=(request as any).personalInformation
interface form{
  oldpass:string,
  newpass:string,
  repeatnewpass:string
}
interface Istate{
  formRef:any,
  formState:form,
  rules:any,
  onSubmit: () => void;
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
        oldpass:'',
        newpass:'',
        repeatnewpass:''
      },
      rules:{
        oldpass: [{ required: true, message: '请输入旧密码', trigger: 'blur'},],
        newpass: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        repeatnewpass: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
      },
      onSubmit:()=>{
        state.formRef.validate().then(() => {
           console.log('验证过');
          if(state.formState.newpass!==state.formState.repeatnewpass){
            message.warn('输入新密码不一致')
            return
          }
          // console.log(state.formState);
          http.resetPassword({param:{reset_password_params:{...state.formState}}}).then((res:IBusinessResp)=>{
          message.success('修改成功')
          state.formRef.resetFields()
          // router.go(-1)
            
          })
        })
      }
    })
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
