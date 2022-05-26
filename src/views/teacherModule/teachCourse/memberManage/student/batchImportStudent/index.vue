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
        <span class="downTemplate" @click="downloadTemplate">下载学生模板</span>
        <span class="title">*建议每次导入的数量不要超过500条</span>
      </span>
    </div>
    <div class="importStatistic">
      <span class="hasImport">已导入{{hasImport}}条</span>
      <span>未导入{{tableData.total-hasImport}}条</span>
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
            showSizeChanger:false,
            total: tableData.total,
            current: tableData.page,
            pageSize: tableData.limit,
            onChange: onChange,
            onShowSizeChange: onShowSizeChange,
          }
        : false
    "
  >
          <template #success='{record}'>
            <div>
              <span v-if="record.success">
                <span class="yellow"  v-if="record.result!==''">{{record.result}}</span>
                <span v-else class="green">导入成功</span>
              </span>
              <span class="red" v-else>{{record.result}}</span>
            </div>
          </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, reactive ,watch} from "vue";
import student from "./student/index.vue";
import group from "./group/index.vue";
import assistant from "./assistant/index.vue";
import request from 'src/api/index'
import { message,Modal } from "ant-design-vue";
import FileSaver from "file-saver";
const http = (request as any).teacherMemberManage;
const columns: any = ref();
const data: any = ref([]);
const hasImport:any=ref(0)
interface Props {
  modalVisable:any;
}
const props = withDefaults(defineProps<Props>(), {
  modalVisable:() =>{}
})
columns.value = [
  {
    title: "账号",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "导入情况",
    dataIndex: "success",
    key: "success",
    slots: { customRender: "success" },
  }
];
const tableData: any = reactive({
  total: 0,
  page: 1,
  limit: 10,
});
const allTableData:any=ref([])
const successData:any=ref([])
const emit = defineEmits<{ (e: "updateSelectStuVisable", val: any,selectkeyws:any): void }>();
function beforeUpload(file:any){
  console.log(file)
  const fd = new FormData()
  fd.append('file',file.file)
 http.importStu({param:fd}).then((res:any)=>{
      if(res.code){
        // message.warning('导入成功')
        allTableData.value=res.data
        data.value=res.data
        tableData.total=data.value?.length
        successData.value=data.value?.filter((item:any)=>{
          return item.success==true&&item.result==''
        })
        console.log(successData.value)
        hasImport.value=successData.value?.length
        let ids:any=[]
        successData.value.forEach((item:any)=> {
          ids.push(item.id)
        });
        if(ids?.length){
          emit("updateSelectStuVisable",'ok',ids);
        }
      }
 })
}
function onChange(page: any, pageSize: any) {
  tableData.page=page
}
function onShowSizeChange(current: any, size: any) {}
function callback() {}
function downloadTemplate(){
  let development = process.env.NODE_ENV == "development" ? true : false;
      let url = development
        ? './public/template/Student.xlsx'
        : "/uploadfiles/import/student.xlsx"; 
      FileSaver.saveAs(url,'学生模版');
}

watch(() => props.modalVisable, (val:any) => {
  data.value=[]
  tableData.total=0
  tableData.page=1
  tableData.limit=10
}, {
  deep: true,
  immediate:true
})
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
:deep(.ant-table-pagination.ant-pagination){
  float: none;
  text-align: center;
}
.yellow{
  color:var(--primary-color);
}
.green{
  color: green;
}
.red{
  color: red;
}
</style>
