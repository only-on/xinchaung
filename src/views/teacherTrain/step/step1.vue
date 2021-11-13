<template>
   <div class="createProgress1"  v-layout-bg>
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
                        <a-date-picker class="time" placeholder="开始日期" v-model:value="formState.start_time" :disabled-date="disabledDate" valueFormat='YYYY-MM-DD'/>
                    </a-form-item>
                    <a-form-item label="结束时间" name="end_time">
                        <a-date-picker placeholder="结束日期"  v-model:value="formState.end_time" :disabled-date='disableEndDate' valueFormat='YYYY-MM-DD'/>
                    </a-form-item>
                  </div>
                  <div>
                <upload-image :uploadUrl="formState.url" @img-src='imgSrc' createOrEdit='create'></upload-image>
            </div>
              </div>
              <div class="right">
                  <a-form-item label="实训指导书"  name="guide" class="guide">
                      <a-textarea style="height:220px" v-model:value="formState.guide" />
                  </a-form-item>
                  <a-form-item label="添加实训课件">
                     <a-upload
                        name="file"
                        :multiple="false"
                        :before-upload="beforeUpload"
                        >
                        <a-button class="addCourseware">
                            <span class="icon-tianjia iconfont"></span>
                        </a-button>
                    </a-upload>
                  </a-form-item>
              </div>
            </div>
        </a-form>
      <div class="foot">
        <a-button  @click.prevent="onCancel"> 取 消 </a-button>
        <a-button class="next" type="primary" @click.prevent="onSubmit"> 下一步 </a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
import uploadImage from '../components/uploadImage/uploadImage.vue'
import { useRouter ,useRoute } from 'vue-router';
import { message } from 'ant-design-vue'
import moment from 'moment';
const http=(request as any).teacherTrain
interface form{
  name:string;
  start_time:string,
  end_time:string,
  url:string,
  train_time:string,
  guide:string,
  courseware:string,
  train_id:number | ''
}
interface Istate{
  formState:form,
  formRef:any,
  againForm?:form
}
export default defineComponent({
  name: 'CreatePosts',
  components: {
    uploadImage
  },
  setup: (props,context) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})
    const router = useRouter();
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
          train_time:'',
          guide:'',
          courseware:'',
          train_id:''
        },
     })
     const methods={
      disabledDate(current:any) {
        return current && current < moment().endOf('day').subtract(1, 'days')
      },
      disableEndDate(current:any){
        return current && current <  moment(state.formState.start_time)
      },
      imgSrc(val:any){
        console.log(val)
        state.formState.url=val
      },
      beforeUpload(file:any){
        console.log(file)
        const fileType =file.name.split('.')[file.name.split('.').length-1]
        const isType=fileType==='ppt'||fileType==='pptx'||fileType==='pdf'
        if(!isType){
          message.error('文件格式不正确!')
          return
        }
        const fd=new FormData()
        fd.append('uploadFiled',file)
        fd.append('upload_path','teacherTrain')
        http.uploadsFile({param:fd}).then((res:any)=>{
          console.log(res)
          state.formState.courseware=res.data.url
        })
        return false
      },
        onCancel(){
          router.go(-1)
          inject['stepInfoOne']={}
          inject['stepInfoTwo']={}
          inject['stepInfoThree']={}
          inject['stepInfoFour']={}
          inject['stepInfoFive']={}
        },
        onSubmit(){
          // context.emit('step-status',1)
          if(state.formState.name)
          if(Number(state.formState.train_time)<1||Number(state.formState.train_time)>16||Number(state.formState.train_time)%1!==0){
            message.warning("课时必须是1-16的整数")
            return
          }
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
          formdata.append('courseware',state.formState.courseware)
          formdata.append('class_cnt',state.formState.train_time)
          formdata.append('guide',state.formState.guide)
          http.createTrain({param:formdata}).then((res:any)=>{
            console.log(res)
            context.emit('step-status',1)
            const trainId=res.data.id
            context.emit('content-trainid',trainId)
            inject['stepInfoOne']=state.formState
          })
        }
     }
    onMounted(()=>{
       if(inject['stepInfoOne']){
         state.formState=inject['stepInfoOne']
       }
    })
    return {...toRefs(state),...methods,rules};
  },
})
</script>

<style scoped lang="less">
.createProgress1{
  margin: 0px 30px;
    .main{
    width: 100%;
    display: flex;
    margin: 0 auto;
    justify-content:space-between;

    .left{
      width:48%;
      // width:54%;
      .time{
        display: flex;
        justify-content:space-between;
      }
    }
    .right{
      width:48%;
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
}

</style>
