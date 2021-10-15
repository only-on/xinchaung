<template>
  <div v-layout-bg class="CreatedExamination">
    <div class="leftBox">
      <a-form :ref="formRef" :model="formState" :label-col="{span:6}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
        <a-form-item label="考试名称"  name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="考试试卷"  name="paper_id">{{formState.paper_id}}
          <a-select v-model:value="formState.paper_id" placeholder="请选择试卷" :options="options" @change="change" />
        </a-form-item>
        <div class="duration">
          <a-form-item label="考试开始时间"  name="started_at" :label-col="{span:8}" :wrapper-col="{span:20}">
            <a-date-picker v-model:value="formState.started_at" :showTime="true" :disabled-date="disabledDate" valueFormat="YYYY-MM-DD HH:mm:ss"  format="YYYY-MM-DD HH:mm:ss" />
          </a-form-item>
          <a-form-item label="考试时长"  name="hour_long" :label-col="{span:6}" :wrapper-col="{span:16}">
            <a-input v-model:value="formState.hour_long" />
            <div class="durationNotes">分钟</div>
          </a-form-item>
        </div>
        <a-form-item label="通过分数比例"  name="pass_rate" :label-col="{span:6}" :wrapper-col="{span:20}" class="proportion">
          <a-input v-model:value="formState.pass_rate" suffix="%" />
          <div class="notes">注：此分数为百分比分数</div>
        </a-form-item>
        <a-form-item label="考试公告" name="note">
          <InputTextArea v-model:value="formState.note" />
         </a-form-item>
      </a-form>
    </div>
    <div class="rightBox">
      <div class="calendarBox">
        <a-calendar v-model:value="formState.data" @select="onPanelChange" :fullscreen="false" >
          <!-- <template #headerRender="{ value, type, onChange, onTypeChange }"></template> -->
        </a-calendar>
        <div class="title">考试预约情况</div>
      </div>
      <div class="subscribe">
        <div class="calendar-content">
          <div class="calendar-content-box" v-for="v in 5" :key="v">
            <div class="calendar-content-icon">
              <img src="src/assets/images/teacherExam/calendar-eaxm.png" />
            </div>
            <div class="calendar-content-text">
              <div class="calendar-content-up">
                <span>10:50 -11:50</span><span>教师sihaifu</span>
              </div>
              <div>考试说明</div>
            </div>
          </div>
        </div>
        <!-- <empty type="tableEmpty" :height="100" text="暂无人预约考试" /> -->
      </div>
    </div>
  </div>
  <div class="information">
    <div class="item">
      <a-button type="primary" @click="select()">{{`选择${information===1?'班级':'学生'}`}}</a-button>
      <a-button class="btn2" type="primary" @click="remove()">批量移除</a-button>
    </div>
    <div>
    <a-radio-group v-model:value="information">
      <a-radio :value="1">班级信息</a-radio>
      <a-radio :value="2">学生信息</a-radio>
    </a-radio-group>
  </div>
  </div>
  <!-- <a-config-provider :renderEmpty="customizeRenderEmpty"> -->
    <a-table :columns="columns" :loading="loading" :data-source="selectList" :bordered="true"  row-key="id"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :pagination="{pageSize:pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
      :locale="locale"
      class="components-table-demo-nested">
      <template #operation="{record}">
          <a  class="caozuo" @click="delateCard(record )" v-if="record.can_delete">移除</a>
        </template>
    </a-table>
  <!-- </a-config-provider> -->
  <div class="footer">
    <a-button type="primary" @click="cancel()"> 取 消 </a-button>
    <a-button type="primary" @click="sunmit()"> 确 定 </a-button>
  </div>
  <a-modal v-model:visible="visible" :title="`${information===1?'班级':'学生'}选择`" @ok="handleReply" :width="1080" class="modal-post">
    <div class="header">
      <div class="search">
        <div class="item custom_input item1" v-if="information===1">
          <a-input v-model:value="studentForum.name" placeholder="请输入班级" />
        </div>
        <div class="item custom_input item1" v-if="information===2">
          <a-input v-model:value="studentForum.name" placeholder="请输入学号" />
        </div>
        <div class="item custom_input item2" v-if="information===2">
          <a-input v-model:value="studentForum.name" placeholder="请输入姓名" />
        </div>
        <div class="item custom_input item3" v-if="information===2">
          <a-input v-model:value="studentForum.name" placeholder="请输入院系" @search="getClassStudent" />
        </div>
      </div>
      <div>
        <a-button type="primary" @click="cancel()">添加</a-button>
        <a-button type="primary" @click="cancel()">清空</a-button>
        <a-button type="primary" @click="getClassStudent()">查询</a-button>
      </div>
    </div>
      <!-- <a-config-provider :renderEmpty="studentRenderEmpty"> -->
        <a-table :columns="information===1?selectClassColums:selectStudentColumns" :loading="loading" :data-source="studentList" :bordered="true"  row-key="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :pagination="{pageSize:pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true,showSizeChanger:true}" 
          :locale="studentLocale"
          class="components-table-demo-nested">
        </a-table>
      <!-- </a-config-provider> -->
      <template #footer>
        <span></span>
        <!-- <a-button @click="handleReply" type="primary">提交</a-button> -->
      </template>
    </a-modal>
</template>
<script lang="tsx">
import { SelectTypes } from 'ant-design-vue/es/select';
import { defineComponent,ref,VNode, onMounted,reactive,Ref,inject, computed,toRefs } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { Modal,message } from 'ant-design-vue';
import { Input } from 'ant-design-vue'
import { ColumnProps } from 'ant-design-vue/es/table/interface';
import moment, { Moment } from 'moment';
interface IformState{
  name:string;
  paper_id:number | undefined;
  started_at:'';
  hour_long:number | undefined;
  pass_rate:number | undefined;
  note:string;
  data:Moment
}
interface Istate{
  formRef:any;
  formState:IformState;
  class_ids:number[];
  student_ids:number[];
  onPanelChange:(value: Moment,mode: string) => void;
  rules:any;
  select: () => void;
  remove: () => void;
  onChangePage: (v:number) => void;
  information:number;
  total:number;
  loading:boolean;
  pageSize:number;
  page:number;
  selectList:any[];
  selectedRowKeys:Key[];
  onSelectChange: (v:Key[]) => void;
  delateCard: (v:any) => void;
  sunmit: () => void;
  cancel: () => void;
  visible:boolean;
  handleReply: () => void;
  studentForum:any;
  getClassStudent: () => void;
  studentList:any[];

  change: (val:any) => void;
}
type Key = ColumnProps['key'];
const columns=[
  {
    title: '学号',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
  {
    title: '姓名',
    dataIndex:"title",
    align:'center',
    // width:260,
  },
  {
    title: '院系',
    dataIndex:"title",
    align:'center',
    // width:260,
  },
  {
    title: '班级',
    dataIndex:"title",
    align:'center',
    // width:260,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align:'center',
    slots: { customRender: 'operation' },
    fixed:'right',
    // width:200
  }
]
const selectStudentColumns=[
  {
    title: '学号',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
  {
    title: '姓名',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
  {
    title: '所属院系',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
  {
    title: '年级',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
  {
    title: '邮箱',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
  {
    title: '电话',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
]
const selectClassColums=[
  {
    title: '班级名称',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
  {
    title: '人数',
    dataIndex:"title",
    align:'center',
    // width:460,
  },
]
export default defineComponent({
  name: '',
  components: {
    InputTextArea: Input.TextArea
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const {editId}= route.query
    var options =ref<SelectTypes['options']>([])
    var totalCount:Ref<number> =ref(0)
    var loading:Ref<boolean> =ref(false)
    // const visible = ref<boolean>(false);
    const totalScore = ref<number>(0);
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside',backOff:true})
    const http=(request as any).teacherExam
    const state:Istate=reactive({
          formRef:'formRef',
          formState:{
            name:'',
            paper_id: undefined,
            started_at:'',
            hour_long:undefined,
            pass_rate:undefined,
            note:'',
            data:moment()
          },
          change:(val:any)=>{
            console.log(typeof val);
            console.log(state.formState.paper_id);
          },
          class_ids:[],
          student_ids:[],
          onPanelChange:(val: Moment,mode: string)=>{
            console.log(val);
          },
          rules:{
            name: [{ required: true, message: '请输入试卷名称', trigger: 'blur'},],
            paper_id:[{ required: true, message: '请选择考试试卷', trigger: 'change'}],
            started_at:[{ required: true, message: '请选择考试开始时间', trigger: 'change'}],
            hour_long: [{ required: true, message: '请输入考试时长', trigger: 'blur' },{pattern: /^(([0-9]|[1-9][0-9]|1[0-7][0-9])(\.[0-9]+)?|180)$/, message: "考试时长0-180", trigger: "blur"}],
            pass_rate: [{ required: true, message: '请输入通过分数比例', trigger: 'blur' },{ pattern: /^([0-9]{1,2}|100)$/, message: "通过分数比例0-100", trigger: "blur" }],
            description: [{ required: true, message: '请输入试卷描述类型', trigger: 'blur' }],
          },
          select:async ()=>{
            state.visible=true
            let res=await state.getClassStudent()
            let methed=state.information===1?'getClass':'getStudent'
            http[methed]().then((res:any)=>{

            })
          },
          remove:()=>{},
          information:1,
          loading:false,
          total:0,
          pageSize:10,
          page:1,
          selectList:[],
          onChangePage:(val:number)=>{
            state.page=val
            
            // initData()   
          },
          selectedRowKeys:[],
          onSelectChange:(selectedRowKeys:Key[])=>{
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            state.selectedRowKeys = selectedRowKeys;
          },
          delateCard:(val:any)=>{},
          cancel:()=>{router.go(-1)},
          sunmit:()=>{
            console.log(state.formState)
            // CreatedExamination
            state.formRef.validate().then(()=>{
              
            })
          },
          visible:false,
          handleReply:()=>{},
          studentForum:{},
          getClassStudent:()=>{},
          studentList:[],

    })
    const locale={
      emptyText:<empty type={'tableEmpty'} height={200} text={'亲~这里什么都没有~'} />
    }
    const studentLocale={
      emptyText:<empty type={'tableEmpty'} text={'亲~这里什么都没有~'} />
    }
    function getExaminationDetail(){
      http.getExaminationDetail({urlParams: {exam_id: editId}}).then((res:IBusinessResp)=>{

      })
    }
   function getTestPaperList(){
      // interface IOptions{
      //   value:number,
      //   label:string,
      // }
      http.getTestPaperList({param:{limit:999}}).then((res:IBusinessResp)=>{
        let data=res.data.list
        data.length?data.forEach((v:any)=> {
          let obj={value: v.id, label: v.name}
          // @ts-ignore
          options.value.push(obj)
        }):'';
      })
    }
    const disabledDate = (current: Moment) => {
      // Can not select days before today and today
      return current && current < moment().startOf('day');
    };
    onMounted(()=>{
      // console.log(editId);
      getTestPaperList()
      editId?getExaminationDetail():''
    })
    return {...toRefs(state),columns,selectStudentColumns,selectClassColums,locale,studentLocale,moment,disabledDate,options}
  },
})
</script>
<style  scoped lang="less">
.CreatedExamination{
  display: flex;
  justify-content: space-between;
  .leftBox{
    width: 56%;
    :deep(.ant-form-item-control){
      flex: 0 0 100%;
    }
    :deep(.ant-form-item){
      flex-direction: column;
    }
    :deep(textarea.ant-input){
      min-height: 160px;
    }
    :deep(.ant-form-item-control-input-content){
        display: flex;
        align-items: center;
      }
    .proportion{
     .notes{
        width: 280px;
        padding-left: 8px;
      }
    }
    .duration{
      display: flex;
      justify-content: space-between;
      align-items: center;
      :deep(.ant-form-item){
        width: 50%;
      }
      .durationNotes{
          width: 60px;
          padding-left: 8px;
      }
      :deep(.ant-calendar-time-picker-select){
        overflow-y: auto;
      }
    }
  }
  .rightBox{
    width: 500px;
    // flex-grow: 1;
    // height: 400px;
    // border: 1px solid red;
    .calendarBox{
      position: relative;
      width: 100%;
      height: 380px;
      overflow: auto;
      background: url(src/assets/images/teacherExam/calendar.png.png) no-repeat;
      background-size: 100% 100%;
      .title{
        position: absolute;
        left: 20px;
        top: 9px;
        color: #fff;
        font-size: 18px;
      }
      :deep(.ant-fullcalendar-header .ant-radio-group){
        display: none;
      }
      :deep(.ant-fullcalendar-column-header){
        color: #fff;
      }
      :deep(.ant-fullcalendar-value){
        color: #fff;
      }
      :deep(.ant-fullcalendar-value){
        color: #fff;
      }
      :deep(.ant-fullcalendar-value:hover){
        color: #28dcb4;
        // background: #f5f5f5;
        // color:  #6ac5ec; 
        color: @theme-color;
        cursor: pointer;
        // border: 2px solid #fac439;
      }
    }
    .subscribe{
      height: 190px;
      // border: 1px solid red;
      padding-top: 20px;
      // overflow: auto;
      border: 1px solid #E3E3E3;
      .calendar-content{
        overflow-y: auto;
        height: 100%;
        margin: auto 10px auto 50px;
        padding: 10px 0 20px 0;
        .calendar-content-box{
          display: flex;
          height: 45px;
          margin-bottom: 10px;
          .calendar-content-text{
            margin-left: 5px;
            width: calc(100% - 60px);
            .calendar-content-up{
              display: inline-flex;
              align-items: center;
               span:first-child {
                  border: 1px solid #999;
                  padding: 0px 20px;
                  border-radius: 20px;
                  margin-right: 10px;
              }
              span:last-child{
                width: 200px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .calendar-content-down{
              margin-top: 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
:deep(.ant-calendar-time-picker-select){
        overflow-y: auto;
      }
.information{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .item{
    .btn2{
      margin-left: 15px;
    }
  }
}
.footer{
  text-align: center;
  margin-top: 50px;
  .ant-btn-primary{
    margin: 0 16px;
  }
}
.modal-post{
  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ant-btn-primary{
      margin-right: 16px;
    }
    .search{
      display: flex;
      align-items: center;
      .item{
          display: flex;
          align-items: center;
          margin-right: 22px;
          :deep(.ant-input){
              padding-left: 28px;
          }
      }
      .custom_input{
          position: relative;
          &::before{
              content: '';
              position: absolute;
              left:8px;
              top:10px;
              // background: url(src/assets/images/screenicon/Group6.png) no-repeat;
              width: 16px;
              height: 16px;
              z-index: 10;
          }
      }
      .item1{
        &::before{
          background: url(src/assets/images/screenicon/Group7.png) no-repeat;
        }
      }
      .item2{
        &::before{
          background: url(src/assets/images/screenicon/Group6.png) no-repeat;
        }
      }
      .item3{
        &::before{
          background: url(src/assets/images/screenicon/Group8.png) no-repeat;
        }
      }
    }
  }
}
</style>