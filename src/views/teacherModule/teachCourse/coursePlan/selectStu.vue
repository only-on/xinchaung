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
            <a-input v-model:value='params.name' @keyup.enter="onSearch"></a-input>
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
          rowKey='stu_id'
          :pagination="
            total > 10
              ? {
                  hideOnSinglePage: false,
                  showSizeChanger:true,
                  total:total,
                  current: params.pageinfo.index,
                  pageSize: params.pageinfo.size,
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
          <template #renderEmpty>
            <div><Empty :text='ifSearch?"抱歉，未搜到相关数据！":"抱歉，暂无数据！"' type="tableEmpty" /></div>
          </template>
        </a-config-provider>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted,reactive,watch } from "vue";
import request from 'src/api/index'
const http = (request as any).coursePlain;
interface Props {
  // type: any;
  visable:any;
  // courseId:any;
  total:any;
  data:any;
  selectedStuIds:any
}
const props = withDefaults(defineProps<Props>(), {
  // type: () => {},
  visable:()=>{},
  // courseId:()=>{},
  total:()=>{},
  data:()=>{},
  selectedStuIds:()=>{}
})
const option: any = ref();
option.value = [
  { id: "", name: "全部" },
  { id: 1, name: "班级1" },
  { id: 2, name: "班级2" },
  { id: 3, name: "班级3" },
];
const columns: any = ref();
// const data: any = ref([]);
const modalVisable: any = ref(false);
columns.value = [
  {
    title: "账号",
    dataIndex: "stu_no",
    key: "stu_no",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
  },
  {
    title: "班级",
    dataIndex: "class_name",
    key: "class_name",
  },
  {
    title: "专业",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "学院",
    dataIndex: "department",
    key: "department",
    ellipsis:true
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
  // total: 0,
  selectedRowKeys:[],
  selectRows:[]
});
const params:any=reactive({
  // type:props.type,
  // id:props.courseId,
  // withs:'userProfile',
  // nick:'',
  // grade:'',
  // direct:'',
  // class:'',
  pageinfo:{
    index:1,
    size:10,
  }
});
const ifSearch:any=ref(false)
// const emit = defineEmits<{
//   (e: "submit"): void;
//   (e: "cancel"): void;
// }>();
const emit = defineEmits<{ (e: "updateSelectStuVisable", val: any,selectkeyws:any,data?:any): void;(e: "updateStuParams",params:any,): void; }>();
function getCheckboxProps(record: any) {
  return {
    disabled:props.selectedStuIds.includes(record.stu_id),
    defaultChecked:props.selectedStuIds.includes(record.stu_id),
  };
}
function handleChange() {}
function onSearch(value: any) {
  console.log(value);
  params.pageinfo.index=1
  // getallstudent()
  let param:any={
   page:1,
   stu_no:params.name,
   classname:params.class,
   grade:params.grade,
   major:params.direct
  }
  emit('updateStuParams',param)
  if(params.name||params.class||params.grade||params.direct){
    ifSearch.value=true
  }else{
    ifSearch.value=false
  }
}
function onChange(page: any, pageSize: any) {
  params.pageinfo.index=page;
  // getallstudent()
  let param:any={
    page:page,
    stu_no:params.name,
    classname:params.class,
    grade:params.grade,
    major:params.direct
  }
  emit('updateStuParams',param)
}
function onShowSizeChange(current: any, size: any) {
  params.pageinfo.index=1;
  params.pageinfo.size=size;
  let param:any={
    page:params.pageinfo.index,
    pageSize:size,
    stu_no:params.name,
    classname:params.class,
    grade:params.grade,
    major:params.direct
  }
  emit('updateStuParams',param)
}
function onSelectChange(selectedRowKeys: any) {
  console.log(selectedRowKeys);
  tableData.selectedRowKeys=selectedRowKeys
}
function neverShow(record: any) {
      // const neverShowId = [...selectedIds.value[props.currentType]].includes(record[id]);
      // if (neverShowId) {
      //   return false;
      // } else {
      //   return true;
      // }
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
  // tableData.selectedRowKeys=[]
}
function handleCancelSelect(){
  emit("updateSelectStuVisable", 'cancel',[]);
  tableData.selectedRowKeys=[]
  params.name=''
  params.class=''
  params.grade=''
  params.direct=''
  let param:any={
   page:1,
   stu_no:params.name,
   classname:params.class,
   grade:params.grade,
   major:params.direct
  }
  emit('updateStuParams',param)
}
// function getStudentList() {
//       loading.value = true;
//       let param = {
//         pageinfo: { index: pageinfo.page, size: pageinfo.pageSize },
//         query: { class_ids: [], stu_no: name.value },
//       };
//       http.getStudentList({ param }).then((res: IBusinessResp) => {
//         loading.value = false;
//         let { data, page, total } = res.data;
//         dataList.student = data;
//         pageinfo.total = total;
//       });
//     }
// function getallstudent(){
//   http.getStudentList({param:params}).then((res:any)=>{
//     data.value=res.data?.data
//     tableData.total=res.data.total
//   })
// }
watch(
      () =>props.selectedStuIds,
      () => {
        if(props.selectedStuIds){
          tableData.selectedRowKeys=props.selectedStuIds
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
:deep(.ant-pagination){
  float: none;
  text-align: center;
}
</style>
