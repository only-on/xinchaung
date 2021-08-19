<template>
    <div class="header">
      <p></p>
      <Breadcrumb :type="false" />
    </div>
    <div class="content" v-layout-bg>
      <div class="content_box">
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
          <a-form-item label="发帖内容" name="content">
            <a-textarea v-model:value="formState.content" placeholder="请输入发帖内容" :rows="6" showCount :maxlength="100" />
          </a-form-item>
          <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" >
            <a-button type="primary" @click.prevent="onSubmit"> 保 存 </a-button>
            <!-- <a-button style="margin-left: 10px" @click="resetFields">Reset</a-button> -->
          </a-form-item>
        </a-form> 
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs } from 'vue'
import request from '../../api/index'
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
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
}
export default defineComponent({
  name: 'CreatePosts',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
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
      onSubmit:()=>{
        state.formRef.validate().then(() => {
          console.log('验证过');
            // createForum
            console.log(http);
            http.createForum({param:{forum:{...state.formState}}}).then((res:any)=>{
              if(res){
                message.success('发布成功')
                router.go(-1)
              }
            })
            // .catch((err:any) => {
            //     console.error('error', err);
            //   });
        })
      }
    })
    onMounted(()=>{
     
    })
    return { ...toRefs(state)};
  },
})
</script>

<style scoped lang="less">
  .header{
    display: flex;
    justify-content: space-between;
    width: @center-width;
    margin: 0 auto;
  }
  .content{
    width: @center-width;
    margin: 20px auto 0;
    background: #fff;
    min-height: 100%;
    .content_box{
      width: 100%;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0px 0 3px 3px rgb(0 0 0 / 10%);
      border-radius: 3px;
      padding: 10px 25px;
      margin-top: 20px;
      height: calc(100% - 102px);
      overflow: auto;
      >h1{
        color: #333;
        font-size: 17px;
        height: 20px;
        line-height: 20px;
        margin: 20px 0 10px 0;
      }
      :deep(.ant-form-item-control){
        flex: 0 0 100%;
      }
    }
  }
</style>
