<template>
    <div class="selectStuClass" v-layout-bg>
        <a-modal
        width="1000px"
        :rowkey='rowkey'
        :title="selectvalue===1?'学生选择':'班级选择'"
        :visible="isvisible"
        :confirm-loading="confirmLoading"
        :footer="null"
        @ok="handleOk"
        @cancel="handleCancel"
        >
        <div>
            <div>
                <a-form layout="inline" class="searchContent">
                    <div class="stuSearch" v-if="selectvalue===1">
                        <a-form-item label="学号">
                            <a-input style="width:150px" v-model:value="studentValue"></a-input>
                        </a-form-item>
                        <a-form-item label="姓名">
                            <a-input style="width:150px" v-model:value="fullName"></a-input>
                        </a-form-item>
                        <a-form-item label="院系">
                            <a-input style="width:150px" v-model:value="faculty"></a-input>
                        </a-form-item>
                    </div>
                    <div class="classSearch" v-else>
                        <a-form-item label="班级">
                            <a-input style="width:150px" v-model:value="classes"></a-input>
                        </a-form-item>
                    </div>
                    <div class="operateBtn">
                        <a-button class="add" type="primary" @click="addittion">添加</a-button>
                        <a-button class="clear" type="primary" @click="clearAll">清空</a-button>
                        <a-button type="primary" @click="inquiry">查询</a-button>
                    </div>
                    
                </a-form> 
            </div>
            <a-config-provider>
                    <a-table :columns="columns" :data-source="data" :row-selection="rowSelection"></a-table>
                    <template #renderEmpty>
                        <div><empty type="tableEmpty"></empty></div>
                    </template>
            </a-config-provider>
        </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
interface Istate{
   confirmLoading:boolean,
   selectClass:any[],
   selectStu:any[],
   columns:any[],
   data:any[],
   studentValue:string,
   fullName:string,
   faculty:string,
   classes:string
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'selectStuClass',
    props:['propTrainDetailInfo','trainId','selectvalue','isvisible'],
    components:{
        Empty
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
      confirmLoading:false,
      selectClass:[
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
        ],
        selectStu:[
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
        ],
        columns:[],
        data:[],
        studentValue:'',
        fullName:'',
        faculty:'',
        classes:''
    })
    const methods={
      handleOk(){
          context.emit('ifSelect','ok')
      },
      handleCancel(){
          context.emit('ifSelect','cancel')
      },
      rowkey(record: {}, index: number){
         return index
      },
      addittion(){
         console.log(props.selectvalue)
      },
      clearAll(){
        state.studentValue=''
        state.fullName=''
        state.faculty=''
        state.classes=''
      },
      inquiry(){
          console.log(props.selectvalue)
      }
    }
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
    watch(()=>props.selectvalue,(val:any)=>{
        state.columns=val===1?state.selectStu:state.selectClass  
    })
    onMounted(()=>{
        state.columns=state.selectStu
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
.searchContent{
    display: flex;
    // justify-content:space-between;
}
.stuSearch{
    display: flex;
 }
.operateBtn{
    display: flex;
    .add,.clear{
        margin-right:20px;
    }
}
</style>