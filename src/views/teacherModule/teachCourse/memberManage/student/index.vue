<template>
  <div class="student">
    <div class="header">
      <div class="header-left">
        <div class="input">
          <span class="lableclass">姓名</span>
          <a-input
          placeholder="请输入搜索关键字"
          style="width:180px"
          @keyup.enter="onSearch"
          v-model:value='params.nick'
        />
        </div>
        <div class="input">
          <span class="lableclass">班级</span>
          <a-input
          placeholder="请输入搜索关键字"
          v-model:value='params.class'
          style="width:180px"
          @keyup.enter="onSearch"
        />
        </div>
        <div class="input">
          <span class="lableclass">年级</span>
          <a-input
          placeholder="请输入搜索关键字"
          v-model:value='params.grade'
          style="width:180px"
          @keyup.enter="onSearch"
        />
        </div>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="delteteManyStu">移除学生</a-button>
        <a-button type="primary" class="marginBtn" @click="batchImport"
          >批量导入</a-button
        >
        <a-button class="marginBtn" type="primary" @click="addStudent">添加学生</a-button>
      </div>
    </div>
    <div class="tableHeight">
      <a-config-provider>
        <a-table
          rowKey='id'
            :columns="columns"
            :data-source="data"
            :pagination="
              tableData.total > 10
                ? {
                    hideOnSinglePage: false,
                    showSizeChanger:true,
                    total: tableData.total,
                    current: tableData.page,
                    pageSize: tableData.limit,
                    onChange: onChange,
                    onShowSizeChange: onShowSizeChange,
                  }
                : false
            "
            :row-selection="{
              selectedRowKeys: tableData.selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
    <template #action='{record}'>
      <div class="action">
        <span class='delete' @click="deleteStu(record.id)">删除</span>
        <span @click="initPassward(record.id)">初始化密码</span>
      </div>
    </template>
    </a-table>
          <template #renderEmpty>
            <div><Empty :height='80' :text='ifSearch?"抱歉，未搜到相关数据！":"抱歉，暂无数据！"' type="tableEmpty" /></div>
          </template>
        </a-config-provider> 
    </div>
    <addstudent :visable='visable' :courseId='courseId' @updateSelectStuVisable="updateSelectStuVisable" :type='1'></addstudent>
  </div>
  <a-modal
      :width="540"
      cancelText="返回"
      :visible="modalVisable"
      @ok="handleOk"
      @cancel="handleCancel"
      :okButtonProps="okButtonProps"
      title="批量导入"
    >
      <!-- <template #title>
        <span><span class="icon iconfont icon-fanhui1"></span>批量导入</span>
      </template> -->
      <div>
        <batchImportStu :modalVisable='modalVisable' @updateSelectStuVisable="updateSelectStuVisable"></batchImportStu>
      </div>
    </a-modal>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted,reactive } from "vue";
import addstudent from "src/views/teacherModule/teachCourse/component/common/addStudent/index.vue";
import batchImportStu from "./batchImportStudent/index.vue";
import request from 'src/api/index'
import { message,Modal } from "ant-design-vue";
import { useRouter ,useRoute } from 'vue-router';
const http = (request as any).teacherMemberManage;
const route=useRoute()
const courseId:any=route.query.courseId  //课程id
const okButtonProps: any = ref("");
okButtonProps.value = { style: { display: "none" } };
const option: any = ref();
const visable:any=ref(false);
option.value = [
  { id: "", name: "全部" },
  { id: 1, name: "班级1" },
  { id: 2, name: "班级2" },
  { id: 3, name: "班级3" },
];
const columns: any = ref();
const data: any = ref([]);
const modalVisable: any = ref(false);

const nick:any=ref('')
columns.value = [
  {
    title: "账号",
    dataIndex: "user.username",
    key: "user.username",
  },
  {
    title: "姓名",
    dataIndex: "userProfile.name",
    key: "userProfile.name",
    width:80,
    ellipsis: true,
  },
  {
    title: "性别",
    dataIndex: "userProfile.gender",
    key: "userProfile.gender",
  },
  {
    title: "班级",
    dataIndex: "classes",
    key: "classes",
    width:80,
    ellipsis: true,
  },
  {
    title: "年级",
    dataIndex: "userProfile.grade",
    key: "userProfile.grade",
  },
  {
    title: "专业",
    dataIndex: "userProfile.major",
    key: "userProfile.major",
    width:80,
    ellipsis: true,
  },
  {
    title: "学院",
    dataIndex: "userProfile.department",
    key: "userProfile.department",
    width:100,
    ellipsis: true,
  },
  {
    title: "邮箱",
    dataIndex: "user.email",
    key: "user.email",
    width:120,
    ellipsis: true,
  },
  {
    title: "电话",
    dataIndex: "userProfile.phone",
    key: "userProfile.phone",
    width:120,
  },
  {
    title: "操作",
    key: "action",
    slots: { customRender: "action" },
    width:140,
  },
];
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
  selectedRowKeys:[]
});
const tableParams:any=reactive({
  id:courseId,
  student_id:[],
  type:1
})
const params:any=reactive({
  type:1,
  id:courseId,
  withs:'userProfile,user',
  nick:'',
  grade:'',
  class:'',
  page: 1,
  limit: 10
})
const ifSearch:any=ref(false)
function handleChange() {}
function onSearch(value: any) {
  tableData.page=1
  getcoursestudent()
  if(params.nick||params.class||params.grade){
    ifSearch.value=true
  }else{
    ifSearch.value=false
  }
}
function onChange(page: any, pageSize: any) {
  console.log(pageSize,page)
  tableData.page=page
  tableData.limit=pageSize
  getcoursestudent()
}
function onShowSizeChange(current: any, size: any) {
  tableData.page=1
  tableData.limit=size
  getcoursestudent()
}
function onSelectChange(selectedRowKeys: any) {
  console.log(selectedRowKeys);
  tableData.selectedRowKeys=selectedRowKeys
}
function addStudent() {
  visable.value=true;
}
function handleOk() {
  modalVisable.value = false;
}
function handleCancel() {
  modalVisable.value = false;
}
function updateSelectStuVisable(value: any,studentids:any) {
  visable.value = false;
  console.log(value,'value')
  if(value==='ok'){
    tableParams.student_id=studentids
    addStuToCourse()
  }
}
function getcoursestudent(){
  // limit:tableData.limit,page:tableData.page
  params.page=tableData.page
  params.limit=tableData.limit
  http.coursestudentlist({param:params}).then((res:any)=>{
    data.value=res.data.list
    tableData.total=res.data.page.totalCount
  })
}
function addStuToCourse(){
  http.addStudentToCourse({param:tableParams}).then((res:any)=>{
    console.log(res)
    getcoursestudent()
  })
}
function deleteteStudent(id:any) {
        Modal.confirm({
            title: "确认删除吗？",
            content: "删除后不可恢复",
            okText: "确认",
            cancelText: "取消",
            onOk() {
              http.deleteStudentCourse({param:{id:id}}).then((res:any)=>{
                if(res.code){
                  tableData.selectedRowKeys=[]
                  tableData.page=1
                  getcoursestudent()
                }
          })
      }
  })    
}
function batchImport() {
  modalVisable.value = true;
  // emit("updateSelectStuVisable", 'cancel',[]);
}
function deleteStu(id:any){
  deleteteStudent([id])
}
// 批量删除
function delteteManyStu(){
  if(!tableData.selectedRowKeys?.length){
    message.warning('请至少选择一条记录！')
    return
  }
  deleteteStudent(tableData.selectedRowKeys)
}
function initPassward(id:any){
  Modal.confirm({
          title: "提示信息",
          width: "500px",
          content: "确定要重置密码吗？",
          okText:"确定",
          cancelText:"取消",
          onOk: () => {
            console.log("ok");
            http.resetPassWord({ param: { schedule_id: id } }).then((res: any) => {
              message.success("重置密码成功！");
            });
          },
          onCancel: () => {
            console.log("cancel");
          },
        });
}
onMounted(()=>{
  getcoursestudent()
})
</script>

<style lang="less" scoped>
.student {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .header-left {
      display: flex;
      :deep(.ant-select-selector) {
        height: 34px;
      }
      .input {
        margin-right: 20px;
        .lableclass {
          margin-right: 10px;
        }
      }
    }
    .header-right {
      .marginBtn {
        margin-left: 20px;
      }
    }
  }
}
.action{
  color: var(--primary-color);
  >span:hover{
    cursor: pointer;
  }
  .delete{
    margin-right:10px;
  }
}
.tableHeight{
  // height: 530px;
  // overflow-y: auto;
}
</style>
