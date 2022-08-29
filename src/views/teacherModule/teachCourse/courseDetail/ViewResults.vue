<template>
  <div class="ViewResultsDetail">
    <div class="info flexCenter">  
      <div class="left flexCenter">
        <div class="item flexCenter">
          <img src="../../../../assets/images/teacherCourse/5.png" alt=""/>
          <span>最高分：{{rankObj.max}}</span>
        </div>
        <div class="item flexCenter">
          <img src="../../../../assets/images/teacherCourse/6.png" alt=""/>
          <span>最低分：{{rankObj.min}}</span>
        </div>
        <div class="item flexCenter">
          <img src="../../../../assets/images/teacherCourse/7.png" alt=""/>
          <span>平均分：{{rankObj.avg}}</span>
        </div>
      </div>
      <div class="right flexCenter">
        <div class="item1">
          <div class="text1">{{`总成绩 = 实验成绩${scoreData.content_score}% + 作业成绩${scoreData.task_score}% + 考试成绩${scoreData.exam_score}%`}}</div>
          <div class="text2 flexCenter">
            <span>实验成绩、作业成绩和考试成绩为平均成绩</span>
            <a-button @click.stop="SetupScore()" type="link" class="del" size="small">修改成绩占比</a-button>
          </div>
        </div>
        <img class="item2" src="../../../../assets/images/teacherCourse/4.png" alt="" />
      </div>
    </div>
    <div class="content">
      <div class="search flexCenter">
        <div class="left flexCenter">
          <div class="item">
            <span>姓名：</span>
            <a-input v-model:value="searchInfo.name" placeholder="请输入关键字搜索" @keyup.enter="searchList" />
          </div>
          <div class="item">
            <span>班级：</span>
            <a-input v-model:value="searchInfo.class" placeholder="请输入关键字搜索" @keyup.enter="searchList" />
          </div>
          <div class="item">
            <span>学号：</span>
            <a-input v-model:value="searchInfo.user" placeholder="请输入关键字搜索" @keyup.enter="searchList" />
          </div>
        </div>
        <div class="right">
          <a-button type="primary" @click="exportResults()"> 导出成绩 </a-button>
        </div>
      </div>
      <div class="tableContent">
        <a-spin :spinning="loading" size="large" tip="Loading...">
          <a-config-provider>
            <a-table :columns="columns" :data-source="courseList"
            :pagination="
              totalCount > 10? {
                    hideOnSinglePage: false,
                    showSizeChanger:true,
                    total: totalCount, 
                    pageSize: searchInfo.limit,
                    current: searchInfo.page, 
                    onChange: onChange,
                    onShowSizeChange: onShowSizeChange,
                  }
                : false
              "
              :row-selection="{ selectedRowKeys: searchInfo.selectedRowKeys, onChange: onSelectChange,}"
              rowKey="id">
              <template #bodyCell="{ column,record }">
                 
              </template>
            </a-table>
            <template #renderEmpty>
              <div v-if="!loading"><Empty :type="EmptyType" /></div>
            </template>
          </a-config-provider>
        </a-spin>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="Visible"  title="修改成绩占比" class="setupVisible" :width="700">
    <a-form  :rules="rules" :model="formState" ref="formRef">
      <a-form-item label="实验成绩" name="content_score">
        <a-input v-model:value="formState.content_score" suffix="%"/>
      </a-form-item>+
      <a-form-item label="作业成绩" name="task_score">
        <a-input v-model:value="formState.task_score" suffix="%"/>
      </a-form-item>+
      <a-form-item label="考试成绩" name="exam_score">
        <a-input v-model:value="formState.exam_score" suffix="%"/>
      </a-form-item>
    </a-form>
    <template #footer>
      <Submit @submit="Save" @cancel="cancel"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import {validateNum} from "src/views/teacherModule/teacherExamination/utils"
import Submit from "src/components/submit/index.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { downloadUrl } from "src/utils/download";
const router = useRouter();
const route = useRoute();
const { courseId } = route.query;
const http = (request as any).teachCourse;
const SetupScore=()=>{
  Visible.value=true
  Object.assign(formState,scoreData)
}
const formRef = ref();
var Visible: Ref<boolean> = ref(false);
const formState=reactive<any>({
  content_score:'',
  task_score:'',
  exam_score:''
})
const rules = {
  content_score: [
    { required: true, message: `请输入实验成绩比例`, trigger: "blur" },
    {validator: validateNum.validator}
  ],
  task_score: [
    { required: true, message: `请输入作业成绩比例`, trigger: "blur" },
    {validator: validateNum.validator}
  ],
  exam_score: [
    { required: true, message: `请输入考试成绩比例`, trigger: "blur" },
    {validator: validateNum.validator}
  ],
}
const cancel=()=>{
  formRef.value.resetFields()
  Visible.value=false
}
const Save=()=>{
  let num=Number(formState.content_score)+Number(formState.task_score)+Number(formState.exam_score)
  if(num!==100){
    message.warning('权重总和需为100%')
    return
  }
  formRef.value.validate().then(()=>{ 
    // return
    // selectIds
    http.editWeight({param:{...formState},urlParams:{courseId:courseId}}).then((res: any)=>{
      message.success('操作成功')
      // formState.name=''
      getWeight()
      cancel()
    }).catch((err:any)=>{
      cancel()
    })
  })
}
// interface Props {
//   defaultConfig: any;
//   imageList:string
// }
// const props = withDefaults(defineProps<Props>(), {
//   defaultConfig: () => {},
//   imageList:'',
// });

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();
var searchInfo:any=reactive({
  user:'',
  class:'',
  name:'',
  page:1,
  limit:10,
  selectedRowKeys:[]
})
var loading: Ref<boolean> = ref(false);
var courseList: any[] = reactive([{order:1,id:1},{order:2,id:2}]);
var totalCount: Ref<number> = ref(0);
var rankObj:any=reactive({})
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.user == '' && searchInfo.class =='' && searchInfo.name == ''){
    str= 'tableEmpty'
  }else{
    str= 'tableSearchEmpty'
  }
  return str
})
const exportResults=()=>{
  let aLink=document.createElement('a')
  aLink.href=`/api/operate/teacherExports/exportCourse/${courseId}`
  aLink.download=""
  aLink.click()
  // const param:any={
  //   user:searchInfo.user,
  //   class:searchInfo.class,
  //   name:searchInfo.name,
  // }
  // http.exportCourseResult({param:{...param},urlParams:{courseId:courseId}}).then((res: any) => {
  //   // message.success("清除成功"); //
  //   // searchInfo.selectedRowKeys=[]
  //   // initData();
  // });
  // downloadUrl(url,activeCourse.name)
}
const searchList=()=> {
  searchInfo.page=1
  initData()
}
const onChange=(page: any, pageSize: any)=> {
  searchInfo.page=page
  searchInfo.limit=pageSize
  searchInfo.selectedRowKeys=[]
  initData()
}
const onShowSizeChange=(page:any,pageSize:any)=>{
  searchInfo.page=1
  searchInfo.limit=pageSize
  searchInfo.selectedRowKeys=[]
  initData()
}
const onSelectChange=(selectedRowKeys: any[], selectedRows: any[])=> {
  searchInfo.selectedRowKeys = selectedRowKeys; // 不去分别分页的弹窗已选ids
  console.log(searchInfo.selectedRowKeys);
  
  // state.selectedRows = selectedRows; // 弹窗当前页已选 list
}
const initData = () => {
  // return
  const param:any={
    user:searchInfo.user,
    class:searchInfo.class,
    name:searchInfo.name,
    page:searchInfo.page,
    limit:searchInfo.limit
    // ...searchInfo
  }
  loading.value = true;
  courseList.length = 0
  totalCount.value=0
  http.ViewResultsList({param:{...param},urlParams:{courseId:courseId}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page,rank }  = res.data
    list.map((v: any,k:number) => {
      v.order=`${k+1}`
      // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    Object.assign(rankObj,rank)
    courseList.push(...list)
    totalCount.value = page.totalCount
  }).catch((err:any)=>{
      loading.value = false
  })
};
const scoreData:any=reactive({})
const getWeight=()=>{
  http.getWeight({urlParams:{courseId:courseId}}).then((res: IBusinessResp) => {
    const {data}=res
    Object.assign(scoreData,data)  //formState
  }).catch((err:any)=>{
     
  })
}

onMounted(() => {
  initData()
  getWeight()
  // getWeight:TFHttpSend
  // editWeight:TFHttpSend
  // exportCourseResult:TFHttpSend
});
const columns= [
    {
      title: "序号",
      dataIndex: "order",
      align: "left",
      width:60,
      // ellipsis: true
    },
    {
      title: "学号",
      dataIndex: "username",
      align: "center"
    },
    {
      title: "姓名",
      dataIndex: "pname",
      align: "center"
    },
    {
      title: "班级",
      dataIndex: "classname",
      align: "center",
      width:160,
      ellipsis: true,
    },
    {
      title: "实验成绩",
      dataIndex: "content_score",
      align: "center"
    },
    {
      title: "作业成绩",
      dataIndex: "task_score",
      align: "center",
    },
    {
      title: "考试成绩",
      dataIndex: "exam_score",
      align: "center",
    },
    {
      title: "总成绩",
      dataIndex: "score",
      align: "center",
      ellipsis: true,
    },
  ]
</script>
<style scoped lang="less">
  .ViewResultsDetail{
    padding: 32px 40px;
    background-color: var(--white);
    .info{
      height: 78px;
      background: rgba(217,255,245,0.50);
      border-radius: 10px;
      color: var(--black-65);
      justify-content: space-between;
      padding-left: 24px;
      padding-right: 8px;
      .left{
        width: 50%;
        .item{
          img{
            width: 30px;
            margin-right: 16px;
          }
          margin-right: 60px;
        }
      }
      .right{
        .item1{
          .text1{
            font-weight: 400;
            color: var(--black-85);
            padding-bottom: 8px;
          }
          .text2{
            justify-content: space-between;
            span{
              color: var(--black-25);
            }
            .ant-btn{
              color: var(--brightBtn);
            }
          }
        }
      }
    }
    .search{
      justify-content: space-between;
      padding: 24px 0;
      .left{
        .item{
          display: flex;
          align-items: center;
          margin-right: 12px;
           width:270px;
          .ant-select,.ant-input{
            width: 220px;
          }
        }
      }
      .right{
        .ant-btn:nth-child(1){
          margin-right: 12px;
        }
      }
    }
  }
  .setupVisible{
    .ant-form-horizontal{
      display: flex;
      justify-content: space-between;
    }
    .ant-form-item{
      width: 190px;
    }
  }
</style>
