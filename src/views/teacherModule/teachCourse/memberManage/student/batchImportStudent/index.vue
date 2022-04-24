<template>
  <div id="batchImportStu">
    <div class="batchTop">
     
      <a-upload
          name="file"
          :multiple="true"
          :show-upload-list="false"
          accept=".xlsx"
          :customRequest="beforeUpload"
        >
        <a-button type="primary">选择文件</a-button>
        </a-upload>
      <span>
        <span class="downTemplate">下载学生模板</span>
        <span class="title">*建议每次导入的数量不要超过500条</span>
      </span>
    </div>
    <div class="importStatistic">
      <span class="hasImport">已导入20条</span>
      <span>未导入0条</span>
      <span></span>
    </div>
  </div>
  <a-table
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
  >
  </a-table>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, reactive } from "vue";
import student from "./student/index.vue";
import group from "./group/index.vue";
import assistant from "./assistant/index.vue";
import request from 'src/api/index'
import { message,Modal } from "ant-design-vue";
const http = (request as any).teacherMemberManage;
const columns: any = ref();
const data: any = ref([]);
columns.value = [
  {
    title: "账号",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "姓名",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "导入情况",
    dataIndex: "age",
    key: "age",
  },
];
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
function beforeUpload(file:any){
  console.log(file)
  const fd = new FormData()
  fd.append('file',file.file)
 http.importStu({param:fd}).then((res:any)=>{
      if(res.code){
        message.warning('导入成功')
      }
 })
}
function onChange(page: any, pageSize: any) {}
function onShowSizeChange(current: any, size: any) {}
function callback() {}
</script>

<style lang="less" scoped>
.downTemplate {
  text-decoration: underline;
  color: var(--brightBtn);
  margin-left: 10px;
  margin-right: 10px;
}
.title {
  color: var(--black-45);
  font-size: 12px;
}
.importStatistic {
  margin-top: 24px;
  margin-bottom: 8px;
  .hasImport {
    margin-right: 20px;
  }
}
</style>
