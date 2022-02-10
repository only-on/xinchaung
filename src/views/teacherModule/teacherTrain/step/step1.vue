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
                    <a-form-item class="time_start" label="开始时间" name="start_time">
                        <a-date-picker  placeholder="开始日期" v-model:value="formState.start_time" :disabled-date="disabledDate" valueFormat='YYYY-MM-DD'/>
                    </a-form-item>
                    <a-form-item class="time_end" label="结束时间" name="end_time">
                        <a-date-picker placeholder="结束日期"  v-model:value="formState.end_time" :disabled-date='disableEndDate' valueFormat='YYYY-MM-DD'/>
                    </a-form-item>
                  </div>
                  <div>
                <div>
                  <span class="cover_word">实训封面</span><span class="type_title">支持格式：ipg、png,限制尺寸525*300px</span>
                </div>
                <upload-image :uploadUrl="formState.url" @img-src='imgSrc' createOrEdit='create'></upload-image>
            </div>
              </div>
              <div class="right">
                  <a-form-item label="实训指导书"  name="guide" class="guide">
                      <!-- <a-textarea v-model:value="formState.guide" showCount :maxlength="100" /> -->
                      <number-input v-model:value="formState.guide" showCount :auto-size="{ minRows: 5, maxRows: 15 }" :maxlength="100"></number-input>
                  </a-form-item>
                  <div>
                    <div><span>添加实训课件</span><span class="type_title">支持格式: ppt、pptx、pdf。 </span></div>
                    <div class="uploadCourseware">
                    <a-form-item>
                      <a-upload
                        :multiple="false"
                        accept=".ppt,.pptx,.pdf"
                        :file-list="fileList"
                        :before-upload="beforeUpload"
                        :remove='removeFile'
                      >
                        <a-button class="addCourseware">
                              <span class="icon-tianjia iconfont"></span>
                          </a-button>
                      </a-upload>
                    <!-- <a-progress :percent="50" /> -->
                    </a-form-item>
                    </div>
                  </div>
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
import numberInput from "src/components/aiAnt/numberInput.vue"
import { useRouter ,useRoute } from 'vue-router';
import { message } from 'ant-design-vue'
import moment from 'moment';
import { resetSystemSiteApi } from 'src/views/adminSystemSetting/api';

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
  fileList:any[]
}
export default defineComponent({
  name: 'CreatePosts',
  components: {
    uploadImage,
    numberInput
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
        fileList:[]
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
          if(res){
            state.formState.courseware=res.data.url
            state.fileList=[file]
            message.success('上传成功！')
          }else{
            message.error('上传失败！')
          }  
        })
        return false
      },
      removeFile(file:any){
        state.fileList=[]
        state.formState.courseware=''
        console.log(file,'file')
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
        width: 100%;
        .time_start,.time_end{
          width:45%;
        }
      }
    }
    .right{
      width:48%;
      .uploadCourseware{
        margin-top: 10px;
      }
      .addCourseware{
        width: 112px;
        height:32px;
        border: 1px solid var(--primary-color);
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-tianjia{
          font-size: 18px;
          color:var(--primary-color);
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
.type_title{
        color:rgba(0,0,0,0.25);
        font-size: 12px;
        margin-left:20px;
      }
:deep(.ant-calendar-picker){
  width:100%;
}
</style>
