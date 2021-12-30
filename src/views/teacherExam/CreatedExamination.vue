<template>
  <div v-layout-bg class="CreatedExamination">
    <div class="leftBox">
      <a-form ref="formRef" :model="formState" :label-col="{span:6}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
        <a-form-item label="考试名称"  name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="考试试卷"  name="paper_id">
          <a-select v-model:value="formState.paper_id" placeholder="请选择试卷" :options="options" />
        </a-form-item>
        <div class="duration">
          <a-form-item label="考试开始时间"  name="started_at" :label-col="{span:8}" :wrapper-col="{span:20}">
            <a-date-picker v-model:value="formState.started_at" @blur="dateOk" @ok="dateOk" :show-time="{defaultValue: moment('00:00', 'HH:mm:ss'),minuteStep:1,secondStep:1 }" :disabled-date="disabledDate" :disabled-time="disabledDateTime"  valueFormat="YYYY-MM-DD HH:mm:ss"  format="YYYY-MM-DD HH:mm:ss" />
          </a-form-item>
          <a-form-item label="考试时长"  name="hour_long" :label-col="{span:6}" :wrapper-col="{span:16}">
            <a-input v-model:value="formState.hour_long" @blur="hourLongChange()" />
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
        <a-calendar v-model:value="formState.date" @select="onPanelChange" :fullscreen="false" valueFormat="YYYY-MM-DD"  format="YYYY-MM-DD">
          
        </a-calendar>
        <div class="title">考试预约情况</div>
      </div>
      <div class="subscribe">
        <div class="calendar-content" v-if="appointmentList.length">
          <div class="calendar-content-box" v-for="v in appointmentList" :key="v.id">
            <div class="calendar-content-icon">
              <img src="src/assets/images/teacherExam/calendar-eaxm.png" />
            </div>
            <div class="calendar-content-text">
              <div class="calendar-content-up">
                <span>{{v.times}}</span><span>{{v.author_name}}</span>
              </div>
              <div class="calendar-content-down">{{v.note}}</div>
            </div>
          </div>
        </div>
        <empty type="tableEmpty" v-else :height="100" text="暂无人预约考试" />
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
    <a-table :columns="information===1?ClassColums:StudentColumns" :data-source="information===1?classAllRowKeys:studentAllRowKeys" :bordered="true"  row-key="id"
      :row-selection="{ selectedRowKeys: AllselectedRowKeys,onChange:alreadyChange}"
      :locale="locale"
      class="components-table-demo-nested">
      <template #operation="{record}">
        <a v-if="information===1"  class="caozuo" @click="CardDetaile(record.id)">详情</a>
        <a  class="caozuo" @click="delateCard(record.id)">移除</a>
      </template>
    </a-table>
  <!-- </a-config-provider> -->
  <div class="footer">
    <a-button type="primary" @click="cancel()"> 取 消 </a-button>
    <a-button type="primary" @click="submit()"> 确 定 </a-button>
  </div>
  <a-modal v-model:visible="visible" :title="`${information=== 1 ?'班级':'学生'}选择`" @cancel="cancelModal" :width="1080" class="modal-post">
    <div class="header">
      <div class="search">
        <div class="item custom_input item4" v-if="information===1">
          <a-input v-model:value="searchClassStudent.classname" placeholder="请输入班级" />
        </div>
        <div class="item custom_input item1" v-if="information===2">
          <a-input v-model:value="searchClassStudent.username" placeholder="请输入学号" />
        </div>
        <div class="item custom_input item2" v-if="information===2">
          <a-input v-model:value="searchClassStudent.name" placeholder="请输入姓名" />
        </div>
        <div class="item custom_input item3" v-if="information===2">
          <a-input v-model:value="searchClassStudent.department" placeholder="请输入院系" @search="getClassStudent" />
        </div>
      </div>
      <div>
        <a-button type="primary" @click="addSelect()">添加</a-button>
        <a-button type="primary" @click="studentQuery()">查询</a-button>
        <a-button type="primary" @click="clearFilter()">清空</a-button>
      </div>
    </div>
    <div class="tableBox">
      <a-spin :spinning="loading" size="large" tip="Loading...">
        <a-table :columns="information===1?selectClassColums:selectStudentColumns"  :data-source="studentList" :bordered="true"  row-key="id"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :pagination="{current:searchClassStudent.page,pageSize:searchClassStudent.limit,total:searchClassStudent.total,onChange:onChangePage,hideOnSinglePage:(searchClassStudent.total<10?true:false),showSizeChanger:true,onShowSizeChange:showSizeChange}" 
            :locale="studentLocale"
            class="components-table-demo-nested">
        </a-table>
      </a-spin>
    </div>
    <template #footer>
      <span></span>
      <!-- <a-button @click="handleReply" type="primary">提交</a-button> -->
    </template>
  </a-modal>
  <a-modal v-model:visible="classDetailsVisible" title="班级信息" @cancel="cancelModal" :width="1080" class="modal-post">
    <div class="header headerLeft">
      <div class="search">
        <div class="item custom_input item1">
          <a-input-search v-model:value="searchClassDetails.name" placeholder="请输入学号查询" @search="ClassDetailsQuery" />
        </div>
      </div>
      <div>
        <a-button type="primary" @click="ClassDetailsQuery">查询</a-button>
      </div>
    </div>
    <div class="tableBox">
      <a-spin :spinning="classDetailsLoading" size="large" tip="Loading...">
        <a-table :columns="classDetailsColumns" :loading="loading" :data-source="classDetailsList" :bordered="true"  row-key="id"
            :pagination="{current:searchClassDetails.page,pageSize:searchClassDetails.limit,total:searchClassDetails.total,hideOnSinglePage:true,showSizeChanger:true,onChange:ClassDetailsOnChangePage,onShowSizeChange:ClassDetailsShowSizeChange}" 
            :locale="studentLocale"
            class="components-table-demo-nested">
            <template #operation="{record}">
              <a  class="caozuo" @click="initialization(record.id)">初始化密码</a>
            </template>
        </a-table>
      </a-spin>
    </div>
    <template #footer>
      <span></span>
    </template>
  </a-modal>
</template>
<script lang="tsx">
import { SelectTypes } from 'ant-design-vue/es/select';
import { defineComponent,ref, onMounted,reactive,Ref,inject, computed,toRefs,watch } from 'vue'
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
  hour_long:string | '';
  pass_rate:string | '';
  note:string;
  date?:Moment
}
interface Istate{
  formRef:any;
  formState:IformState;
  send_ids:number[];
  onPanelChange:(value: Moment,mode: string) => void;
  rules:any;
  select: () => void;
  remove: () => void;
  onChangePage: (v:number) => void;
  showSizeChange: (current:number,pageSize:number) => void;
  ClassDetailsOnChangePage: (v:number) => void;
  ClassDetailsShowSizeChange: (current:number,pageSize:number) => void;
  clearSearch: () => void;
  information:number;
  currentinformation:number;
  loading:boolean;
  classDetailsLoading:boolean;
  AllselectedRowKeys:Key[];
  studentAllRowKeys:Key[];
  classAllRowKeys:Key[];
  selectedRowKeys:Key[];
  selectedRows:Key[];
  onSelectChange: (v:Key[],selectedRows:Key[]) => void;
  alreadyChange: (v:Key[],selectedRows:Key[]) => void;
  delateCard: (v:any) => void;
  CardDetaile: (v:any) => void;
  initialization: (v:any) => void;
  submit: () => void;
  cancel: () => void;
  cancelModal: () => void;
  clearFilter: () => void;
  addSelect: () => void;
  visible:boolean;
  classDetailsVisible:boolean;
  getClassStudent: () => void;
  getClassDetaileList: () => void;
  searchClassStudent:any;
  searchClassDetails:any;
  studentList:any[];
  classDetailsList:any[];
  appointment: () => void;
  appointmentList:any[];
  studentQuery: () => void;
  ClassDetailsQuery: () => void;
  examsDateTesting: () => void;
  dateOk: (v:any) => void;
  hourLongChange: () => void;
  verificationDate:boolean;
}
type Key = ColumnProps['key'];
const StudentColumns=[
  {
    title: '学号',
    dataIndex:"username",
    align:'center',
    // width:460,
  },
  {
    title: '姓名',
    dataIndex:"name",
    align:'center',
    // width:260,
  },
  {
    title: '院系',
    dataIndex:"department",
    align:'center',
    // width:260,
  },
  {
    title: '班级',
    dataIndex:"grade",
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
const ClassColums=[
  {
    title: '班级名称',
    dataIndex:"classname",
    align:'center',
    // width:460,
  },
  {
    title: '人数',
    dataIndex:"stu_number",
    align:'center',
    // width:460,
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
    dataIndex:"username",
    align:'center',
    // width:460,
  },
  {
    title: '姓名',
    dataIndex:"name",
    align:'center',
    // width:460,
  },
  {
    title: '所属院系',
    dataIndex:"department",
    align:'center',
    // width:460,
  },
  {
    title: '年级',
    dataIndex:"grade",
    align:'center',
    // width:460,
  },
  {
    title: '邮箱',
    dataIndex:"email",
    align:'center',
    // width:460,
  },
  {
    title: '电话',
    dataIndex:"phone",
    align:'center',
    // width:460,
  },
]
const selectClassColums=[
  {
    title: '班级名称',
    dataIndex:"classname",
    align:'center',
    // width:460,
  },
  {
    title: '人数',
    dataIndex:"stu_number",
    align:'center',
    // width:460,
  },
]
const classDetailsColumns=[
  {
    title: '学号',
    dataIndex:"username",
    align:'center',
    // width:460,
  },
  {
    title: '姓名',
    dataIndex:"name",
    align:'center',
    // width:260,
  },
  {
    title: '性别',
    dataIndex:"gender",
    align:'center',
    // width:260,
  },
  {
    title: '院系',
    dataIndex:"department",
    align:'center',
    // width:260,
  },
  {
    title: '班级',
    dataIndex:"grade",
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
    // var loading:Ref<boolean> =ref(false)
    // const visible = ref<boolean>(false);
    const totalScore = ref<number>(0);
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside',backOff:true})
    const http=(request as any).teacherExam
    let paper_idValidator=async  (rule:any, value:any, callback:any)=>{
      console.log(rule, value, callback)
      callback("121212")
    }
    const state:Istate=reactive({
          formRef:'formRef',
          formState:{
            name:'',
            paper_id: undefined,
            started_at:'',
            hour_long:'',
            pass_rate:'',
            note:'',
            date:moment()
          },
          send_ids:[],        //  创建页已选的list   ids
          onPanelChange:(val: Moment,mode: string)=>{
            // console.log(val);
            state.appointment()
          },
          rules:{
            name: [{ required: true, message: '请输入试卷名称', trigger: 'blur'},],
            paper_id:[{ required: true, message: '请选择考试试卷'}],
            started_at:[{ required: true, message: '请选择考试开始时间', trigger: 'change'}],
            hour_long: [{ required: true, message: '请输入考试时长', trigger: 'blur' },{pattern: /^(([0-9]|[1-9][0-9]|1[0-7][0-9])(\.[0-9]+)?|180)$/, message: "考试时长0-180", trigger: "blur"}],
            pass_rate: [{ required: true, message: '请输入通过分数比例', trigger: 'blur' },{ pattern: /^([0-9]{1,2}|100)$/, message: "通过分数比例0-100", trigger: "blur" }],
            description: [{ required: true, message: '请输入试卷描述类型', trigger: 'blur' }],
          },
          remove:()=>{},
          information:1,
          currentinformation:1,
          loading:false,
          classDetailsLoading:false,
           // 添加选择的学生或班级
          addSelect:()=>{
            if(state.selectedRows.length===0){
              return
            }
            if(state.currentinformation!==state.information){
              state.currentinformation=state.information
              // state.information===1?state.classAllRowKeys=[]:state.studentAllRowKeys=[]
              state.classAllRowKeys=[]
              state.studentAllRowKeys=[]
              state.send_ids=[]
            }
            
            state.selectedRows.forEach((v:any)=>{
              let AllRowKeys=state.information===1?state.classAllRowKeys:state.studentAllRowKeys
              let repeat =AllRowKeys.filter((i:any)=>{return i.id === v.id})
              // console.log(repeat)
              if(repeat.length===0){
                state.information===1?state.classAllRowKeys.push(v):state.studentAllRowKeys.push(v)
                state.send_ids.push(v.id)
              }
              //  console.log('classAllRowKeys: ', state.classAllRowKeys);
              // console.log('studentAllRowKeys: ', state.studentAllRowKeys);
            })
          },
          selectedRows:[],           //    弹窗当前页全部已选  list
          selectedRowKeys:[],         //   弹窗 当前页全部已勾选 ids
          studentAllRowKeys:[],          //  创建页展示 list
          classAllRowKeys:[],              //  创建页展示 list
          AllselectedRowKeys:[],       // 创建页 准备批量操作的已选项 ids
          // 创建页面已选的list
          alreadyChange:(selectedRowKeys:Key[],selectedRows:Key[])=>{
             // console.log('RowKeys changed: ', selectedRowKeys);
            // console.log('selectedRowKeys: ', selectedRowKeys);
            state.AllselectedRowKeys = selectedRowKeys;
          },
          //  弹窗内列表选择
          onSelectChange:(selectedRowKeys:Key[],selectedRows:Key[])=>{        // 记录当前页码已选择的总数
            // console.log('RowKeys changed: ', selectedRowKeys);
            // console.log('selectedRows: ', selectedRows);
            state.selectedRowKeys = selectedRowKeys;         // 不去分别分页的弹窗已选ids
            state.selectedRows = selectedRows;               // 弹窗当前页已选 list
          },
          delateCard:(val:any)=>{
            let n=state.send_ids.indexOf(val)
            state.information===1?state.classAllRowKeys.splice(n,1):state.studentAllRowKeys.splice(n,1)
            state.send_ids.splice(n,1)
            state.selectedRowKeys.splice(n,1)
            // console.log(state.selectedRowKeys,state.send_ids)
            // console.log(state.studentAllRowKeys)
          },
          CardDetaile:(val:any)=>{
            state.searchClassDetails.class_id=val
            // state.classDetailsVisible=true   
            state.getClassDetaileList()
          },
          initialization:(val:any)=>{
            http.initialization({param:{user_id:val}}).then((res:IBusinessResp)=>{
              message.success('操作成功')
            })
          },
          cancel:()=>{router.go(-1)},
          cancelModal:()=>{
            state.visible=false
          },
          submit:()=>{
            // date:moment(state.formState.date).format('YYYY-MM-DD')
            // delete state.formState.date
            var name=state.information===1?'class_ids':'student_ids'
            let obj={
              ...state.formState,
            }
            obj[name]=state.send_ids
            // console.log(obj)
            state.formRef.validate().then(()=>{
              // state.examsDateTesting()
              if(state.verificationDate === false){
                message.warn(`请选择合理的考试开始时间`)
                return
              }
              if(obj[name].length===0){
                message.warn(`请选择${state.information===1?'班级':'学生'}`)
                return
              }
              if(editId){
                http.editSubmit({urlParams: {editId: editId},param:{...obj}}).then((res:IBusinessResp)=>{
                  message.success('修改成功')
                  router.go(-1)
                })
              }else{
                http.submit({param:{...obj}}).then((res:IBusinessResp)=>{
                  message.success('创建成功')
                  router.go(-1)
                })
              }
            })
          },
          appointment:()=>{
            let date=moment(state.formState.date).format('YYYY-MM-DD')
            http.appointment({param:{booking_date:date}}).then((res:IBusinessResp)=>{
              state.appointmentList=res.data
            })
          },
          appointmentList:[],
          visible:false,
          classDetailsVisible:false,
          searchClassStudent:{
            total:0,
            limit:10,
            page:1,
            name:'',
            username:'',
            department:'',
            classname:'',
          },
          searchClassDetails:{
            total:0,
            limit:10,
            page:1,
            name:'',
            class_id:''
          },
          showSizeChange:(current:number,pageSize:number)=>{
            console.log(current,pageSize)
            state.searchClassStudent.page=1
            state.searchClassStudent.limit=pageSize
            state.getClassStudent()
          },
          onChangePage:(val:number)=>{
            state.searchClassStudent.page=val
            state.selectedRowKeys=[...state.send_ids]
            state.getClassStudent()
            // console.log(state.selectedRowKeys,state.send_ids)
          },
          ClassDetailsShowSizeChange:(current:number,pageSize:number)=>{
            console.log(current,pageSize)
            state.searchClassDetails.page=1
            state.searchClassDetails.limit=pageSize
            state.getClassDetaileList()
          },
          ClassDetailsOnChangePage:(val:number)=>{
            state.searchClassDetails.page=val
            state.getClassDetaileList()
            // initData()   
          },
          studentQuery:()=>{
            state.searchClassStudent.page=1
            state.getClassStudent()
          },
          ClassDetailsQuery:()=>{
            state.searchClassDetails.page=1
            state.getClassDetaileList()
          },
          //  打开班级学生弹窗
          select:async ()=>{
            if(state.currentinformation!==state.information){
              state.selectedRowKeys = []
              state.selectedRows = []
            }
            state.visible=true
            state.clearSearch()
            state.getClassStudent()
          },
          //  班级学生选择框清楚筛选项
          clearFilter:()=>{
            state.clearSearch()
            state.getClassStudent()
          },
          studentList:[],
          //  获取班级 或学生列表
          getClassStudent:()=>{
            state.visible=true     // state.studentList
            state.loading=true
            state.studentList.length=0
            // state.visible=true
            let methed=state.information===1?'getClass':'getStudent'
            http[methed]({param:{...state.searchClassStudent}}).then((res:IBusinessResp)=>{
              state.loading=false
              state.studentList=res.data.list
              state.searchClassStudent.total=res.data.page.totalCount
            })
          },
          classDetailsList:[],
          //  获取班级  详情·列表
          getClassDetaileList:()=>{
            state.classDetailsVisible=true   
            state.classDetailsLoading=true
            state.classDetailsList.length=0
            http.getClassDetaileList({param:{...state.searchClassDetails}}).then((res:IBusinessResp)=>{
              state.classDetailsLoading=false
              state.classDetailsList=res.data.list
              state.searchClassDetails.total=res.data.page.totalCount
            })
          },
          //  清楚班级  、学生选择框的筛选项
          clearSearch:()=>{
            state.searchClassStudent={
              total:0,
              limit:10,
              page:1,
              name:'',
              username:'',
              department:'',
              classname:'',
            }
          },
          verificationDate:false,      //  考试开始时间合理性验证
          examsDateTesting:async ()=>{
            let obj={
              exam_id:editId?editId:'',
              started_at:state.formState.started_at,
              hour_long:state.formState.hour_long
            }
            state.verificationDate=false
            await http.examsDateTesting({param:{...obj}}).then((res:IBusinessResp)=>{
              state.verificationDate=true
              // console.log(state.verificationDate)
            })
          },
          dateOk:(val:any)=>{
            // console.log(val)
            if(state.formState.started_at!==''){
              state.examsDateTesting()
            }
          },
          // 检查考试时间是否冲突
          hourLongChange:()=>{
            // console.log(state.formState.hour_long)
            if(state.formState.started_at){
               state.examsDateTesting()
            }else{
              message.warn('请先选择考试开始时间')
            }
           
          },
    })
    const locale={
      emptyText:<empty type={'tableEmpty'} height={200} text={'亲~这里什么都没有~'} />
    }
    const studentLocale={
      emptyText:<empty type={'tableEmpty'} text={'亲~这里什么都没有~'} />
    }
    function getExaminationDetail(){
      http.getExaminationDetail({urlParams: {exam_id: editId}}).then((res:IBusinessResp)=>{
          let data=res.data
          state.formState={
            name:data.name,
            paper_id: data.paper_id,
            started_at:data.started_at,
            hour_long:String(data.hour_long),
            pass_rate:String(data.pass_rate),
            note:data.note,
            date:moment()
          }
          if(data.class_ids && data.class_ids.length){
            state.currentinformation=1
            state.information=1
            state.classAllRowKeys=[...data.classes_info]  
            state.send_ids=[...data.class_ids]
            state.selectedRowKeys=[...data.class_ids]
          }else{
            state.currentinformation=2
            state.information=2
            state.studentAllRowKeys=[...data.students_info]  
            state.send_ids=[...data.student_ids]
            state.selectedRowKeys=[...data.student_ids]
          }
        // console.log(state.formState)
      })
    }
    function getTestPaperList(){
      http.getTestPaperList({param:{limit:999}}).then((res:IBusinessResp)=>{
        if(res && res.data){
          let data=res.data.list
          data.length?data.forEach((v:any)=> {
            let obj={value: v.id, label: v.name}
            // @ts-ignore
            options.value.push(obj)
          }):'';
        }
      })
    }
    const disabledDate = (current: Moment) => {
      // Can not select days before today and today
      return current && current < moment().startOf('day');
    };
    const disabledDateTime=()=>{
      // :disabled-time="disabledDateTime"
      const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      };
      let date=moment().toObject()
      // console.log(state.formState.started_at)
      return {
        // disabledHours: () => range(0, 24).splice(0,date.hours),
        // disabledMinutes: () => range(0,date.minutes),
        // disabledHours: () => range(0, 24),
        // disabledMinutes: () => range(0,60),
        // disabledSeconds: () => range(0,60),
      };
    }
    onMounted(()=>{
      // console.log(moment().toObject())
      getTestPaperList()
      state.appointment()
      editId?getExaminationDetail():''
    })
    return {...toRefs(state),StudentColumns,ClassColums,selectStudentColumns,selectClassColums,locale,studentLocale,moment,disabledDate,disabledDateTime,options,classDetailsColumns}
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
      background: url(src/assets/images/teacherExam/calendar.png) no-repeat;
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
                width: 120px;
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
      .item4{
        &::before{
          background: url(src/assets/images/screenicon/Group11.png) no-repeat;
        }
      }
    }
  }
  .headerLeft{
    justify-content: flex-start;
  }
}
.modal-post .tableBox{
  height: 600px;
  overflow: auto;
}
:deep(.ant-table-pagination.ant-pagination ){
  width: 100%;
  text-align: center;
}
.caozuo{
  padding: 0 16px;
}

</style>