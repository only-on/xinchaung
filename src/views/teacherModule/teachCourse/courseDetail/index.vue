<template>
  <DetailHeader :info="state.courseDetail" :tabs="tabType()" :activeTabOrder="activeTabOrder ? Number(activeTabOrder) : 0" @selectTab="selectTab" @setupCourse="setupCourse" @editCourse="editCourse" />
  <div class="tab-course-content">
    <!-- 每个tab对应的组件 -->
    <!--课程章节-->
    <courseChapter v-if="state.activeTab.value === 'courseChapter'" :courseDetail="state.courseDetail" @feedback="initData()" />
    <!-- 课程实验管理 -->
    <courseExperiment v-if="state.activeTab.value=='courseExperiment'" />
    <!-- 随堂测试 -->
    <popQuiz v-if="state.activeTab.value=='popQuiz'" />
    <!-- 成绩评阅 -->
    <performanceReview v-if="state.activeTab.value=='performanceReview'" />
    <!-- 学情分析 -->
    <studentAnalysis v-if="state.activeTab.value=='studentAnalysis'" />
    <!-- 成员管理 -->
    <memberManagement v-if="state.activeTab.value=='memberManagement'" @updateGroup='updateGroup'  :is_teamed='state.courseDetail.is_teamed' :is_high="state.courseDetail.is_high" />
    <!-- 查看成绩 -->
    <ViewResults v-if="state.activeTab.value=='ViewResults'" />
  </div>

  <!-- 编辑课程基本信息 弹窗 -->
  <a-modal v-model:visible="editVisible"  :title="`编辑课程基本信息`" class="editVisible" :width="900">
    <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
      <div class="info">
        <div class="left">
          <a-form-item label="课程名称" name="name">
            <a-input v-model:value="formState.name" placeholder="请输入课程名称" />
          </a-form-item>
          <a-form-item label="起始时间" name="date">
            <a-range-picker @change="dateChange" v-model:value="formState.date" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" :disabledDate="disabledDate">
              <template #suffixIcon>
                <CalendarOutlined />
              </template>
            </a-range-picker>
          </a-form-item>
           <a-form-item label="课程方向" name="category">
            <a-select v-model:value="formState.category" placeholder="请选择课程方向">
              <a-select-option :value="item.name" v-for="(item, index) in courseDirection" :key="item.name">
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
            <LabelList :tag="formState.tags" />
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
          <a-form-item label="课时" name="class_total" class="class-total">
            <template #extra>
              设置范围为0-200分钟
            </template>
            <a-input v-model:value="formState.class_total" placeholder="请输入课时" />
          </a-form-item>
          <a-form-item label="实验时长" name="content_duration" class="conentDuration">
            <template #extra>
              时间设置范围为40-120分钟
            </template>
            <a-input v-model:value="formState.content_duration" placeholder="请输入实验时长" />分钟
          </a-form-item>
          <a-form-item label="课程简介" name="introduce">
             <a-textarea v-model:value="formState.introduce" :auto-size="{ minRows: 6, maxRows: 8 }" :maxlength="100" placeholder="请输入课程简介" />
          </a-form-item>
        </div>
      </div>
    </a-form>
    <template #footer>
      <Submit @submit="Save()" @cancel="cancel()" :loading="editLoading || coverLoading"></Submit>
    </template>
  </a-modal>

  <!-- 课程设置 -->
  <a-modal v-model:visible="setupVisible"  :title="`学生端显示内容设置`" class="setupVisible" :width="490">
    <div class="tips flexCenter">
      <span class="iconfont icon-zhuyi"></span>
      <span>关闭后对学生不展示该内容</span>
    </div>
    <div class="box">
      <!-- <a-form :layout="'horizontal'" :model="steupFormState" ref="steupFormRef" :labelCol="{span:20}" :wrapperCol="{ span: 4 }" :labelAlign="'left'">
        <a-form-item label="实验指导（VNC、Jupyter、IDE、命令行）是否显示" name="is_show_content_guidance">
          <a-switch v-model:checked="steupFormState.is_show_content_guidance" />
        </a-form-item>
        <a-form-item label="课件是否显示" name="is_show_courseware">
          <a-switch v-model:checked="steupFormState.is_show_courseware" />
        </a-form-item>
        <a-form-item label="备课资料是否显示" name="is_show_preparation">
          <a-switch v-model:checked="steupFormState.is_show_preparation" />
        </a-form-item>
        <a-form-item label="教学指导是否显示" name="is_show_teaching_guidance">
          <a-switch v-model:checked="steupFormState.is_show_teaching_guidance" />
        </a-form-item>
        <a-form-item label="任务制实验步骤" name="is_show_task_step">
          <a-switch v-model:checked="steupFormState.is_show_task_step" />
        </a-form-item>
        <a-form-item label="实验报告是否显示" name="is_show_content_report">
          <a-switch v-model:checked="steupFormState.is_show_content_report" />
        </a-form-item>
      </a-form> -->
      <div class="item flexCenter">
        <span>实验指导（桌面、IDE、命令行）是否显示</span>
        <a-switch v-model:checked="steupFormState.is_show_content_guidance" />
      </div>
      <div class="item flexCenter">
        <span>课件是否显示</span>
        <a-switch v-model:checked="steupFormState.is_show_courseware" />
      </div>
      <div class="item flexCenter">
        <span>备课资料是否显示</span>
        <a-switch v-model:checked="steupFormState.is_show_preparation" />
      </div>
      <div class="item flexCenter">
        <span>教学指导是否显示</span>
        <a-switch v-model:checked="steupFormState.is_show_teaching_guidance" />
      </div>
      <div class="item flexCenter">
        <span>任务制实验步骤</span>
        <a-switch v-model:checked="steupFormState.is_show_task_step" />
      </div>
      <!-- <div class="item flexCenter">
        <span>实验报告是否显示</span>
        <a-switch v-model:checked="steupFormState.is_show_content_report" />
      </div> -->
      <div class="item flexCenter">
        <span>更换实验报告</span>
        <a-button type="primary" @click="changeReport()" size="small"> 选择 </a-button>
      </div>
      <div v-if="steupFormState.reportObj.id" class="item report">
        <span class="type">{{`${steupFormState.reportObj.typeText}`}}</span>
        <span class="report-name single_ellipsis" :title="steupFormState.reportObj.name">{{`${steupFormState.reportObj.name}`}}</span>
      </div>
    </div>
    <template #footer>
      <Submit @submit="SaveSetup()" @cancel="cancelSetup()" :loading="SetupLoading"></Submit>
    </template>
  </a-modal>

  <!-- 选择 和 设置实验实验报告模板 -->
  <SelectReport v-if="reportVisible" :selectedReport="steupFormState.reportObj"
    @reportCancel="reportCancel"
    @reportOk="reportOk"
  ></SelectReport>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  nextTick,
  provide,
  Ref,
  ref,
  watch,
  onBeforeUnmount,
} from "vue";
import { Modal, message } from "ant-design-vue";
import SelectReport from "src/views/teacherModule/teacherExperimentResourcePool/component/selectReport.vue";
import { CalendarOutlined } from '@ant-design/icons-vue';
import Submit from "src/components/submit/index.vue";
import LabelList from 'src/components/LabelList.vue'
import storage from "src/utils/extStorage";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect";
import PdfVue from "src/components/pdf/pdf.vue"
import DetailHeader from '../component/common/DetailHeader.vue'
import uploadCover from "src/components/uploadCover/index.vue"

// 内容去tab
import courseChapter from "./courseChapter.vue"   // 课程章节
import courseExperiment from "./courseExperiment.vue" // 课程实验
import popQuiz from "./popQuiz.vue" // 随堂测试
import performanceReview from "./performanceReview.vue" // 成绩评阅
import studentAnalysis from "./studentAnalysis.vue" // 学情分析
import memberManagement from "./memberManagement.vue" // 成员管理
import ViewResults from "./ViewResults.vue" // 查看成绩
import moment, { Moment } from 'moment';
interface IState{
  activeTab:any
  courseDetail:any
}
var updata = inject("updataNav") as Function;
updata({
  tabs: [],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});
const route = useRoute();
const router = useRouter();
const http=(request as any).teachCourse
const role = Number(storage.lStorage.get("role"));
const routeQuery = useRoute().query;
const { currentTab,courseId, activeTabOrder,pageType } = route.query;
const detailTabs:any=[
  {name:'课程章节',value:'courseChapter'},
  {name:'实验环境管理',value:'courseExperiment'},
  {name:'随堂测试',value:'popQuiz'},
  {name:'成绩评阅',value:'performanceReview'},
  {name:'学情分析',value:'studentAnalysis'},
  {name:'成员管理',value:'memberManagement'},]
const detailTabs2:any=[]
const tabType=()=>{
  if(Number(currentTab)===0 && pageType!=='ViewResults'){
    return detailTabs
  }else{
    detailTabs2
  }
}
var state:IState=reactive({
  activeTab:{value:''},
  courseDetail:{}
})
let coverLoading = ref(false)
function initData(){
  editLoading.value=true
  http.courseDetail({urlParams:{courseId:courseId}}).then((res:IBusinessResp)=>{
    state.courseDetail=res.data
    // state.courseDetail.is_authorized=false
    state.courseDetail.is_authorizedText=state.courseDetail.is_authorized?'':'Unauthorized'
    editLoading.value=false
  })
}
const selectTab=(val:any)=>{
  console.log(val)
  state.activeTab={...val}
}
function updateGroup(val:any){
  initData()
}
// 编辑课程信息
const formRef = ref();
var editVisible: Ref<boolean> = ref(false);
const editLoading = ref<boolean>(false)
const courseDirection:any=reactive([])
const vocationDirection:any=reactive([])
const formState = reactive<any>({
  is_available:1, // 课程创建第一步的时候，这个字段传0，课程创建最后一步 传1
  cover:'',// 封面原文件
  name: '', // 课程名称
  url: '', // 课程封面
  introduce:'',// 课程介绍
  date:null, // 日期区间
  start_time:'',
  end_time:'',
  category:'',  // "深度学习", // 课程方向
  direction: '', // "大数据工程师", // 职业方向
  is_public: 0,  // 0-私有, 1-公开    
  class_total:2, // 课时
  tags: [],   // ["大数据","人工智能"], // 标签
  content_duration: '',// 实验时长
})
let validateNum = async (rule: any, value: string) => {
  // let validateor = /^[0-9]*[1-9][0-9]*$/
  let validateor = /^([1-9]{1}[0-9]*|0)$/
  if (!validateor.test(value)) {
    return Promise.reject('请输入正整数');
  } else if (rule.field === 'content_duration') {
    if (Number(value) < 40 || Number(value) > 120) {
      return Promise.reject('时间设置范围为40-120分钟');
    }
  } else if (rule.field === 'class_total') {
    if (Number(value) < 0 || Number(value) > 200) {
      return Promise.reject('课时设置范围为0-200');
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
const Save=()=>{
  console.log(formState)
  // return 
  formRef.value.validate().then(()=>{
    editLoading.value=true
    formState.start_time=moment(formState.start_time).format('YYYY-MM-DD 00:00:00');
    formState.end_time=moment(formState.end_time).format('YYYY-MM-DD 23:59:59');
    http.UpdateCourse({param:{...formState},urlParams: {courseId: courseId}}).then((res: IBusinessResp)=>{
      message.success('编辑成功')
      formRef.value.resetFields()
      initData()
      editLoading.value=false
      editVisible.value=false
    }).catch((err:any)=>{
      console.log(err)
      editLoading.value=false
    })
  })
}
const cancel=()=>{
  formRef.value.resetFields()
  editVisible.value=false
}
const editCourse=()=>{
  if(editLoading.value === true){
    return
  }
  http.courseCategory().then((res:IBusinessResp)=>{
    const {data}=res  
    courseDirection.push(...data)
  })
  http.vocationDirection().then((res:IBusinessResp)=>{
    const {data}=res
    vocationDirection.push(...data)
  })
  const {name,url,is_public,category,direction,introduce,tag,class_total,content_duration,start_time,end_time}=JSON.parse(JSON.stringify(state.courseDetail))
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

  editVisible.value=true

}


//  设置课程
const steupFormRef = ref();
var setupVisible: Ref<boolean> = ref(false);
const SetupLoading = ref<boolean>(false)
const steupFormState:any=reactive({
  is_show_content_guidance:true,
  is_show_courseware:true,
  is_show_preparation:true,
  is_show_teaching_guidance:true,
  is_show_task_step:true,
  is_show_content_report:true,
  reportObj:{
    id:0,
    name:'',
    typeText:'',
  }
})
var reportVisible = ref<boolean>(false);
const setupCourse=()=>{
  setupVisible.value=true
  getCourseSetup()
}
const changeReport=()=>{
  reportVisible.value = true;
}
const reportCancel = () => {
  reportVisible.value = false;
};
const reportOk = (val: any) => {
  // console.log(val)
  steupFormState.reportObj={...val}
  // steupFormState.reportObj.id = val.id;
  // steupFormState.reportObj.name = val.name;
};
const SaveSetup=()=>{
  let obj:any={
    is_show_content_guidance:steupFormState.is_show_content_guidance?1:0,
    is_show_courseware:steupFormState.is_show_courseware?1:0,
    is_show_preparation:steupFormState.is_show_preparation?1:0,
    is_show_teaching_guidance:steupFormState.is_show_teaching_guidance?1:0,
    is_show_task_step:steupFormState.is_show_task_step?1:0,
    is_show_content_report:steupFormState.is_show_content_report?1:0,
    template_id:steupFormState.reportObj.id?steupFormState.reportObj.id:''
  }
  steupFormState.reportObj.id?obj.template_id=steupFormState.reportObj.id:''
  http.CourseSteup({urlParams: {courseId: courseId},param:{...obj}}).then((res: IBusinessResp)=>{
    message.success('操作成功')
    getCourseSetup()
    setupVisible.value=false
  })
}
const cancelSetup=()=>{
  setupVisible.value=false
}
const disabledDate=(current: Moment)=>{
  return current && current <= moment().endOf('day').subtract(1, "days");
}
const dateChange=(val:any)=>{
  // console.log(val)
  formState.date=val
  formState.start_time=val[0],
  formState.end_time=val[1]
  // console.log(formState)
}
const uploadCoverHandle=(file:any)=>{
  coverLoading.value = true
  const fd = new FormData()
  fd.append('file', file)
  http.courseCoverUpload({param:fd}).then((res:any)=>{
    coverLoading.value = false
    formState.url = res.data.url
    formState.cover=res.data.url
  })
}
const getCourseSetup=()=>{
  http.getCourseSetup({urlParams: {courseId: courseId}}).then((res: IBusinessResp)=>{
    let data=res.data
    steupFormState.is_show_content_guidance=data.is_show_content_guidance?true:false
    steupFormState.is_show_courseware=data.is_show_courseware?true:false
    steupFormState.is_show_preparation=data.is_show_preparation?true:false
    steupFormState.is_show_teaching_guidance=data.is_show_teaching_guidance?true:false
    steupFormState.is_show_task_step=data.is_show_task_step?true:false
    steupFormState.is_show_content_report=data.is_show_content_report?true:false
    if(data.report_template){
      if(data.report_template.is_init === 1){
        data.report_template.typeText='【系统默认】'
      }else{
        data.report_template.typeText=data.report_template.word_path === ''?'【在线】':'【离线】'
      }
      steupFormState.reportObj={...data.report_template}
    } else {
      steupFormState.reportObj.id = 0
    }
    console.log(steupFormState)
  })
}
onMounted(() => {
  initData()
  if(Number(currentTab)===1){
    selectTab({name:'课程章节',value:'courseChapter'})
  }
  if(Number(currentTab)===0 && pageType === 'ViewResults'){
    selectTab({name:'查看成绩',value:'ViewResults'})
  }
});

</script>

<style lang="less" scoped>
 
  .tab-course-content{
    width: var(--center-width);
    margin: 24.5px auto;
  }
  .editVisible{
    .info{
      display: flex;
      justify-content: space-around;
      .left,.right{
        width: 40%;
      }
      .ant-picker{
        width: 100%;
      }
      .class-total {
        position: relative;
        :deep(.ant-form-item-extra){
          position: absolute;
          top: -28px;
          left: 40px;
          font-size: 12px;
        }
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
          width: 89%;
          margin-right: 8px;
        }
      }
    }
  }
  .setupVisible{
    .tips{
      padding: 0 1rem;
      font-size: 12px;
      background: linear-gradient(90deg,rgba(0,0,0,0.04), rgba(84,84,84,0.04));
      color: var(--black-45);
      &>span:first-child{
        margin-right: 4px;
      }
    }
    .box{
      padding:1rem;
      .item{
        height: 44px;
        justify-content: space-between;
        color: var(--black-65);
      }
      .report {
        height: 34px;
        background: rgba(0,0,0,0.04);
        line-height: 34px;
        display: flex;
        padding: 0 10px;
        .type{
          width: 56px;
          color: var(--brightBtn);
        }
        .report-name {
          flex: 1;
        }
      }
    }
  }
</style>
