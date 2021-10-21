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
                    <a-table :columns="columns" :data-source="data"></a-table>
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
            scopedSlots: { customRender: 'classname' },
        },
        {
            title: '人数',
            dataIndex: 'total',
            align: 'center',
            scopedSlots: { customRender: 'total' },
        },
        {
            title: '操作',
            dataIndex: '',
            align: 'center',
            scopedSlots: { customRender: 'action' },
        },
        ],
      stuColumns:[
    {
        title: '学号',
        dataIndex: 'stu_no',
        align: 'left',
        ellipsis: true,
        scopedSlots: { customRender: 'stu_no' },
    },
    {
        title: '姓名',
        dataIndex: 'username',
        ellipsis: true,
        scopedSlots: { customRender: 'username' },
    },
    {
        title: '所属院系',
        dataIndex: 'department',
        ellipsis: true,
        scopedSlots: { customRender: 'department' },
    },
    {
        title: '性别',
        dataIndex: 'gender',
        scopedSlots: { customRender: 'gender' },
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
        ellipsis: true,
        scopedSlots: { customRender: 'email' },
    },
    {
        title: '电话',
        dataIndex: 'phone',
        ellipsis: true,
        scopedSlots: { customRender: 'phone' },
    },
    {   title: '操作', 
        dataIndex: '', 
        align: 'center', 
        scopedSlots: { customRender: 'action' } 
    },
        ],
      columns:[],
      data:[]
    })
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
        }
    }
    onMounted(()=>{
        state.columns=state.stuColumns
    })
    return {...toRefs(state),...methods}
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