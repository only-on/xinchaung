<template>
   <div class="creat"  v-layout-bg>
        <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
          <div class="main">
              <div class="left">
                  <a-form-item label="实训名称"  name="name">
                    <a-input v-model:value="formState.name" />
                  </a-form-item>
                  <a-form-item label="课时"  name="train_time">
                    <a-input v-model:value="formState.train_time" />
                  </a-form-item>
                  <div class="time">
                    <a-form-item label="开始时间" name="start_time">
                        <a-date-picker class="time" placeholder="开始日期" v-model:value="formState.start_time" valueFormat='YYYY-MM-DD'/>
                    </a-form-item>
                    <a-form-item label="结束时间" name="end_time">
                        <a-date-picker placeholder="结束日期" v-model:value="formState.end_time" valueFormat='YYYY-MM-DD'/>
                    </a-form-item>
                  </div>
                  <div>
                <upload-image></upload-image>
            </div>
              </div>
              <div class="right">
                  <a-form-item label="实训指导书"  name="guide" class="guide">
                      <a-textarea style="height:220px" v-model:value="formState.guide" />
                  </a-form-item>
                  <a-form-item label="添加实训课件">
                      <a-button class="addCourseware" >
                        <span class="icon-tianjia iconfont"></span>
                      </a-button>
                  </a-form-item>
              </div>
            </div>
        </a-form>
      <div class="foot">
        <a-button  @click.prevent="onCancel"> 取 消 </a-button>
        <a-button class="next" type="primary" @click.prevent="onSubmit"> 下一步 </a-button>
        <a-button class='save' type="primary" @click.prevent="onSave"> 保存 </a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
import uploadImage from '../components/uploadImage/uploadImage.vue'
import { context } from 'ant-design-vue/lib/vc-image/src/PreviewGroup'
const http=(request as any).teacherTrain
interface form{
  name:string;
  start_time:string,
  end_time:string,
  url:string,
  url_is_uploaded:string,
  train_time:string,
  guide:string,
  courseware:string,
  train_id:number | ''
}
interface Istate{
  formState:form,
  formRef:any
}
export default defineComponent({
  name: 'CreatePosts',
  components: {
    uploadImage
  },
  setup: (props,context) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})
    const http=(request as any).teacherTrain
    const rules={
            name: [{ required: true, message: '请输入实训名称'},],
            start_time: [{ required: true, message: '请选择开始时间'},],
            end_time: [{ required: true, message: '请选择结束时间'},],
            train_time: [{ required: true, message: '请输入课时'},],
            content: [{ required: true, message: '请输入帖子内容'}],
            guide: [{ required: true, message: '请输入实训指导内容'}],
            }
     const state:Istate=reactive({
        formRef:'formRef',
        formState:{
          name:'',
          start_time:'',
          end_time:'',
          url:'',
          url_is_uploaded:'',
          train_time:'',
          guide:'',
          courseware:'',
          train_id:''
        },
     })
     const methods={
        onCancel(){
          
        },
        onSubmit(){
          state.formState.url='/images/upload/teacher-default/cover2.png'
          state.formState.url_is_uploaded='0'
          state.formRef.validate().then(() => {
              methods.setupTrain()
          })
        },
        onSave(){

        },
        setupTrain(){
          let formdata=new FormData()
          formdata.append('name',state.formState.name)
          formdata.append('start_time',state.formState.start_time)
          formdata.append('end_time',state.formState.end_time)
          formdata.append('url',state.formState.url)
          formdata.append('url_is_uploaded',state.formState.url_is_uploaded)
          formdata.append('train_time',state.formState.train_time)
          formdata.append('guide',state.formState.guide)
          http.createTrain({param:formdata}).then((res:any)=>{
            console.log(res)
            const trainId=res.datas.train_id
            context.emit('content-trainid',trainId)
            context.emit('step-status',1)
          })
        }
     }
    onMounted(()=>{
     
    })
    return {...toRefs(state),...methods,rules};
  },
})
</script>

<style scoped lang="less">
  .main{
    width: 100%;
    display: flex;
    margin: 0 auto;
    justify-content:space-between;

    .left{
      // width:45%;
      width:54%;
      .time{
        display: flex;
        justify-content:space-between;
      }
    }
    .right{
      width:45%;
      .addCourseware{
        width: 112px;
        height:32px;
        border: 1px solid @theme-color;
        .icon-tianjia{
          font-size: 18px;
          color:@theme-color;
        }
      }
    }
  }
  .foot{
    margin-top:30px;
    text-align: center;
    .next,.save{
      margin-left: 10px;
    }
  }
</style>
