<template>
    <div class="customerInfor" v-layout-bg>
       <div class="radioInfo">
           <a-radio-group size="large" v-model:value="value" @change="onChange">
                <a-radio  :value="1">
                学生信息
                </a-radio>
                <a-radio  :value="2">
                班级信息
                </a-radio>
            </a-radio-group>
       </div>
       <div class="stuAndclass">
           <div class="operateBtn">
               <a-button type="primary" class="choice" @click="selectStuClass">选择</a-button>
               <a-button type="primary">移除</a-button>
           </div>
           <div>
                <a-config-provider>
                    <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :rowkey='rowkey'>
                        <template #stuaction>
                            <div>
                                <span>移除</span>
                                <span>初始化密码</span>
                            </div>
                        </template>
                        <template #classaction>
                            <div>
                                <span>查看</span>
                                <span>删除</span>
                            </div>
                        </template>
                    </a-table>
                    <template #renderEmpty>
                        <div><empty type="tableEmpty"></empty></div>
                    </template>
                </a-config-provider>
           </div>
           <div>
               <select-stu-class :selectvalue='value' :isvisible='isvisible' @if-select='ifSelect'></select-stu-class>
           </div>
       </div>
    </div>
</template>
<script lang="ts">
interface Istate{
   value:number,
   stuColumns:any[],
   classColumns:any[],
   columns:any[],
   data:any[],
   isvisible:boolean
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import selectStuClass from '../../components/selectStuClass/index.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'customerInfor',
    props:['propTrainDetailInfo','trainId'],
    components:{
        Empty,
        selectStuClass
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
      value:1,
      isvisible:false,
      classColumns:[
        {
            title: '班级名称',
            dataIndex: 'classname',
            align: 'center',
        },
        {
            title: '人数',
            dataIndex: 'total',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'classaction',
            align: 'center',
            slots: { customRender: 'classaction' },
        },
        ],
      stuColumns:[
    {
        title: '学号',
        dataIndex: 'stu_no',
        align: 'left',
        ellipsis: true,
    },
    {
        title: '姓名',
        dataIndex: 'username',
        ellipsis: true,
    },
    {
        title: '所属院系',
        dataIndex: 'department',
        ellipsis: true,
    },
    {
        title: '性别',
        dataIndex: 'gender',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
        ellipsis: true,
    },
    {
        title: '电话',
        dataIndex: 'phone',
        ellipsis: true,
    },
    {   title: '操作', 
        dataIndex: 'stuaction', 
        align: 'center', 
        slots: { customRender: 'stuaction' } 
    },
        ],
      columns:[],
      data:[]
    })
    const rowSelection = {
            onChange: (selectedRowKeys:any, selectedRows:any) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record:any, selected:any, selectedRows:any) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected:any, selectedRows:any, changeRows:any) => {
                console.log(selected, selectedRows, changeRows);
            },
        };
    const methods={
       onChange(e:any) {
        console.log('radio checked', e.target.value);
            state.columns=e.target.value===1?state.stuColumns:state.classColumns
        },
        selectStuClass(){
            state.isvisible=true
        },
        ifSelect(){
            state.isvisible=false
        },
        rowkey(record: {}, index: number){
         return index
        }
    }
    onMounted(()=>{
        state.columns=state.stuColumns
        console.log('请求学生接口')
        state.data=[
            {stu_no:1,username:'huahwww',classname:'班级1',total:2},
            {stu_no:2,username:'huahwww',classname:'班级2',total:12},
            {stu_no:3,username:'huahwww',classname:'班级3',total:23},
            ]
    })
    return {...toRefs(state),...methods,rowSelection}
    }
})
</script>
<style lang="less">
.customerInfor{
    margin: 10px;
    .radioInfo{
        .ant-radio-inner{
        width: 20px;
        height: 20px;
    }
    .ant-radio-input{
        width: 16px;
        height: 16px;
    }
  /* 单选选中样式 */
   .ant-radio-checked .ant-radio-inner {
    background-color: #8955b5;
    border: none;
  }
  .ant-radio-inner::after {
    content: '';
    width: 12px;
    height: 8px;
    border: 2px solid white;
    border-top: transparent;
    border-right: transparent;
    text-align: center;
    display: block;
    position: absolute;
    top: 4px;
    left: 4px;
    transform: rotate(-45deg);
    border-radius: 0px;
    background: none;
  }
    }
    .stuAndclass{
        margin-top: 20px;
        .operateBtn{
            .choice{
                margin-right: 10px;
            }
        }
    }
}
</style>