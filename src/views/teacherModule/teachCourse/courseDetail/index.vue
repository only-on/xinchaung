<template>
  <DetailHeader :info="state.courseDetail" :tabs="Number(currentTab)===0?detailTabs:[]" @selectTab="selectTab" @setupCourse="setupCourse" @editCourse="editCourse" />
  <div class="tab-course-content">
    <!-- 每个tab对应的组件 -->
    <!--课程章节-->
    <courseChapter v-if="state.activeTab.value === 'courseChapter'" :courseDetail="state.courseDetail" />
    <!-- 课程实验管理 -->
    <courseExperiment v-if="state.activeTab.value=='courseExperiment'" />
    <!-- 随堂测试 -->
    <popQuiz v-if="state.activeTab.value=='popQuiz'" />
    <!-- 成绩评阅 -->
    <performanceReview v-if="state.activeTab.value=='performanceReview'" />
    <!-- 学情分析 -->
    <studentAnalysis v-if="state.activeTab.value=='studentAnalysis'" />
    <!-- 成员管理 -->
    <memberManagement v-if="state.activeTab.value=='memberManagement'" />
    <!-- 课程成绩 -->
    <courseAchievement v-if="state.activeTab.value=='courseAchievement'" />
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
            <a-range-picker @change="dateChange" v-model:value="formState.date" valueFormat="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" :disabledDate="disabledDate">
              <template #suffixIcon>
                <SmileOutlined />
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
            <div>
              <LabelList :tag="formState.tags" :recommend="formState.recommend" />
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
          <a-form-item label="实验时长" name="content_duration">
            <a-input v-model:value="formState.content_duration" placeholder="请输入实验时长" />
          </a-form-item>
          <a-form-item label="课程简介" name="introduce">
             <a-textarea v-model:value="formState.introduce" :auto-size="{ minRows: 6, maxRows: 8 }" placeholder="请输入课程简介" />
          </a-form-item>
        </div>
      </div>
    </a-form>
    <template #footer>
      <Submit @submit="Save()" @cancel="cancel()" :loading="editLoading"></Submit>
    </template>
  </a-modal>

  <!-- 课程设置 -->
  <a-modal v-model:visible="setupVisible"  :title="`设置`" class="setupVisible" :width="490">
    <div class="tips flexCenter">
      <span class="iconfont icon-zhuyi"></span>
      <span>关闭后对学生不展示该内容</span>
    </div>
    <div class="box">
      <div class="item flexCenter">
        <span>实验指导（VNC、Jupyter、IDE、命令行）是否显示</span>
        <a-switch v-model:checked="setupForm.guide" />
      </div>
      <div class="item flexCenter">
        <span>课件是否显示</span>
        <a-switch v-model:checked="setupForm.courseWare" />
      </div>
      <div class="item flexCenter">
        <span>备课资料是否显示</span>
        <a-switch v-model:checked="setupForm.prepare" />
      </div>
      <div class="item flexCenter">
        <span>教学指导是否显示</span>
        <a-switch v-model:checked="setupForm.teachingGuidance" />
      </div>
      <div class="item flexCenter">
        <span>任务制实验步骤</span>
        <a-switch v-model:checked="setupForm.taskSteps" />
      </div>
      <div class="item flexCenter">
        <span>实验报告是否显示</span>
        <a-switch v-model:checked="setupForm.report" />
      </div>
      <div class="item flexCenter">
        <span>更换实验报告</span>
        <a-button type="primary" @click="changeReport()" size="small"> 选择 </a-button>
      </div>
    </div>
    <template #footer>
      <Submit @submit="SaveSetup()" @cancel="cancelSetup()" :loading="SetupLoading"></Submit>
    </template>
  </a-modal>

  <!-- 选择 和 设置实验实验报告模板 -->
  <SelectReport v-if="reportVisible" :selectedReport="setupForm.reportObj"
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
import { SmileOutlined } from '@ant-design/icons-vue';
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
import courseAchievement from "./courseAchievement.vue" // 课程成绩
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
const currentRole: number = storage.lStorage.get("role");
const routeQuery = useRoute().query;
const { currentTab,courseId } = route.query;
const detailTabs=[
  {name:'课程章节',value:'courseChapter'},
  {name:'课程实验管理',value:'courseExperiment'},
  {name:'随堂测试',value:'popQuiz'},
  {name:'成绩评阅',value:'performanceReview'},
  {name:'学情分析',value:'studentAnalysis'},
  {name:'成员管理',value:'memberManagement'},]
const  studentDetailTabs=[
  {name:'课程内容',value:'courseChapter'},
  {name:'课程成绩',value:'courseAchievement'},
]
var state:IState=reactive({
  activeTab:{},
  courseDetail:{}
})
state.activeTab=detailTabs[0]
function initData(){
  http.courseDetail({urlParams:{courseId:courseId}}).then((res:IBusinessResp)=>{
    state.courseDetail=res.data
  })
}
const selectTab=(val:any)=>{
  console.log(val)
  state.activeTab={...val}
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
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 20, message: `名称最多20个字符`, trigger: "blur" },
  ],
  categoryText: [
    { required: true, message: "请选择数据集类型", trigger: "change" },
  ],
}
const Save=()=>{
  editLoading.value=true
  formRef.value.validate().then(()=>{
    http.UploadCourse({param:{...formState}}).then((res: IBusinessResp)=>{
      message.success('编辑成功')
      editLoading.value=false
      editVisible.value=false
    })
  })
}
const cancel=()=>{
  editVisible.value=false
}
const editCourse=()=>{
  http.courseCategory().then((res:IBusinessResp)=>{
    const {data}=res  
    courseDirection.push(...data)
  })
  http.vocationDirection().then((res:IBusinessResp)=>{
    const {data}=res
    vocationDirection.push(...data)
  })
  const {name,url,is_public,category,direction,introduce,tags,class_total,content_duration,start_time,end_time}=state.courseDetail
  formState.date=[start_time,end_time]
  formState.start_time=start_time
  formState.end_time=end_time
  formState.cover=state.courseDetail.url
  formState.introduce=introduce

  formState.name=name
  formState.url=url
  formState.is_public=is_public
  formState.category=category
  formState.direction=direction
  formState.tags=tags
  formState.class_total=class_total
  formState.content_duration=content_duration

  editVisible.value=true

}


//  设置课程
var setupVisible: Ref<boolean> = ref(false);
const SetupLoading = ref<boolean>(false)
const setupForm:any=reactive({
  guide:false,
  courseWare:false,
  prepare:false,
  teachingGuidance:false,
  taskSteps:false,
  report:false,
  reportObj:{
    id:0,
    name:''
  }
})
var reportVisible = ref<boolean>(false);
const setupCourse=()=>{
  setupVisible.value=true
}
const changeReport=()=>{
  reportVisible.value = true;
}
const reportCancel = () => {
  reportVisible.value = false;
};
const reportOk = (val: any) => {
  console.log(val)
  setupForm.reportObj.id = val.id;
  setupForm.reportObj.name = val.name;
};
const SaveSetup=()=>{
  // http.editChart({param:{...formState}}).then((res: IBusinessResp)=>{
  //   message.success('操作成功')
  //   setupVisible.value=false
  // })
}
const cancelSetup=()=>{
  setupVisible.value=false
}
const disabledDate=(current: Moment)=>{
  return current && current <= moment().endOf('day').subtract(1, "days");
}
const dateChange=(val:any)=>{
  // console.log(val)
  formState.start_time=val[0],
  formState.end_time=val[1]
  // console.log(formState)
}
const uploadCoverHandle=(file:any)=>{
  const fd = new FormData()
  fd.append('file', file)
  http.courseCoverUpload({param:fd}).then((res:any)=>{
    formState.url = res.data.url
  })
}
onMounted(() => {
  initData()
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
    }
  }
  .setupVisible{
    .tips{
      padding: 0 1rem;
      font-size: 12px;
    }
    .box{
      padding:1rem;
      .item{
        height: 44px;
        justify-content: space-between;
      }
    }
  }
</style>
