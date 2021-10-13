<template>
  <div v-layout-bg class="CreatedExamination">
    <div class="leftBox">
      <a-form :ref="formRef" :model="formState" :label-col="{span:6}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
        <a-form-item label="考试名称"  name="name">
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="考试试卷"  name="type">
          <a-select v-model:value="formState.type" placeholder="请选择发帖类型">
            <a-select-option value="1">求助</a-select-option>
            <a-select-option value="2">分享</a-select-option>
          </a-select>
        </a-form-item>
        <div class="duration">
          <a-form-item label="考试开始时间"  name="name" :label-col="{span:8}" :wrapper-col="{span:20}">
            <a-date-picker v-model:value="formState.title" />
          </a-form-item>
          <a-form-item label="考试时长"  name="name" :label-col="{span:6}" :wrapper-col="{span:16}">
            <a-input v-model:value="formState.title" />
            <div class="durationNotes">分钟</div>
          </a-form-item>
        </div>
        <a-form-item label="通过分数比例"  name="name" :label-col="{span:6}" :wrapper-col="{span:20}" class="proportion">
          <a-input v-model:value="formState.title" suffix="%" />
          <div class="notes">注：此分数为百分比分数</div>
        </a-form-item>
        <a-form-item label="考试公告" name="desc">
          <InputTextArea v-model:value="formState.desc"  />
         </a-form-item>
      </a-form>
    </div>
    <div class="rightBox"></div>
  </div>
  <div class="information">
    <div class="item">
      <a-button type="primary" @click="select()">选择</a-button>
      <a-button class="btn2" type="primary" @click="remove()">移除</a-button>
    </div>
    <div>
    <a-radio-group v-model:value="information">
      <a-radio value="1">班级信息</a-radio>
      <a-radio value="2">学生信息</a-radio>
    </a-radio-group>
  </div>
  </div>
  <a-config-provider :renderEmpty="customizeRenderEmpty">
    <a-table :columns="columns" :loading="loading" :data-source="selectList" :bordered="true"  row-key="id"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :pagination="{pageSize:pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
      class="components-table-demo-nested">
      <template #operation="{record}">
          <a  class="caozuo" @click="delateCard(record )" v-if="record.can_delete">移除</a>
        </template>
    </a-table>
  </a-config-provider>
  <div class="footer">
    <a-button type="primary" @click="cancel()"> 取 消 </a-button>
    <a-button type="primary" @click="sunmit()"> 确 定 </a-button>
  </div>
  <a-modal v-model:visible="visible" title="学生选择" @ok="handleReply" :width="1080" class="modal-post">
      <a-config-provider :renderEmpty="studentRenderEmpty">
        <a-table :columns="selectStudentColumns" :loading="loading" :data-source="selectList" :bordered="true"  row-key="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :pagination="{pageSize:pageSize,total:total,onChange:onChangePage,hideOnSinglePage:true}" 
          class="components-table-demo-nested">
        </a-table>
      </a-config-provider>
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
interface IFrom{
  name:string;
  page:number;
  limit:number;
  level_id:string | undefined
  pool_id:string | undefined
  type_id:number
}
interface Istate{
  formRef:string;
  formState:any
  rules:any;
  select: () => void;
  remove: () => void;
  onChangePage: (v:number) => void;
  information:string;
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
export default defineComponent({
  name: '',
  components: {
    InputTextArea: Input.TextArea
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    const route = useRoute();
    const {editId}= route.query
    const options =ref<SelectTypes['options']>([{value: '1', label: '简单'},{value: '2', label: '中等'},{value: '3', label: '困难'}])
    var totalCount:Ref<number> =ref(0)
    var loading:Ref<boolean> =ref(false)
    // const visible = ref<boolean>(false);
    const totalScore = ref<number>(0);
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside',backOff:true})
    const http=(request as any).teacherExam
    const state:Istate=reactive({
          formRef:'formRef',
          formState:{},
          rules:{
            name: [
              { required: true, message: '请输入试卷名称', trigger: 'blur'},
            ],
            description: [{ required: true, message: '请输入试卷描述类型', trigger: 'blur' }],
          },
          select:()=>{
            state.visible=true
          },
          remove:()=>{},
          information:'1',
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
          sunmit:()=>{},
          visible:false,
          handleReply:()=>{}

    })
    const customizeRenderEmpty =function (): VNode{
      if(state.loading){
        return <template></template>
      }else{
        let type='tableEmpty'
        return <empty type={type} height={200} text={'亲~这里什么都没有~'} />
      }
    }
    const studentRenderEmpty =function (): VNode{
      if(state.loading){
        return <template></template>
      }else{
        let type='tableEmpty'
        return <empty type={type} height={200} text={'亲~这里什么都没有~'} />
      }
    }
    onMounted(()=>{
    //  initData()
    })
    return {...toRefs(state),columns,selectStudentColumns,customizeRenderEmpty,studentRenderEmpty}
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
    }
  }
  .rightBox{
    width: 500px;
    // flex-grow: 1;
    height: 400px;
    border: 1px solid red;
  }
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
</style>