<template>
  <div class="create-course-box">
    <a-steps :current="currentStep" class="create-steps-box">
      <template #progressDot="{ prefixCls }">
        <span :class="`${prefixCls}-icon-dot`" />
      </template>
      <a-step title="设置基本信息" />
      <a-step title="设置课程实验" />
      <a-step title="设置课程成员" />
      <a-step title="完成" />
    </a-steps>
    <div class="create-course-main">
      <template v-if="currentStep === 0">
        <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
          <div class="info">
            <div class="left">
              <a-form-item label="课程名称" name="name">
                <a-input v-model:value="formState.name" placeholder="请输入课程名称" />
              </a-form-item>
              <a-form-item label="起始时间" name="date">
                <a-range-picker @change="dateChange" v-model:value="formState.date" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" :disabledDate="disabledDate">
                  <template #suffixIcon>
                    <SmileOutlined />
                  </template>
                </a-range-picker>
              </a-form-item>
              <a-form-item label="课程方向" name="category">
                <a-select v-model:value="formState.category" placeholder="请选择课程方向">
                  <a-select-option :value="item.name" v-for="(item, index) in courseCategory" :key="item.name">
                      {{ item.name }}
                    </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="职业方向" name="direction">
                <a-select v-model:value="formState.direction" placeholder="请选择职业方向">
                  <a-select-option :value="item.name" v-for="(item, index) in vocationDirection" :key="item.name">
                      {{ item.name }}
                    </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="添加标签" name="tags">
                <div>
                    <LabelList :tag="formState.tags" />
                  </div>
              </a-form-item>
              <a-form-item label="封面图" class="cover">
                <uploadCover :coverUrl="formState" :isUpload="true" @uploadCoverHandle="uploadCoverHandle" />
              </a-form-item>
            </div>
            <div class="right">
              <a-form-item label="可见范围" name="is_public" class="visible-range">
                <a-select v-model:value="formState.is_public">
                  <a-select-option :value="1">
                    <span class="name">公开</span>
                    <span class="tips">所有人可见</span>
                  </a-select-option>
                  <a-select-option :value="0">
                    <span class="name">私有</span>
                    <span class="tips">仅自己可见</span>
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="课时" name="class_total">
                <a-input v-model:value="formState.class_total" placeholder="请输入课时" />
              </a-form-item>
              <a-form-item label="实验时长" name="content_duration" class="conentDuration">
                <template #extra>
                  时间设置范围为40-120分钟
                </template>
                <a-input v-model:value="formState.content_duration" placeholder="请输入实验时长" />分钟
              </a-form-item>
              <a-form-item label="课程简介" name="introduce">
                <a-textarea v-model:value="formState.introduce" :auto-size="{ minRows: 6, maxRows: 8 }" placeholder="请输入课程简介" />
              </a-form-item>
            </div>
          </div>
        </a-form>
        <div class="first-step-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="next(1)" :loading="stup1Loading">{{`${stup1Loading?'保存中...':'下一步'}`}}</a-button>
          <a-button type="primary" v-if="EditId" @click="next(4)" :loading="stup1Loading">{{`${stup1Loading?'保存中...':'保存'}`}}</a-button>
        </div>
      </template>
      <template v-if="currentStep === 1">
        <div class="info2">
          <SetupChapter :Editable="'canEdit'" :courseId="courseId" :create="true" />
        </div>
        <div class="first-step-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="last(0)">上一步</a-button>
          <a-button type="primary" @click="next(2)">下一步</a-button>
          <a-button type="primary" v-if="EditId" @click="next(4)" :loading="stup1Loading">{{`${stup1Loading?'保存中...':'保存'}`}}</a-button>
        </div>
      </template>
      <template v-if="currentStep === 2">
        <div class="info3">
          <customerInfor :courseId="courseId" />
        </div>
        <div class="first-step-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="last(1)">上一步</a-button>
          <a-button type="primary" @click="next(3)" :loading="stup1Loading">保存</a-button>
        </div>
      </template>
      <template v-if="currentStep === 3">
        <div class="info4">
          <div class="img"></div>
          <div class="succTit">课程已创建成功</div>
          <div class="text">
            该课程已存放置我的教学课程列表，可点击下方按钮查看课程或继续添加
          </div>
        </div>
        <div class="first-step-btn">
          <a-button @click="goAdd()">继续添加</a-button>
          <a-button type="primary" @click="cancel()">查看课程</a-button>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent,ref,onMounted,reactive,Ref,inject, computed,toRefs, watch,defineExpose, defineProps, withDefaults,} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import LabelList from 'src/components/LabelList.vue'
import { SmileOutlined } from '@ant-design/icons-vue';
import SetupChapter from '../courseDetail/components/Chapter/SetupChapter.vue'
import { ColumnProps } from "ant-design-vue/es/table/interface";
import customerInfor from "./stup3/index.vue";
import Submit from "src/components/submit/index.vue";
import moment, { Moment } from 'moment';
import uploadCover from "src/components/uploadCover/index.vue"
type Key = ColumnProps["key"];
const router = useRouter();
const route = useRoute();

const { EditId ,currentTab} = route.query;
const http = (request as any).teachCourse;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "创建课程", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

var currentStep:Ref<number>=ref(0)
var stup1Loading:Ref<boolean>=ref(false)
const last=(val:number)=>{
  currentStep.value=val
  console.log(formState)
}
const next=(val:number)=>{
  console.log(formState)
  // currentStep.value=val
  // return
  if(EditId){
    // 复用课程
    multiplexingCourse(val)
    return
  }
  if(val === 1 && courseId.value === 0){
    formRef.value.validate().then(()=>{
      formState.is_available=0
      stup1Loading.value=true
      formState.start_time=moment(formState.start_time).format('YYYY-MM-DD 00:00:00');
      formState.end_time=moment(formState.end_time).format('YYYY-MM-DD 23:59:59');
      http.createCourseBaseApi({param:{...formState}}).then((res:IBusinessResp)=>{
        const {data}=res
        stup1Loading.value=false
        currentStep.value=val
        courseId.value=data.id
        router.replace({
          path: "/teacher/teacherCourse/CreateCourse",
          query: { currentTab:currentTab,courseId:data.id}
        });
        setTimeout(() => {
          currentStep.value=val
        }, 10);
      }).catch((err:any)=>{
        stup1Loading.value=false
      })

    })
    return
  }
  if(val === 3){
    formState.is_available=1
    stup1Loading.value=true
    formState.start_time=moment(formState.start_time).format('YYYY-MM-DD 00:00:00');
    formState.end_time=moment(formState.end_time).format('YYYY-MM-DD 23:59:59');
    http.UploadCourse({param:{...formState},urlParams: {courseId: courseId.value}}).then((res: IBusinessResp)=>{
      const {data}=res
      stup1Loading.value=false
      currentStep.value=val
      courseId.value=data.id
    }).catch((err:any)=>{
      stup1Loading.value=false
    })
    return
  }
  currentStep.value=val
}
const multiplexingCourse=(val:number)=>{
  if(val === 1){
    formRef.value.validate().then(()=>{
      formState.is_available=0
      // formState.is_available=1
      formState.start_time=moment(formState.start_time).format('YYYY-MM-DD 00:00:00');
      formState.end_time=moment(formState.end_time).format('YYYY-MM-DD 23:59:59');
      stup1Loading.value=true
      http.UploadCourse({param:{...formState},urlParams: {courseId: courseId.value}}).then((res: IBusinessResp)=>{
        const {data}=res
        stup1Loading.value=false
        currentStep.value=val
        courseId.value=data.id
        router.replace({
          path: "/teacher/teacherCourse/CreateCourse",
          query: { currentTab:currentTab,courseId:data.id}
        });
        setTimeout(() => {
          currentStep.value=val
        }, 10);
      }).catch((err:any)=>{
        stup1Loading.value=false
      })

    })
    return
  }
  if(val===3 || val === 4){
      console.log('baocun1')
      // return
      formRef.value.validate().then(()=>{
        stup1Loading.value=true
        formState.is_available=1
        formState.start_time=moment(formState.start_time).format('YYYY-MM-DD 00:00:00');
        formState.end_time=moment(formState.end_time).format('YYYY-MM-DD 23:59:59');
        http.UploadCourse({param:{...formState},urlParams: {courseId: courseId.value}}).then((res: IBusinessResp)=>{
          const {data}=res
          stup1Loading.value=false
          if(val === 4){
            cancel()
            return
          }
          currentStep.value=val
          courseId.value=data.id
        }).catch((err:any)=>{
          stup1Loading.value=false
        })
      })
    return  
  }
  currentStep.value=val
}
const cancel=()=>{
  router.go(-1)
}
//  步骤一
var courseId:Ref<number>=ref(0)
const formRef = ref();
const courseCategory:any=reactive([])
const vocationDirection:any=reactive([])

// interface IFormState{
//   is_available:boolean,
//   name: string,
//   url: string,
//   introduce:string,
//   date: Moment[];
//   start_time: "" | Moment;
//   end_time: "" | Moment;
//   category:string,
//   direction: string,
//   is_public: number,
//   class_total:number,
//   tags: string[],
//   content_duration: number | string ,
// }
const formState:any = reactive({
  is_available:0, // 课程创建第一步的时候，这个字段传0，课程创建最后一步 传1
  cover:'',    // 未上传前 封面原文件    后url
  name: '', // 课程名称
  url: '', // 课程封面
  introduce:'',// 课程简介
  date:null, // 日期区间
  start_time:'',
  end_time:'',
  category:'',  // "深度学习", // 课程方向
  direction: '', // "大数据工程师", // 职业方向
  is_public: 0,  // 0-私有, 1-公开
  class_total:2, // 课时
  tags: [],   // ["大数据","人工智能"], // 标签
  content_duration: 40,// 实验时长
})
let validateNum = async (rule: any, value: string) => {
  let validateor = /^[0-9]*[1-9][0-9]*$/
  if (!validateor.test(value)) {
    return Promise.reject('请输入正整数');
  } else if (rule.field === 'content_duration') {
    if (Number(value) < 40 || Number(value) > 120) {
      return Promise.reject('时间设置范围为40-120分钟');
    }
  } else {
    return Promise.resolve();
  }
};
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 20, message: `名称最多20个字符`, trigger: "blur" },
  ],
  categoryText: [
    { required: true, message: "请选择数据集类型", trigger: "change" },
  ],
  class_total: [
    {validator: validateNum}
  ],
  content_duration: [
    {validator: validateNum}
  ]
}
const disabledDate=(current: Moment)=>{
  return current && current <= moment().endOf('day').subtract(1, "days");
}
const dateChange=(val:any)=>{
  console.log(val)
  formState.start_time=val[0],
  formState.end_time=val[1]
  // console.log(formState)
}
const uploadCoverHandle=(file:any)=>{
  const fd = new FormData()
  fd.append('file', file)
  http.courseCoverUpload({param:fd}).then((res:any)=>{
    formState.url = res.data.url
    formState.cover = res.data.url
  })
}



// 步骤二

// 步骤三

// 步骤四
const goAdd=()=>{
  router.replace({
    path: "/teacher/teacherCourse/CreateCourse?currentTab=0",
  });
  setTimeout(() => {
    location.reload();
  });
}
// 课程复用和获取详情
const multiplexing=()=>{
  http.multiplexing({urlParams: {courseId: EditId}}).then((res: IBusinessResp)=>{
    const {data}=res
    const {name,url,is_public,category,direction,introduce,tag,class_total,content_duration,start_time,end_time}=data
    courseId.value=data.id
    formState.date=[start_time,end_time]
    formState.start_time=start_time
    formState.end_time=end_time
    formState.cover=url
    formState.introduce=introduce
    formState.name=name
    formState.url=url
    formState.is_public=is_public
    formState.category=category
    formState.direction=direction
    formState.tags=tag
    formState.class_total=class_total
    formState.content_duration=content_duration
    console.log(formState)
  })
}
onMounted(()=>{
  http.courseCategory().then((res:IBusinessResp)=>{
    const {data}=res
    courseCategory.push(...data)
    // formState.category=courseCategory[0].name
  })
  http.vocationDirection().then((res:IBusinessResp)=>{
    const {data}=res
    vocationDirection.push(...data)
    // formState.direction=vocationDirection[0].name
  })
  if(EditId){
    // 复用 multiplexing  courseDetail
    multiplexing()
  }
})

</script>
<style scoped lang="less">
.create-course-box{
  padding:40px;
  .create-course-main{
    .info{
      padding: 60px 60px 0;
      display: flex;
      justify-content: space-between;
      .left,.right{
        width: 40%;
      }
      .conentDuration{
        position: relative;
        :deep(.ant-form-item-extra){
          position: absolute;
          top: -28px;
          left: 68px;
          font-size: 12px;
        }
        .ant-input{
          width: 90%;
          margin-right: 8px;
        }
      }
    }
    .info2{
      padding-top: 20px;
    }
    .info4{
      div {
        width: 100%;
        margin: 0 auto;
        text-align: center;
      }
      .img {
        width: 94px;
        height: 94px;
        background: url("src/assets/images/teacherImageResourcePool/success.png")
          no-repeat;
        background-size: 100% 100%;
      }
      .succTit {
        font-size: 24px;
        color: var(--black-85);
        margin-top: 2rem;
      }
      .text {
        padding-top: 0.5rem;
        color: var(--black-45);
      }
    }
  }
}
.first-step-btn{
  margin-top: 2rem;
  text-align:center;
  .ant-btn{
    margin:0 1rem;
  }
}
</style>
