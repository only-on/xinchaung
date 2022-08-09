<template>
  <div class="ViewResultsDetail">
    <div class="info flexCenter">  
      <div class="left flexCenter">
        <div class="item flexCenter">
          <img src="../../../../assets/images/teacherCourse/5.png" alt=""/>
          <span>最高分：{{10}}</span>
        </div>
        <div class="item flexCenter">
          <img src="../../../../assets/images/teacherCourse/6.png" alt=""/>
          <span>最低分：{{20}}</span>
        </div>
        <div class="item flexCenter">
          <img src="../../../../assets/images/teacherCourse/7.png" alt=""/>
          <span>平均分：{{30}}</span>
        </div>
      </div>
      <div class="right flexCenter">
        <div class="item1">
          <div class="text1">总成绩 = 实验成绩80% + 作业成绩10% + 考试成绩10%</div>
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
            <a-input v-model:value="searchInfo.courseName" placeholder="请输入关键字搜索" @keyup.enter="searchList" />
          </div>
          <div class="item">
            <span>班级：</span>
            <a-input v-model:value="searchInfo.courseName" placeholder="请输入关键字搜索" @keyup.enter="searchList" />
          </div>
          <div class="item">
            <span>学号：</span>
            <a-input v-model:value="searchInfo.courseName" placeholder="请输入关键字搜索" @keyup.enter="searchList" />
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
      <a-form-item label="实验成绩" name="score">
        <a-input v-model:value="formState.score" suffix="%"/>
      </a-form-item>+
      <a-form-item label="作业成绩" name="score">
        <a-input v-model:value="formState.score" suffix="%"/>
      </a-form-item>+
      <a-form-item label="考试成绩" name="score">
        <a-input v-model:value="formState.score" suffix="%"/>
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
import Submit from "src/components/submit/index.vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { downloadUrl } from "src/utils/download";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teachCourse;
const SetupScore=()=>{
  Visible.value=true
}
const formRef = ref();
var Visible: Ref<boolean> = ref(false);
const formState=reactive<any>({
  score:''
})
const rules = {
  score: [
    { required: true, message: `请输入分数`, trigger: "blur" },
  ],
}
const cancel=()=>{
  Visible.value=false
}
const Save=()=>{
  formRef.value.validate().then(()=>{ 
    return
    // selectIds
      http.SetupScore({param:{chapter_name:formState.name},urlParams:{courseId:''}}).then((res: any)=>{
        message.success('操作成功')
        formState.name=''
        Visible.value=false
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
  courseName:'',
  courseAttribute:'',
  courseState:'',
  page:1,
  limit:10,
  selectedRowKeys:[]
})
var loading: Ref<boolean> = ref(false);
var courseList: any[] = reactive([{order:1,id:1},{order:2,id:2}]);
var totalCount: Ref<number> = ref(0);
var analysisObj:any=reactive({})
const EmptyType:any=computed(()=>{
  let str=''
  if(searchInfo.courseName == '' && searchInfo.courseAttribute =='' && searchInfo.courseState == ''){
    str= 'tableEmpty'
  }else{
    str= 'tableSearchEmpty'
  }
  return str
})
const exportResults=()=>{
  // http.CourseBatchClearScreen({param: {course_ids:searchInfo.selectedRowKeys}}).then((res: any) => {
  //   message.success("清除成功"); //
  //   searchInfo.selectedRowKeys=[]
  //   initData();
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
  return
  const param:any={
    // 'search[courseName]':searchInfo.courseName,
    // 'search[courseAttribute]':searchInfo.courseAttribute,
    // 'search[courseState]':searchInfo.courseState,
    page:searchInfo.page,
    limit:searchInfo.limit
  }
  loading.value = true;
  courseList.length = 0
  totalCount.value=0
  http.courselist({param:{...param}}).then((res: IBusinessResp) => {
    loading.value = false
    if (!res) return
    const { list, page,analysis }  = res.data
    list.forEach((v: any) => {
      // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
    });
    Object.assign(analysisObj,analysis)
    courseList.push(...list)
    totalCount.value = page.totalCount
  }).catch((err:any)=>{
      loading.value = false
  })
};

onMounted(() => {
  initData()
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
      dataIndex: "courseAttribute",
      align: "center"
    },
    {
      title: "班级",
      dataIndex: "courseGroup",
      align: "center",
      width:160,
      ellipsis: true,
    },
    {
      title: "实验成绩",
      dataIndex: "courseState",
      align: "center"
    },
    {
      title: "作业成绩",
      dataIndex: "contentsCount",
      align: "center",
    },
    {
      title: "考试成绩",
      dataIndex: "classesCount",
      align: "center",
    },
    {
      title: "总成绩",
      dataIndex: "recordSize",
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
