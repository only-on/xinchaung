<template>
  <div class="student">
    <div class="header">
      <div class="header-left">
        <div class="header-left-select">
          <span class="lableclass">班级</span>
          <a-select default-value="全部" style="width: 224px" @change="handleChange">
            <a-select-option v-for="item in option" :key="item.id"
              >{{ item.name }}
            </a-select-option>
          </a-select>
        </div>
        <a-input-search
          placeholder="请输入搜索关键字"
          style="width: 254px"
          @search="onSearch"
        />
      </div>
      <div class="header-right">
        <a-button type="primary" @click="delteteManyStu">移除学生</a-button>
        <a-button class="brightBtn" type="primary" @click="addStudent">添加学生</a-button>
      </div>
    </div>
    <a-table
    rowKey='id'
      :columns="columns"
      :data-source="data"
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger: true,
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
        <span @click="initPassward">初始化密码</span>
      </div>
    </template>
    </a-table>
    <addstudent :visable='visable' @updateSelectStuVisable="updateSelectStuVisable" :type='1'></addstudent>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted,reactive } from "vue";
import addstudent from "./addStudent/index.vue";
import request from 'src/api/index'
const http = (request as any).teacherMemberManage;
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
  },
  {
    title: "性别",
    dataIndex: "userProfile.gender",
    key: "userProfile.gender",
  },
  {
    title: "班级",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "专业",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "学院",
    dataIndex: "userProfile.department",
    key: "userProfile.department",
  },
  {
    title: "邮箱",
    dataIndex: "user.email",
    key: "user.email",
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
  id:50404,
  student_id:[],
  type:1
})
function handleChange() {}
function onSearch(value: any) {
  console.log(value);
}
function onChange(page: any, pageSize: any) {}
function onShowSizeChange(current: any, size: any) {}
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
  if(value==='ok'){
    tableParams.student_id=studentids
    addStuToCourse()
  }
}
function getcoursestudent(){
  http.coursestudentlist({param:{type:1,id:50404,withs:'userProfile,user'}}).then((res:any)=>{
    data.value=res.data.list
  })
}
function addStuToCourse(){
  http.addStudentToCourse({param:tableParams}).then((res:any)=>{
    console.log(res)
    getcoursestudent()
  })
}
function deleteteStudent(id:any) {
    http.deleteStudentCourse({param:{id:id}}).then((res:any)=>{
      console.log(res)
      getcoursestudent()
    })
}
function deleteStu(id:any){
  deleteteStudent([id])
}
// 批量删除
function delteteManyStu(){
  deleteteStudent(tableData.selectedRowKeys)
}
function initPassward(){

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
      .header-left-select {
        margin-right: 20px;
        .lableclass {
          margin-right: 10px;
        }
      }
    }
    .header-right {
      .brightBtn {
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
</style>
