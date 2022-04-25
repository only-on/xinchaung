<template>
  <DetailHeader :info="state.courseDetail" :tabs="studentDetailTabs" @selectTab="selectTab" />
  <div class="tab-course-content">
    <!-- 每个tab对应的组件 -->
    <!--课程章节-->
    <courseChapter v-if="state.activeTab.value === 'courseChapter'" :courseDetail="state.courseDetail" />
    <!-- 课程成绩 -->
    <courseAchievement v-if="state.activeTab.value=='courseAchievement'" />
  </div>

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
import storage from "src/utils/extStorage";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect";
import DetailHeader from 'src/views/teacherModule/teachCourse/component/common/DetailHeader.vue' 

// 内容去tab
import courseChapter from "./courseChapter.vue"   // 课程章节
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
const role = Number(storage.lStorage.get("role"));
const routeQuery = useRoute().query;
const { currentTab,courseId } = route.query;
const  studentDetailTabs=[
  {name:'课程内容',value:'courseChapter'},
  {name:'课程成绩',value:'courseAchievement'},
]
var state:IState=reactive({
  activeTab:{},
  courseDetail:{}
})
state.activeTab=studentDetailTabs[0]
function initData(){
  editLoading.value=true
  http.courseDetail({urlParams:{courseId:courseId}}).then((res:IBusinessResp)=>{
    state.courseDetail=res.data
    editLoading.value=false
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
  console.log(formState)
  // return
  editLoading.value=true
  formRef.value.validate().then(()=>{
    http.UploadCourse({param:{...formState},urlParams: {courseId: courseId}}).then((res: IBusinessResp)=>{
      message.success('编辑成功')
      formRef.value.resetFields()
      initData()
      editLoading.value=false
      editVisible.value=false
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
  const {name,url,is_public,category,direction,introduce,tag,class_total,content_duration,start_time,end_time}=state.courseDetail
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
    name:''
  }
})
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
      background: linear-gradient(90deg,rgba(0,0,0,0.04), rgba(84,84,84,0.04));
    }
    .box{
      padding:1rem;
      .item{
        height: 44px;
        justify-content: space-between;
      }
      .report {
        line-height: 44px;
        .type{
          color: var(--brightBtn);
        }
      }
    }
  }
</style>
