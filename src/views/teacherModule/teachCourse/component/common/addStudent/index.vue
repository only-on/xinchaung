<template>
  <div class="addstudent">
    <a-modal
      :width="1200"
      cancelText="取消"
      okText="确定"
      title="添加学生"
      :visible="visable"
      @ok="handleOkSelect"
      @cancel="handleCancelSelect"
    >
      <div>
        <div class="headerselect">
      <div class="header-left">
        <a-form layout="inline">
          <a-form-item label="姓名">
            <a-input v-model:value='params.nick' @keyup.enter="onSearch"></a-input>
          </a-form-item>
          <a-form-item label="班级">
            <a-input v-model:value='params.class' @keyup.enter="onSearch"></a-input>
          </a-form-item>
          <a-form-item label="年级">
            <a-input v-model:value='params.grade' @keyup.enter="onSearch"></a-input>
          </a-form-item>
          <a-form-item label="专业">
            <a-input v-model:value='params.direct' @keyup.enter="onSearch"></a-input>
          </a-form-item>
        </a-form>
      </div>
      <div class="header-right">
        <!-- <a-button type="primary" class="brightBtn" @click="batchImport"
          >批量导入</a-button
        > -->
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      rowKey='id'
      :pagination="
        tableData.total > 10
          ? {
              hideOnSinglePage: false,
              showSizeChanger: true,
              total: tableData.total,
              current: params.page,
              pageSize: params.limit,
              onChange: onChange,
              onShowSizeChange: onShowSizeChange,
            }
          : false
      "
      :row-selection="{
        selectedRowKeys: tableData.selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: getCheckboxProps,
      }"
    >
    </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,reactive,watch } from "vue";
import request from 'src/api/index'
const http = (request as any).teacherMemberManage;
interface Props {
  type: any;
  visable:any;
  courseId:any;
}
const props = withDefaults(defineProps<Props>(), {
  type: () => {},
  visable:()=>{},
  courseId:()=>{}
})
const option: any = ref();
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
    dataIndex: "username",
    key: "username",
  },
  {
    title: "姓名",
    dataIndex: "user_profile.name",
    key: "user_profile.name",
  },
  {
    title: "性别",
    dataIndex: "user_profile.gender",
    key: "user_profile.gender",
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
    dataIndex: "user_profile.department",
    key: "user_profile.department",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "电话",
    dataIndex: "user_profile.phone",
    key: "user_profile.phone",
  },
];
const tableData: any = reactive({
  total: 0,
  selectedRowKeys:[]
});
const params:any=reactive({
  type:props.type,
  id:props.courseId,
  withs:'userProfile',
  nick:'',
  grade:'',
  direct:'',
  class:'',
  page:1,
  limit:10,
});
const emit = defineEmits<{ (e: "updateSelectStuVisable", val: any,selectkeyws:any): void }>();
function getCheckboxProps(record: any) {
  return {
    disabled: record.selected,
    defaultChecked: record.selected,
  };
}
function handleChange() {}
function onSearch(value: any) {
  console.log(value);
  params.page=1
  getallstudent()
}
function onChange(page: any, pageSize: any) {
  params.page=page;
  getallstudent()
}
function onShowSizeChange(current: any, size: any) {
  params.page=1;
  params.limit=size;
  getallstudent()
}
function onSelectChange(selectedRowKeys: any) {
  console.log(selectedRowKeys);
  tableData.selectedRowKeys=selectedRowKeys
}
function batchImport() {
  modalVisable.value = true;
  emit("updateSelectStuVisable", 'cancel',[]);
}
function handleOk() {
  modalVisable.value = false;
}
function handleCancel() {
  modalVisable.value = false;
}
function handleOkSelect(){
  emit("updateSelectStuVisable",'ok',tableData.selectedRowKeys);
  tableData.selectedRowKeys=[]
}
function handleCancelSelect(){
  emit("updateSelectStuVisable", 'cancel',[]);
  tableData.selectedRowKeys=[]
}
function getallstudent(){
  http.allstudentlist({param:params}).then((res:any)=>{
    data.value=res.data.list
    tableData.total=res.data.page.totalCount
  })
}
watch(
      () =>props.visable,
      () => {
        if(props.visable){
          getallstudent()
        }
      },
      { deep: true, immediate: true }
);
onMounted(()=>{
  // getallstudent()
})
</script>

<style lang="less" scoped>
.headerselect {
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
.addstudent {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
.icon-fanhui1 {
  color: var(--primary-color);
}
</style>
