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
    <a-config-provider>
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
          <template v-slot:bodyCell="{column,record}">
            <template v-if="column.dataIndex === 'name'">
              <span>{{record.user_profile.name}}</span>
            </template>
            <template v-if="column.dataIndex === 'gender'">
              <span>{{record.user_profile.gender}}</span>
            </template>
            <template v-if="column.dataIndex === 'grade'">
              <span>{{record.user_profile.grade}}</span>
            </template>
            <template v-if="column.dataIndex === 'major'">
              <span>{{record.user_profile.major}}</span>
            </template>
            <template v-if="column.dataIndex === 'department'">
              <span>{{record.user_profile.department}}</span>
            </template>
            <template v-if="column.dataIndex === 'department'">
              <span>{{record.user_profile.department}}</span>
            </template>
            <template v-if="column.dataIndex === 'phone'">
              <span>{{record.user_profile.phone}}</span>
            </template>
          </template>
          </a-table>
          <template #renderEmpty>
            <div><Empty :height='80' :text='ifSearch?"抱歉，未搜到相关数据！":"抱歉，暂无数据！"' type="tableEmpty" /></div>
          </template>
        </a-config-provider> 
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
const ifSearch:any=ref('')
const modalVisable: any = ref(false);
columns.value = [
  {
    title: "账号",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
  },
  {
    title: "性别",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "班级",
    dataIndex: "classes",
    key: "classes",
  },
  {
    title: "年级",
    dataIndex: "grade",
    key: "grade",
  },
  {
    title: "专业",
    dataIndex: "major",
    key: "major",
  },
  {
    title: "学院",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
    width:150,
  },
  {
    title: "电话",
    dataIndex: "phone",
    key: "phone",
    width:150,
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
    disabled: record.selected
  };
}
function handleChange() {}
function onSearch(value: any) {
  console.log(value);
  params.page=1
  getallstudent()
  if(params.nick||params.class||params.grade||params.direct){
    ifSearch.value=true
  }else{
    ifSearch.value=false
  }
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
  tableData.selectedRowKeys.length = 0
  http.allstudentlist({param:params}).then((res:any)=>{
    data.value=res.data.list
    tableData.total=res.data.page.totalCount
    res.data.list.forEach((item:any) => {
      if(item.selected){
        tableData.selectedRowKeys.push(item.id)
      }
    })
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
:deep(.ant-table-pagination.ant-pagination){
  float: none;
  text-align: center;
}
</style>
