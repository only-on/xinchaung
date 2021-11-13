<template>
    <div class="selectStuClass" v-layout-bg>
        <a-modal
        width="1000px"
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
                    <a-table :columns="columns" :loading='unselectLoading' :data-source="unSelectData" :row-selection="rowSelection" rowKey="id">
                        <template #department="{ record }">
                            <div>{{ record.user_profile.department}}</div>
                        </template>
                        <template #gender="{ record }">
                            <div>{{ record.user_profile.gender}}</div>
                        </template>
                        <template #phone="{ record }">
                            <div>{{ record.user_profile.phone}}</div>
                        </template>
                    </a-table>
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
   classes:string,
   selectedRows:any[],
   unSelectKeys:any[],
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import test from './test.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'selectStuClass',
    props:['propTrainDetailInfo','trainId','selectvalue','isvisible','addids','unSelectData','unselectLoading'],
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
            dataIndex: 'number',
            align: 'center',
            scopedSlots: { customRender: 'number' },
        },
        ],
        selectStu:[
        {
            title: '学号',
            dataIndex: 'id',
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
            slots: { customRender: 'department' },
        },
        {
            title: '性别',
            dataIndex: 'gender',
            slots: { customRender: 'gender' },
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
            slots: { customRender: 'phone' },
        },
        ],
        columns:[],
        data:[],
        studentValue:'',
        fullName:'',
        faculty:'',
        classes:'',
        selectedRows:[],
        unSelectKeys:[]
    })
    const rowSelection = {
        //    selectedRowKeys:state.selectedRows,
           onChange: (selectedRowKeys:any, selectedRows:any) => {
                state.selectedRows=selectedRows
            },
            onSelectAll: (selected:any, selectedRows:any, changeRows:any) => {
                state.selectedRows=selectedRows
            },
            getCheckboxProps: (record:any) => ({
                disabled: record.selected,
                defaultChecked:record.selected
            }),
    };
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
        //   添加
        console.log(state.selectedRows,'选中的数据')
        context.emit('selected-rows',state.selectedRows,props.selectvalue)
      },
      clearAll(){
        state.studentValue=''
        state.fullName=''
        state.faculty=''
        state.classes=''
      },
      inquiry(){
          console.log(state.studentValue,state.fullName,state.faculty,state.classes)
              context.emit('search-inquiry',state.studentValue,state.fullName,state.faculty,state.classes)
        },
    }
    watch(()=>props.isvisible,(val:any)=>{
        state.columns=props.selectvalue===1?state.selectStu:state.selectClass  
        },{
            immediate:true 
        })
    onMounted(()=>{
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