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
                            <a-input style="width:150px"></a-input>
                        </a-form-item>
                        <a-form-item label="姓名">
                            <a-input style="width:150px"></a-input>
                        </a-form-item>
                        <a-form-item label="院系">
                            <a-input style="width:150px"></a-input>
                        </a-form-item>
                    </div>
                    <div class="classSearch" v-else>
                        <a-form-item label="班级">
                            <a-input style="width:150px"></a-input>
                        </a-form-item>
                    </div>
                    <div class="operateBtn">
                        <a-button class="add" type="primary">添加</a-button>
                        <a-button class="clear" type="primary">清空</a-button>
                        <a-button type="primary">查询</a-button>
                    </div>
                    
                </a-form> 
            </div>
            <a-config-provider>
                    <a-table :columns="columns" :data-source="data"></a-table>
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
   data:any[]
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
        data:[]
    })
    const methods={
      handleOk(){
          context.emit('ifSelect','ok')
      },
      handleCancel(){
          context.emit('ifSelect','cancel')
      }
    }
    watch(()=>props.selectvalue,(val:any)=>{
        console.log(val) 
        state.columns=val===1?state.selectStu:state.selectClass  
    })
    onMounted(()=>{
        state.columns=state.selectStu
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.searchContent{
    display: flex;
    justify-content:space-between;
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